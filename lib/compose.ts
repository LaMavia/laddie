import { apply } from './apply'
import { PipeArgs } from './types/helpers/PipeArgs'
import {
  AnyFn,
  AnyPromise,
  FirstArg,
  LastReturnType
} from './types/helpers/func'

export const compose: <Fs extends AnyFn[]>(
  ...fs: PipeArgs<Fs>
) => (
  ...a: FirstArg<Fs>
) => AnyPromise<Fs> extends true
  ? LastReturnType<Fs> extends Promise<infer _>
    ? LastReturnType<Fs>
    : Promise<LastReturnType<Fs>>
  : LastReturnType<Fs> =
  (...fs) =>
  (...a0s) =>
    fs.length === 0 && a0s.length === 0
      ? void 0
      : fs.reduce((a, f) => apply(f, a), a0s as any)

if (import.meta.vitest) {
  const { describe, it, expect, expectTypeOf } = import.meta.vitest

  describe('compose', () => {
    it('handles no fs', () => {
      expect(compose()()).toEqual(undefined)
      expectTypeOf(compose()).toMatchTypeOf<(a0: void) => void>()
    })

    it('pipes non-promises', () => {
      expect(
        compose(
          (a: number) => a + 1,
          (a: number) => a * 2,
          (a: number) => String(a)
        )(5)
      ).toEqual('12')
    })

    it('pipes promises', async () => {
      await expect(
        compose(
          async () => 1,
          (a: number) => a + 1,
          (a: number) => a * 2
        )()
      ).resolves.toEqual(4)
    })

    it('multiple arguments', () => {
      const f = (a: number, b: number, c: number) => a + b + c
      const args = [1, 2, 3] as const
      expect(compose(f)(...args)).toEqual(f(...args))
    })

    it('array arguments', () => {
      const f = (x: any[]) => x.length
      const arg = [1, 2, 3]

      expect(compose(f)(arg)).toEqual(f(arg))
      expectTypeOf(compose(f)).toMatchTypeOf<(x: any[]) => number>()
    })

    it('tuple arguments', () => {
      const f = ([a, b]: [number, number]) => a + b
      const arg: [number, number] = [1, 2]

      expect(compose(f)([1, 2])).toEqual(f(arg))
      expectTypeOf(compose(f)).toMatchTypeOf<typeof f>()
    })

    it('promise tuple', () => {
      const f = async ([a, b]: [number, number]) => a + b
      const arg: Promise<[number, number]> = new Promise(res => res([1, 2]))

      expect(
        compose(
          () => arg,
          f,
          (l: number) => l + 1
        )()
      ).resolves.toEqual(4)
      expectTypeOf(compose(f)).toMatchTypeOf<typeof f>()
    })
  })
}
