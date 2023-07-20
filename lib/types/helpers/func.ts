export type AnyFn = (...args: any[]) => any

export type LastReturnType<Fs extends AnyFn[]> = Fs extends []
  ? void
  : Fs extends [...infer _, (...args: any[]) => infer R]
  ? R
  : never

// Fs extends [(...args: any[]) => infer R]
// ? R
// : Fs extends [infer _, ...infer Tail extends AnyFn[]]
// ? LastReturnType<Tail>
// : never

export type AnyPromise<Fs extends AnyFn[]> = Fs extends []
  ? false
  : Fs extends [infer F, ...infer Tail extends AnyFn[]]
  ? F extends (...args: any[]) => Promise<any>
    ? true
    : AnyPromise<Tail>
  : never

export type FirstArg<Fs extends AnyFn[]> = Fs extends [
  infer F extends AnyFn,
  ...infer _
]
  ? Parameters<F> extends []
    ? void
    : Parameters<F>[0]
  : void
