import { analyze } from "web-audio-beat-detector";
import { WaveSurferOptions } from "wavesurfer.js";
import { Deck } from "./states";

const options = <WaveSurferOptions>{
  waveColor: "lightblue",
  progressColor: "darkblue",
  cursorColor: "navy",
  hideScrollbar: true,
  minPxPerSec: 50,
  fillParent: false,
};
export async function useLoadTrackOnDeck(
  deck: Deck,
  file: Blob,
  trackId: string,
  container: HTMLDivElement,
  audio: HTMLAudioElement,
  title: string,
): Promise<void> {
  const WaveSurfer = (await import("wavesurfer.js")).default;
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
  wavesurfer.on("ready", async () => {
    wavesurfer.setVolume(deck.volume);
    wavesurfer.zoom(deck.zoom);
    deck.isWaveformReady = true;
    // deck.bpm = await analyze(wavesurfer.getDecodedData());
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
  if (deck.filters.length === 0) {
    deck.filters = [
      createLowFilter(ctx, 0),
      createMidFilter(ctx, 0),
      createHighFilter(ctx, 0),
    ];
  }

  const mediaNode = ctx.createMediaElementSource(audio);
  const equalizer = deck.filters.reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  }, mediaNode);
  equalizer.connect(ctx.destination);
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
