import WaveSurfer from "wavesurfer.js";
import { Deck } from "./states";

export function useLoadTrackOnDeck(
  deck: Deck,
  file: Blob,
  trackId: string,
  container: HTMLDivElement | null
): void {
  const fileUrl = URL.createObjectURL(file);
  const wavesurfer = WaveSurfer.create({
    container,
    waveColor: "violet",
    progressColor: "purple",
    cursorColor: "navy",
  });
  deck.wavesurfer.value?.destroy();
  wavesurfer.load(fileUrl);
  wavesurfer.setVolume(deck.volume.value);
  wavesurfer.setPlaybackRate(deck.rate.value);
  wavesurfer.on("ready", () => {
    deck.isWaveformReady.value = true;
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
  deck.wavesurfer.value = wavesurfer;
  deck.trackId.value = trackId;
}
