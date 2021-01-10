import * as babel from '@babel/core'
import { createMacro, MacroParams } from 'babel-plugin-macros'
import { findJsxAttributeByName, getJsxAttributeName, getJsxAttributeValue } from './jsx-attribute'

function twindMacro({ state }: MacroParams) {
  const program = state.file.path

  program.traverse({
    JSXOpeningElement(path) {
      const twAttribute = findJsxAttributeByName(path.node, 'tw')
      const twAttributeValue = getJsxAttributeValue(twAttribute)
      if (!twAttributeValue) return

      const twCall = babel.types.callExpression(babel.types.identifier('tw'), [twAttributeValue])

      const classAttribute = findJsxAttributeByName(path.node, 'className')
      const classAttributeValue = getJsxAttributeValue(classAttribute)

      const newAttributeValue = classAttributeValue
        ? babel.types.templateLiteral(
            [
              babel.types.templateElement({ raw: '' }),
              babel.types.templateElement({ raw: ' ' }),
              babel.types.templateElement({ raw: '' }),
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
          babel.types.jsxAttribute(
            babel.types.jsxIdentifier('className'),
            babel.types.jsxExpressionContainer(newAttributeValue),
          ),
        )
    },
  })

  program.node.body.unshift(
    babel.types.importDeclaration(
      [babel.types.importSpecifier(babel.types.identifier('tw'), babel.types.identifier('tw'))],
      babel.types.stringLiteral('twind'),
    ),
  )
}

export default createMacro(twindMacro)
