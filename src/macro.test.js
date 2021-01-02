// @ts-check
const { transform } = require("@babel/core")
const { join } = require("path")

test("tw prop - simple", () => {
	const input = `
	import "./macro"
	const simple = <button tw="bg-blue-500" />
	`

	expect(getAst(input)).toMatchSnapshot()
})

test("tw prop - complex", () => {
	const input = `
	import "./macro"
	const complex = (
		<button
			tw={[
				"bg-blue-500",
				condition && "text-white",
				{ 'leading-none': true },
			]}
		/>
	)
	`

	expect(getAst(input)).toMatchSnapshot()
})

/**
 * @param {string} code
 */
function getAst(code) {
	/** @type {import('@babel/core').TransformOptions} */
	const options = {
		presets: [],
		plugins: ["@babel/syntax-jsx", "macros"],
		filename: join(__dirname, "testfile.js"),
	}
	return transform(code, options).code
}
