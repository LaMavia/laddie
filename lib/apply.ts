import { ReturnTypeOfMaybePromise } from './types/helpers/func'
import {
  Applicator,
  ApplicatorArg,
  ApplicatorFunc
} from './types/interfaces/Applicator'

class Applicators {
  private static arrayApplicator: Applicator<(...args: any[]) => any, any[]> = {
    isMatching: (func, args) =>
      Array.isArray(args) &&
      typeof func === 'function' &&
      args.length === func.length,
    apply: (func, arg) => func(...arg)
  }

  private static promiseApplicator: Applicator<
    (...args: any[]) => any,
    Promise<any>
  > = {
    isMatching: (func, arg) =>
      typeof func === 'function' && arg instanceof Promise,
    apply: (func, arg) => arg.then((...args) => this.apply(func, args))
  }

  private static singularApplicator: Applicator<(arg: any) => any, any> = {
    isMatching: (func, _) => typeof func === 'function' && func.length === 1,
    apply: (func, arg) => func(arg)
  }

  public static apply(func: unknown, arg: unknown) {
    const applicators = [
      this.arrayApplicator,
      this.promiseApplicator,
      this.singularApplicator
    ] as const

    for (const applicator of applicators) {
      if (applicator.isMatching(func, arg)) {
        return applicator.apply(
          <ApplicatorFunc<typeof applicator>>func,
          <ApplicatorArg<typeof applicator>>arg
        )
      }
    } /* c8 ignore start */
    console.error({
      func,
      arg
    })
    throw new Error('No matching applicators found')
    /* c8 ignore stop */
  }
}

export function apply<A, B>(
  f: (arg: A) => B,
  a: A
): ReturnTypeOfMaybePromise<A, B> {
  return Applicators.apply(f, a) as ReturnTypeOfMaybePromise<A, B>
}
