// @ts-check
const { transform } = require("@babel/core")
const { join } = require("path")

test("tw prop - simple", () => {
	const input = `
	import "./macro"
	const simple = <button tw="bg-blue-500" />
	`

	expect(transpile(input)?.code).toMatchSnapshot()
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

	expect(transpile(input)?.code).toMatchSnapshot()
})

test("doesn't conflict with the existing import", () => {
	const input = `
	import { tw } from "twind"
	import "./macro"
	const buttonStyle = tw\`bg-blue-500\`
	const simple = <button tw={[buttonStyle, "text-white"]} />
	`

	expect(transpile(input)?.code).toMatchSnapshot()
})

test.todo("merges existing `className` prop with `tw` prop")

/**
 * @param {string} code
 */
function transpile(code) {
	/** @type {import('@babel/core').TransformOptions} */
	const options = {
		plugins: ["@babel/syntax-jsx", "macros"],
		filename: join(__dirname, "testfile.js"),
	}
	return transform(code, options)
}
