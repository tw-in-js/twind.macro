// @ts-check
const { createMacro } = require("babel-plugin-macros")
const { localName } = require("./constants")
const { raise } = require("./helpers")

module.exports = createMacro(function twindMacro({
	state,
	babel: { types: t },
}) {
	const program = state.file.path

	program.traverse({
		JSXOpeningElement(path) {
			const attributeList = path.get("attributes")

			/**
			 * @param {string} name
			 * @returns {babel.NodePath<babel.types.JSXAttribute> | undefined}
			 */
			const getAttribute = (name) => {
				for (const attribute of attributeList) {
					if (attribute.isJSXAttribute()) {
						const nodeName = attribute.node.name
						if (t.isJSXIdentifier(nodeName) && nodeName.name === name) {
							return attribute
						}
					}
				}
			}

			/**
			 * @param {babel.NodePath<babel.types.JSXAttribute>} attributePath
			 */
			const getAttributeValue = (attributePath) => {
				const attributeValue =
					attributePath.node.value ??
					raise(
						`Unexpected error: ` +
							`JSX attribute "${attributePath.node.name.name}" has no value`,
					)

				return t.isJSXExpressionContainer(attributeValue)
					? assertNotJSXEmpty(attributeValue.expression, t)
					: attributeValue
			}

			const twAttribute = getAttribute("tw")
			if (!twAttribute) return

			const twAttributeValue = getAttributeValue(twAttribute)
			const twCall = t.callExpression(t.identifier(localName), [
				twAttributeValue,
			])

			const classAttribute = getAttribute("className")

			const classAttributeValue =
				classAttribute && getAttributeValue(classAttribute)

			const newAttributeValue = classAttributeValue
				? t.templateLiteral(
						[
							t.templateElement({ raw: "" }),
							t.templateElement({ raw: " " }),
							t.templateElement({ raw: "" }),
						],
						[classAttributeValue, twCall],
				  )
				: twCall

			twAttribute.remove()
			classAttribute?.remove()

			path.node.attributes.push(
				t.jsxAttribute(
					t.jsxIdentifier("className"),
					t.jsxExpressionContainer(newAttributeValue),
				),
			)
		},
	})

	program.node.body.unshift(
		t.importDeclaration(
			[t.importSpecifier(t.identifier(localName), t.identifier("tw"))],
			t.stringLiteral("twind"),
		),
	)
})

/**
 * @template {babel.types.Node} T
 * @param {T} expression
 * @param {typeof babel.types} t
 * @returns {Exclude<T, babel.types.JSXEmptyExpression>}
 */
function assertNotJSXEmpty(expression, t) {
	if (t.isJSXEmptyExpression(expression)) {
		throw new Error("JSX empty expressions are not allowed")
	}
	// @ts-ignore
	return expression
}
