import WaveSurfer from "wavesurfer.js";
import Region from "wavesurfer.js/dist/plugins/regions.js";
import { guess } from "web-audio-beat-detector";

const options = {
  waveColor: "lightblue",
  progressColor: "darkblue",
  cursorColor: "navy",
  hideScrollbar: true,
  minPxPerSec: 50,
  fillParent: false,
};

export function useWavesurfer(
  deck: DeckValues,
  track: Track,
  media: HTMLAudioElement,
  container: HTMLDivElement,
): WaveSurfer {
  const wavesurfer = WaveSurfer.create({
    ...options,
    container,
    media,
  });
  deck.trackId = track.id;
  deck.title = track.title;
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
  return wavesurfer;
}
