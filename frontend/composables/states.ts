export interface Track {
  id: string;
  title: string;
  file: Blob;
}

export interface Deck {
  id: Ref<Number>;
  wavesurfer: Ref<any>;
  trackId: Ref<string | undefined>;
  rate: Ref<number>;
  volume: Ref<number>;
  isWaveformReady: Ref<boolean>;
  isPlaying: Ref<boolean>;
}

export const useTracks = () => {
  return useState<Track[]>("tracks", () => []);
};

export const useDeckOne = (): Deck => {
  return {
    id: useState<number>("deckOneId", () => 1),
    wavesurfer: useState<any>("deckOneSound", () => undefined),
    trackId: useState<string | undefined>("deckOneTrackId", () => undefined),
    rate: useState<number>("deckOneRate", () => 1),
    volume: useState<number>("deckOneVolume", () => 1),
    isWaveformReady: useState<boolean>("deckOneWaveformReady", () => false),
    isPlaying: useState<boolean>("deckOneIsPlaying", () => false),
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
  };
};
