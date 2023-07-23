export type ApplicatorFunc<A> = A extends Applicator<infer F, infer _>
  ? F
  : never
export type ApplicatorArg<A> = A extends Applicator<infer _, infer A>
  ? A
  : never

export interface Applicator<Func, Arg> {
  isMatching(func: unknown, arg: unknown): boolean
  apply(func: Func, arg: Arg): unknown
}
