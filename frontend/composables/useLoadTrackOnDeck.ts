import { guess } from "web-audio-beat-detector";
import WaveSurfer from "wavesurfer.js";
import Region from "wavesurfer.js/dist/plugins/regions.js";
import { Deck } from "./states";

const options = {
  waveColor: "lightblue",
  progressColor: "darkblue",
  cursorColor: "navy",
  hideScrollbar: true,
  minPxPerSec: 50,
  fillParent: false,
};
export function useLoadTrackOnDeck(
  deck: Deck,
  file: Blob,
  trackId: string,
  container: HTMLDivElement,
  audio: HTMLAudioElement,
  title: string,
): void {
  audio.src = URL.createObjectURL(file);
  const wavesurfer = WaveSurfer.create({
    ...options,
    container,
    media: audio,
  });
  if (deck.wavesurfer) {
    deck.wavesurfer.destroy();
  }
  deck.trackId = trackId;
  deck.title = title;
  wavesurfer.registerPlugin(Region.create());
  wavesurfer.on("ready", async () => {
    wavesurfer.setVolume(deck.volume);
    wavesurfer.zoom(deck.zoom);
    deck.isWaveformReady = true;
    const beatInfo = await guess(wavesurfer.getDecodedData());
    deck.bpm = beatInfo.bpm;
    deck.firstBeatOffset = beatInfo.offset;
  });
  wavesurfer.on("play", () => {
    deck.isPlaying = true;
  });
  wavesurfer.on("pause", () => {
    deck.isPlaying = false;
  });
  wavesurfer.on("finish", () => {
    deck.isPlaying = false;
  });
  wavesurfer.on("destroy", () => {
    deck.isPlaying = false;
    deck.isWaveformReady = false;
  });

  const ctx = new AudioContext();
  if (deck.lowFilter === undefined) {
    deck.lowFilter = createLowFilter(ctx, 0);
    deck.midFilter = createMidFilter(ctx, 0);
    deck.highFilter = createHighFilter(ctx, 0);
    deck.gainNode = ctx.createGain();
  }

  deck.source = ctx.createMediaElementSource(audio);
  const equalizer = [
    deck.lowFilter,
    deck.midFilter,
    deck.highFilter,
    deck.gainNode,
  ].reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  }, deck.source);
  equalizer?.connect(ctx.destination);
  deck.wavesurfer = wavesurfer;
}

const createLowFilter = (ctx: AudioContext, value: number) => {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowshelf";
  filter.frequency.value = 500;
  filter.gain.value = value;
  return filter;
};

const createHighFilter = (ctx: AudioContext, value: number) => {
  const filter = ctx.createBiquadFilter();
  filter.type = "highshelf";
  filter.frequency.value = 1500;
  filter.gain.value = value;
  return filter;
};

const createMidFilter = (ctx: AudioContext, value: number) => {
  const filter = ctx.createBiquadFilter();
  filter.type = "peaking";
  filter.frequency.value = 1000;
  filter.gain.value = value;
  return filter;
};
