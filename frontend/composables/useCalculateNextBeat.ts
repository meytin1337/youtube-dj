import WaveSurfer from "wavesurfer.js";
import { DeckValues } from "./states";

export function useCalculateNextBeat(
  deckValues: DeckValues,
  wavesurfer: WaveSurfer,
) {
  const currentTime = wavesurfer.getCurrentTime();
  const { bpm, firstBeatOffset } = deckValues;
  const beatLength = 60 / bpm;
  return beatLength - ((currentTime - firstBeatOffset) % beatLength);
}
