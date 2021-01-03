// @ts-check
const { createMacro } = require("babel-plugin-macros")

module.exports = createMacro(function twindMacro({
	state,
	babel: { types: t },
}) {
	const program = state.file.path
	program.traverse({
		JSXAttribute(path) {
			const attributeName = path.node.name.name
			if (attributeName === "tw") {
				const value = path.node.value

				const newValue = t.isJSXExpressionContainer(value)
					? assertNotJSXEmpty(value.expression, t)
					: value

				if (newValue) {
					const fnCall = t.callExpression(t.identifier("tw"), [newValue])

					path.replaceWith(
						t.jsxAttribute(
							t.jsxIdentifier("className"),
							t.jsxExpressionContainer(fnCall),
						),
					)
				}
			}
		},
	})

	program.node.body.unshift(
		t.importDeclaration(
			[t.importSpecifier(t.identifier("tw"), t.identifier("tw"))],
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
