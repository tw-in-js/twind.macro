export function raise(msg: string): never {
  throw new Error(msg)
}

export function isTruthy<T>(value: T): value is Exclude<T, undefined | null | false | 0 | ''> {
  return Boolean(value)
}
