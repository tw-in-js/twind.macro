import { tw as _tw } from 'twind'

const buttonStyle = /*#__PURE__*/ _tw('px-3 py-2', isRounded && 'rounded')

const blueBg = /*#__PURE__*/ _tw`bg-blue-500`
export default <button className={/*#__PURE__*/ _tw([buttonStyle, blueBg, 'text-red-500'])} />
