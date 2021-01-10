import * as babel from "@babel/core"
import { createMacro, MacroParams } from "babel-plugin-macros"
import { raise } from "./helpers"

function twindMacro({ state }: MacroParams) {
	const program = state.file.path

	program.traverse({
		JSXOpeningElement(path) {
			const attributeList = path.get("attributes")

			const twAttribute = getAttribute(attributeList, "tw")
			if (!twAttribute) return

			const twAttributeValue = getAttributeValue(twAttribute)
			const twCall = babel.types.callExpression(babel.types.identifier("tw"), [
				twAttributeValue,
			])

			const classAttribute = getAttribute(attributeList, "className")

			const classAttributeValue =
				classAttribute && getAttributeValue(classAttribute)

			const newAttributeValue = classAttributeValue
				? babel.types.templateLiteral(
						[
							babel.types.templateElement({ raw: "" }),
							babel.types.templateElement({ raw: " " }),
							babel.types.templateElement({ raw: "" }),
						],
						[classAttributeValue, twCall],
				  )
				: twCall

			twAttribute.remove()
			classAttribute?.remove()

			path.node.attributes.push(
				babel.types.jsxAttribute(
					babel.types.jsxIdentifier("className"),
					babel.types.jsxExpressionContainer(newAttributeValue),
				),
			)
		},
	})

	program.node.body.unshift(
		babel.types.importDeclaration(
			[
				babel.types.importSpecifier(
					babel.types.identifier("tw"),
					babel.types.identifier("tw"),
				),
			],
			babel.types.stringLiteral("twind"),
		),
	)
}

export default createMacro(twindMacro)

const getAttribute = (
	attributeList: Array<
		babel.NodePath<babel.types.JSXAttribute | babel.types.JSXSpreadAttribute>
	>,
	name: string,
): babel.NodePath<babel.types.JSXAttribute> | undefined => {
	for (const attribute of attributeList) {
		if (attribute.isJSXAttribute()) {
			const nodeName = attribute.node.name
			if (babel.types.isJSXIdentifier(nodeName) && nodeName.name === name) {
				return attribute
			}
		}
	}
}

const getAttributeValue = (
	attributePath: babel.NodePath<babel.types.JSXAttribute>,
) => {
	const attributeValue =
		attributePath.node.value ??
		raise(
			`Unexpected error: ` +
				`JSX attribute "${attributePath.node.name.name}" has no value`,
		)

	return babel.types.isJSXExpressionContainer(attributeValue)
		? assertNotJSXEmpty(attributeValue.expression)
		: attributeValue
}

function assertNotJSXEmpty<T extends babel.types.Node>(
	expression: T,
): Exclude<T, babel.types.JSXEmptyExpression> {
	// @ts-expect-error
	return babel.types.isJSXEmptyExpression(expression)
		? raise("JSX empty expressions are not allowed")
		: expression
}
