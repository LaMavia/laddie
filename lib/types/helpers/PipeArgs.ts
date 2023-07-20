type _PipeArgs<A0, An, Fs extends any[], Bs> = Bs extends []
  ? Fs
  : Bs extends [(x: infer C0) => infer C1, ...infer NewBs]
  ? Awaited<An> extends C0
    ? Fs | _PipeArgs<A0, C1, [...Fs, (x: C0) => C1], NewBs>
    : void extends C0
    ? Fs | _PipeArgs<A0, C1, [...Fs, () => C1], NewBs>
    : Fs
  : Fs

export type PipeArgs<Fs> = Fs extends []
  ? [void]
  : Fs extends [(x: infer A0) => infer A1, ...infer NewAs]
  ? _PipeArgs<A0, A1, [(x: A0) => A1], NewAs>
  : Fs
