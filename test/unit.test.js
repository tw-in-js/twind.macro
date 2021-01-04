import * as babel from "@babel/core"
import { join } from "path"

test("adds twind import", () => {
	const code = `
	import '../src/macro'
	const jsx = <button tw="bg-blue-500" />
	`

	const result = babel.transform(code, {
		plugins: ["@babel/syntax-jsx", "macros"],
		filename: join(__dirname, "testfile.js"),
		ast: true,
		configFile: false,
	})

	let foundImport = false

	babel.traverse(result.ast, {
		ImportDeclaration(path) {
			const sourceName = path.get("source").node.value

			const specifierNames = path
				.get("specifiers")
				.map((s) => s.node)
				.filter(babel.types.isImportSpecifier)
				.map((s) => s.local.name)

			if (sourceName === "twind" && specifierNames.includes("tw")) {
				foundImport = true
			}
		},
	})

	expect(foundImport).toBe(true)
})
