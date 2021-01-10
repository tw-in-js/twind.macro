import { types } from '@babel/core'

// WIP, this is broken
export function flattenTemplateLiteral({ expressions, quasis }: types.TemplateLiteral) {
  const newConstants: types.TemplateElement[] = []
  const newExpressions: types.Expression[] = []

  let constantIndex = 0
  for (const node of expressions) {
    if (types.isStringLiteral(node)) {
      const before = quasis[constantIndex]!
      const after = quasis[constantIndex + 1]!

      const prevConstant = newConstants[newConstants.length - 1]
      if (prevConstant)
        newConstants.push(
          types.templateElement({
            raw: `${before.value}${node.value}${after.value}`,
          }),
        )
    }
  }

  return [newConstants, newExpressions] as const
}
