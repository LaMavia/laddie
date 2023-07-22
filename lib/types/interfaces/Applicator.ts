export interface Applicator<Func, Arg> {
  isMatching(funcArg: [unknown, unknown]): funcArg is [Func, Arg]
  apply(func: Func, arg: Arg): unknown
}
