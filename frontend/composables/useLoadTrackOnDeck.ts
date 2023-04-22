import { analyze } from "web-audio-beat-detector";
import { Deck } from "./states";

const options = {
  waveColor: "lightblue",
  progressColor: "darkblue",
  cursorColor: "navy",
  hideScrollbar: true,
};
export async function useLoadTrackOnDeck(
  deck: Deck,
  file: Blob,
  trackId: string,
  container: HTMLDivElement,
  title: string
): Promise<void> {
  const WaveSurfer = (await import("wavesurfer.js")).default;
  const fileUrl = URL.createObjectURL(file);
  const wavesurfer = WaveSurfer.create({
    ...options,
    container,
  });
  deck.wavesurfer.value?.destroy();
  deck.trackId.value = trackId;
  deck.title.value = title;
  wavesurfer.load(fileUrl);
  wavesurfer.setVolume(deck.volume.value);
  wavesurfer.setPlaybackRate(deck.rate.value);
  wavesurfer.on("ready", async () => {
    deck.isWaveformReady.value = true;
    deck.bpm.value = await analyze(wavesurfer.backend?.buffer);
  });
  wavesurfer.on("play", () => {
    deck.isPlaying.value = true;
  });
  wavesurfer.on("pause", () => {
    deck.isPlaying.value = false;
  });
  wavesurfer.on("finish", () => {
    deck.isPlaying.value = false;
  });
  wavesurfer.on("destroy", () => {
    deck.isPlaying.value = false;
    deck.isWaveformReady.value = false;
  });
  const ctx = wavesurfer.backend.ac;
  const lowFilter = ctx.createBiquadFilter();
  const highFilter = ctx.createBiquadFilter();
  const midFilter = ctx.createBiquadFilter();
  wavesurfer.backend.setFilter(
    applyLowFilter(lowFilter, deck.lowFilter.value),
    applyHighFilter(highFilter, deck.highFilter.value),
    applyMidFilter(midFilter, deck.midFilter.value)
  );
  deck.wavesurfer.value = wavesurfer;
}

const applyLowFilter = (filter: BiquadFilterNode, value: number) => {
  filter.type = "lowshelf";
  filter.frequency.value = 500;
  filter.gain.value = value;
  return filter;
};

const applyHighFilter = (filter: BiquadFilterNode, value: number) => {
  filter.type = "highshelf";
  filter.frequency.value = 1500;
  filter.gain.value = value;
  return filter;
};

const applyMidFilter = (filter: BiquadFilterNode, value: number) => {
  filter.type = "peaking";
  filter.frequency.value = 1000;
  filter.gain.value = value;
  return filter;
};
