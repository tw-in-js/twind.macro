# @twind/macro

Enables the use of the `tw` prop, for use with [`twind`](https://github.com/tw-in-js/twind)

```js
import "@twind/macro"
const Button = () => <button tw="bg-blue-500" />

// ⬇⬇⬇⬇⬇⬇

import { tw } from "twind"
const Button = () => <button className={tw`bg-blue-500`} />
```

More complex usage is supported:

```js
import "@twind/macro"

const Button = () => (
	<button
		tw={[
			"bg-blue-500",
			condition && "text-red-500",
			{ "border-green-500": true },
		]}
	/>
)

// ⬇⬇⬇⬇⬇⬇

import { tw } from "twind"

const Button = () => (
	<button
		className={tw([
			"bg-blue-500",
			condition && "text-red-500",
			{ "border-green-500": true },
		])}
	/>
)
```

## Installation

1. Add [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) to your babel config (if you use Create React App, it's already installed!)
1. Run `npm install @twind/macro`
1. Enjoy ☺
