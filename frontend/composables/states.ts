import WaveSurfer from "wavesurfer.js";

export interface Track {
  id: string;
  title: string;
  file: Blob;
}

export interface Deck {
  id: Ref<Number>;
  wavesurfer: Ref<WaveSurfer | undefined>;
  trackId: Ref<string | undefined>;
  rate: Ref<number>;
  volume: Ref<number>;
  isWaveformReady: Ref<boolean>;
  isPlaying: Ref<boolean>;
  title: Ref<string | undefined>;
  bpm: Ref<number>;
  lowFilter: Ref<number>;
  highFilter: Ref<number>;
  midFilter: Ref<number>;
}

export const useTracks = () => {
  return useState<Track[]>("tracks", () => []);
};

export const useDeckOne = (): Deck => {
  return {
    id: useState<number>("deckOneId", () => 1),
    wavesurfer: useState<undefined>("deckOneSound", () => undefined),
    trackId: useState<string | undefined>("deckOneTrackId", () => undefined),
    rate: useState<number>("deckOneRate", () => 1),
    volume: useState<number>("deckOneVolume", () => 1),
    isWaveformReady: useState<boolean>("deckOneWaveformReady", () => false),
    isPlaying: useState<boolean>("deckOneIsPlaying", () => false),
    bpm: useState<number>("deckOneBpm", () => 0),
    title: useState<string | undefined>("deckOneTrackTitle", () => undefined),
    lowFilter: useState<number>("deckOneLowFilter", () => 0),
    highFilter: useState<number>("deckOneHighFilter", () => 0),
    midFilter: useState<number>("deckOneMidFilter", () => 0),
  };
};

export const useDeckTwo = (): Deck => {
  return {
    id: useState<number>("deckTwoId", () => 2),
    wavesurfer: useState<any>("deckTwoSound", () => undefined),
    trackId: useState<string | undefined>("deckTwoTrackId", () => undefined),
    rate: useState<number>("deckTwoRate", () => 1),
    volume: useState<number>("deckTwoVolume", () => 1),
    isWaveformReady: useState<boolean>("deckTwoWaveformReady", () => false),
    isPlaying: useState<boolean>("deckTwoIsPlaying", () => false),
    bpm: useState<number>("deckTwoBpm", () => 0),
    title: useState<string | undefined>("deckTwoTrackTitle", () => undefined),
    lowFilter: useState<number>("deckTwoLowFilter", () => 0),
    highFilter: useState<number>("deckTwoHighFilter", () => 0),
    midFilter: useState<number>("deckTwoMidFilter", () => 0),
  };
};
