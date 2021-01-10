import 'react'
import { Token, tw } from 'twind'

declare module 'react' {
  interface DOMAttributes<T> {
    tw?: Token
  }
}

export { tw }
