import { tw as actualTw } from 'twind'
import { tw as macroTw } from '../../macro'
const blueBg = macroTw`bg-blue-500`
const redText = actualTw`text-red-500`
export default <button tw={[blueBg, redText]} />
