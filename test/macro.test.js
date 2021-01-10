import macros from "babel-plugin-macros"
import pluginTester from "babel-plugin-tester"
import { join } from "path"

pluginTester({
	pluginName: "twind macro",
	plugin: macros,
	snapshot: true,
	babelOptions: {
		plugins: ["@babel/syntax-jsx"],
	},
	fixtures: join(__dirname, "fixtures"),
})
