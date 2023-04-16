import { Howl } from "howler";

interface Track {
  id: string;
  title: string;
  file: Blob;
}

export interface Deck {
  sound: Ref<Howl | undefined>;
  title: Ref<string | undefined>;
  id: Ref<string | undefined>;
  isPlaying: Ref<boolean>;
  rate: Ref<number>;
  volume: Ref<number>;
}

export const useTracks = () => {
  return useState<Track[]>("tracks", () => []);
};

export const useDeckOne = (): Deck => {
  return {
    sound: useState<Howl | undefined>("deckOneSound", () => undefined),
    title: useState<string | undefined>("deckOneTitle", () => undefined),
    id: useState<string | undefined>("deckOneId", () => undefined),
    isPlaying: useState<boolean>("deckOneIsPlaying", () => false),
    rate: useState<number>("deckOneRate", () => 1),
    volume: useState<number>("deckOneVolume", () => 1),
  };
};

export const useDeckTwo = (): Deck => {
  return {
    sound: useState<Howl | undefined>("deckTwoSound", () => undefined),
    title: useState<string | undefined>("deckTwoTitle", () => undefined),
    id: useState<string | undefined>("deckTwoId", () => undefined),
    isPlaying: useState<boolean>("deckTwoIsPlaying", () => false),
    rate: useState<number>("deckTwoRate", () => 1),
    volume: useState<number>("deckTwoVolume", () => 1),
  };
};
