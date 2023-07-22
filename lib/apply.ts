import { ReturnTypeOfMaybePromise } from './types/helpers/func'
import { Applicator } from './types/interfaces/Applicator'

class Applicators {
  private static arrayApplicator: Applicator<(...args: any[]) => any, any[]> = {
    isMatching: (funcArg): funcArg is [(...args: any[]) => any, any[]] => {
      const [func, args] = funcArg
      return (
        Array.isArray(args) &&
        typeof func === 'function' &&
        args.length === func.length
      )
    },
    apply: (func, arg) => func(...arg)
  }

  private static promiseApplicator: Applicator<
    (...args: any[]) => any,
    Promise<any>
  > = {
    isMatching: (
      funcArg
    ): funcArg is [(...args: any[]) => any, Promise<any>] => {
      const [func, arg] = funcArg
      return typeof func === 'function' && arg instanceof Promise
    },
    apply: (func, arg) => arg.then((...args) => this.apply(func, args))
  }

  private static singularApplicator: Applicator<(arg: any) => any, any> = {
    isMatching: (funcArg): funcArg is [(arg: any) => any, any] => {
      const [func, _] = funcArg
      return typeof func === 'function' && func.length === 1
    },
    apply: (func, arg) => func(arg)
  }

  public static apply(func: unknown, arg: unknown) {
    if (this.arrayApplicator.isMatching([func, arg])) {
      return this.arrayApplicator.apply(func as any, arg as any)
    }
    if (this.promiseApplicator.isMatching([func, arg])) {
      return this.promiseApplicator.apply(func as any, arg as any)
    }
    if (this.singularApplicator.isMatching([func, arg])) {
      return this.singularApplicator.apply(func as any, arg as any)
    } /* c8 ignore start */ else {
      console.error({
        func,
        arg
      })
      throw new Error('No matching applicators found')
    }
    /* c8 ignore stop */
  }
}

export function apply<A, B>(
  f: (arg: A) => B,
  a: A
): ReturnTypeOfMaybePromise<A, B> {
  return Applicators.apply(f, a) as ReturnTypeOfMaybePromise<A, B>
}
