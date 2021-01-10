// babel macros can't import TS files,
// so we use this JS file as a middle-man in fixtures
import "ts-node/register"
export { default } from "../src/macro"
