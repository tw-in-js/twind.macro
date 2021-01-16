import * as babel from '@babel/core'
import annotateAsPure from '@babel/helper-annotate-as-pure'
import { createMacro, MacroParams } from 'babel-plugin-macros'
import { findJsxAttributeByName, getJsxAttributeName, getJsxAttributeValue } from './jsx-attribute'

function twindMacro({ state, references }: MacroParams) {
  const program = state.file.path
  const localImportName = program.scope.generateUid('tw')

  program.traverse({
    JSXOpeningElement(path) {
      const twAttribute = findJsxAttributeByName(path.node, 'tw')
      const twAttributeValue = getJsxAttributeValue(twAttribute)
      if (!twAttributeValue) return

      const twCall = babel.types.callExpression(babel.types.identifier(localImportName), [
        twAttributeValue,
      ])
      annotateAsPure(twCall)

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

  references['tw']?.forEach((path) => {
    if (babel.types.isIdentifier(path.node)) {
      path.node.name = localImportName
    }
    annotateAsPure(path.parent)
  })

  program.node.body.unshift(
    babel.types.importDeclaration(
      [
        babel.types.importSpecifier(
          babel.types.identifier(localImportName),
          babel.types.identifier('tw'),
        ),
      ],
      babel.types.stringLiteral('twind'),
    ),
  )
}

export default createMacro(twindMacro)
