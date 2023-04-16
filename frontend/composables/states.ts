import { Howl } from "howler";

interface Track {
  id: string;
  title: string;
  file: Blob;
}
export const useTracks = () => {
  return useState<Track[]>("tracks", () => []);
};

export const useActiveTracks = () => {
  return [
    {
      sound: useState<Howl | undefined>("deckOneSound", () => undefined),
      title: useState<string | undefined>("deckOneTitle", () => undefined),
    },
    {
      sound: useState<Howl | undefined>("deckTwoSound", () => undefined),
      title: useState<string | undefined>("deckTwoTitle", () => undefined),
    },
  ];
};
