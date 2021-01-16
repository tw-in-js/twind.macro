import { tw } from '../../macro'
const buttonStyle = tw('px-3 py-2', isRounded && 'rounded')
const blueBg = tw`bg-blue-500`
export default <button tw={[buttonStyle, blueBg, 'text-red-500']} />
