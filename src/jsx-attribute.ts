import { types } from '@babel/core'

export function findJsxAttributeByName(
  jsxOpeningTag: types.JSXOpeningElement,
  name: string,
): types.JSXAttribute | undefined {
  for (const node of jsxOpeningTag.attributes) {
    if (types.isJSXAttribute(node) && getJsxAttributeName(node) === name) {
      return node
    }
  }
}

export function getJsxAttributeName(node: types.Node): string | undefined {
  if (types.isJSXAttribute(node) && types.isJSXIdentifier(node.name)) {
    return node.name.name
  }
}

export function getJsxAttributeValue(
  attributeNode: types.Node | undefined,
): types.Expression | undefined {
  if (!types.isJSXAttribute(attributeNode)) return

  // not sure when this would happen 🤷‍♂️
  if (!attributeNode.value) return

  // an expression container is like `attr={...}`,
  // so if it's not in a container,
  // we can just return the literal string or JSX node here
  if (!types.isJSXExpressionContainer(attributeNode.value)) {
    return attributeNode.value
  }

  const innerExpression = attributeNode.value.expression

  // this is the case of `attr={}`,
  // which is syntactically valid for some reason
  if (types.isJSXEmptyExpression(innerExpression)) return undefined

  return innerExpression
}
