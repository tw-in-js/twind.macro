import { tw } from "../../macro"
const buttonClass = tw`bg-blue-500`
export default <button tw={[buttonClass, "text-red-500"]} />
