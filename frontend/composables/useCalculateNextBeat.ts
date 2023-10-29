import { Deck } from "./states";

export function useCalculateNextBeat(deck: Deck) {
  const currentTime = deck.wavesurfer.getCurrentTime();
  const { bpm, firstBeatOffset } = deck;
  const beatLength = 60 / bpm;
  return beatLength - ((currentTime - firstBeatOffset) % beatLength);
}
