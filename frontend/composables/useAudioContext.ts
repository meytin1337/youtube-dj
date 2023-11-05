export const useLowFilter = (ctx: AudioContext, value: number) => {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowshelf";
  filter.frequency.value = 500;
  filter.gain.value = value;
  return filter;
};

export const useHighFilter = (ctx: AudioContext, value: number) => {
  const filter = ctx.createBiquadFilter();
  filter.type = "highshelf";
  filter.frequency.value = 1500;
  filter.gain.value = value;
  return filter;
};

export const useMidFilter = (ctx: AudioContext, value: number) => {
  const filter = ctx.createBiquadFilter();
  filter.type = "peaking";
  filter.frequency.value = 1000;
  filter.gain.value = value;
  return filter;
};
