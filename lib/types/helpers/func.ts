export type AnyFn = (...args: any[]) => any

export type LastReturnType<Fs extends AnyFn[]> = Fs extends []
  ? void
  : Fs extends [...infer _, (...args: any[]) => infer R]
  ? R
  : never

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
  ? Parameters<F>
  : []

export type ReturnTypeOfMaybePromise<A, B> = A extends Promise<infer _>
  ? B extends Promise<_>
    ? Promise<B>
    : B
  : B
