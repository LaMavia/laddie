import { PipeArgs } from './types/helpers/PipeArgs'
import { AnyFn, AnyPromise, FirstArg, LastReturnType } from './types/helpers/func'

export const compose: <Fs extends AnyFn[]>(
  ...fs: PipeArgs<Fs>
) => (a: FirstArg<Fs>) => AnyPromise<Fs> extends true ? Promise<LastReturnType<Fs>> : LastReturnType<Fs> =
  (...fs) =>
  a0 =>
    fs.reduce((a, f) => (a instanceof Promise ? a.then(f) : f(a)), a0 as any)

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
  })
}
