import { tw } from 'twind'
const buttonClass = tw`bg-blue-500`
export default <button className={tw([buttonClass, 'text-red-500'])} />
