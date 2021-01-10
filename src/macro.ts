import { types } from '@babel/core'
import { createMacro, MacroParams } from 'babel-plugin-macros'
import { findJsxAttributeByName, getJsxAttributeName, getJsxAttributeValue } from './jsx-attribute'

function createTwCall(value: types.Expression) {
  if (types.isStringLiteral(value)) {
    return types.taggedTemplateExpression(
      types.identifier('tw'),
      types.templateLiteral([types.templateElement({ raw: value.value })], []),
    )
  }

  return types.callExpression(types.identifier('tw'), [value])
}

function twindMacro({ state }: MacroParams) {
  const program = state.file.path

  program.traverse({
    JSXOpeningElement(path) {
      const twAttribute = findJsxAttributeByName(path.node, 'tw')
      const twAttributeValue = getJsxAttributeValue(twAttribute)
      if (!twAttributeValue) return

      const twCall = createTwCall(twAttributeValue)

      const classAttribute = findJsxAttributeByName(path.node, 'className')
      const classAttributeValue = getJsxAttributeValue(classAttribute)

      const newAttributeValue = classAttributeValue
        ? types.templateLiteral(
            [
              types.templateElement({ raw: '' }),
              types.templateElement({ raw: ' ' }),
              types.templateElement({ raw: '' }),
            ],
            [classAttributeValue, twCall],
          )
        : twCall

      path.node.attributes = path.node.attributes
        // remove existing tw and className attributes
        .filter((node) => {
          const name = getJsxAttributeName(node)
          return name !== 'tw' && name !== 'className'
        })
        // add new className attribute
        .concat(
          types.jsxAttribute(
            types.jsxIdentifier('className'),
            types.jsxExpressionContainer(newAttributeValue),
          ),
        )
    },
  })

  program.node.body.unshift(
    types.importDeclaration(
      [types.importSpecifier(types.identifier('tw'), types.identifier('tw'))],
      types.stringLiteral('twind'),
    ),
  )
}

export default createMacro(twindMacro)
