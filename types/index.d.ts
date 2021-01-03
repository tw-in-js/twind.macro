import "react"
import { Token } from "twind"

declare module "react" {
	interface DOMAttributes<T> {
		tw?: Token
	}
}
