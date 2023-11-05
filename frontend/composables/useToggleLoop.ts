import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";

export const useToggleLoop = (
  deckValues: DeckValues,
  beats: number,
  wavesurfer: WaveSurfer,
  lowFilter: BiquadFilterNode,
  midFilter: BiquadFilterNode,
  highFilter: BiquadFilterNode,
) => {
  if (!wavesurfer) return;
  const regions = wavesurfer.getActivePlugins().find((plugin) => {
    return plugin.regions;
  }) as RegionsPlugin;
  if (!regions) return;
  if (regions.getRegions().length > 0) {
    regions.clearRegions();
    regions.unAll();
    return;
  }
  const nextBeat = useCalculateNextBeat(deckValues, wavesurfer);
  // we add a 30ms offset here
  // because we want to loop before the kick
  const start = wavesurfer?.getCurrentTime() + nextBeat - 0.03;
  // the offset here is 45ms because we need a 15ms timeout
  // before jumping to the beginning of the loop to decrease distortion
  const end = start + (beats * 60) / deckValues.bpm - 0.045;
  regions.addRegion({
    start,
    end,
    drag: false,
    resize: false,
  });
  regions.on("region-out", (region) => {
    if (!highFilter || !midFilter || !lowFilter) return;
    // this lowers distortion
    highFilter.gain.value = -100;
    midFilter.gain.value = -100;
    lowFilter.gain.value = -100;
    // we use a 1ms smaller timeout then expected to offset
    // the slight delay cause by lag
    setTimeout(() => region.play(), 15);
  });
  regions.on("region-in", () => {
    setTimeout(() => {
      if (!highFilter) return;
      highFilter.gain.value = deckValues.highFilterGain;
    }, 10);
    setTimeout(() => {
      if (!midFilter) return;
      midFilter.gain.value = deckValues.midFilterGain;
    }, 10);
    setTimeout(() => {
      if (!lowFilter) return;
      lowFilter.gain.value = deckValues.lowFilterGain;
    }, 10);
  });
};
