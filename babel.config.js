module.exports = {
	presets: [
		"@babel/typescript",
		["@babel/env", { targets: { node: "current" } }],
		["@babel/react", { runtime: "automatic" }],
	],
	plugins: ["macros"],
}
