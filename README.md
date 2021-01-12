# @twind/macro

Enables the use of the `tw` prop, for use with [`twind`](https://github.com/tw-in-js/twind)

```jsx
// before
import { tw } from 'twind'
const Button = () => <button className={tw`bg-blue-500`} />

// after ✨
import '@twind/macro'
const Button = () => <button tw="bg-blue-500" />
```

## Installation

1. Add [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) to your babel config (if you use Create React App, it's already installed!)
1. Run `npm install @twind/macro`
1. Enjoy ☺

## Todo

- [ ] Publish package
- [x] Convert to TypeScript
- [ ] Code audit/cleanup, handle more edge cases
