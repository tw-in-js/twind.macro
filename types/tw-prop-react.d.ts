import "react"
import { Token } from "twind"

declare module "react" {
	interface DOMAttributes {
		tw?: Token
	}
}
