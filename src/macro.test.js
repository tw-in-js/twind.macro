// @ts-check
const { transform } = require("@babel/core")
const { join } = require("path")

const input = `
import "./macro"

const simple = <button tw="bg-blue-500" />

const complex = <button tw={["bg-blue-500", condition && "text-white", { 'leading-none': true }]} />
`

/** @type {import('@babel/core').TransformOptions} */
const options = {
	presets: ["@babel/react"],
	plugins: ["macros"],
	filename: join(__dirname, "testfile.js"),
}

console.log(transform(input, options).code)
