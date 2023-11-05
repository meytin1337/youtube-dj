export interface Track {
  id: string;
  title: string;
  url: string;
}

export interface DeckValues {
  id: number;
  trackId: string;
  rate: number;
  activeLoop: number | null;
  volume: number;
  isWaveformReady: Boolean;
  isPlaying: Boolean;
  title: string;
  bpm: number;
  firstBeatOffset: number;
  highFilterGain: number;
  lowFilterGain: number;
  midFilterGain: number;
  zoom: number;
}

export const useTracks = () => {
  return useState<Track[]>("tracks", () => []);
};

export const useDeckValues = (id: number) => {
  const deckName = id === 0 ? "leftDeck" : "rightDeck";
  return useState<DeckValues>(deckName, () => {
    return {
      firstBeatOffset: 0,
      id: 0,
      trackId: "",
      rate: 1,
      activeLoop: null,
      volume: 1,
      isWaveformReady: false,
      isPlaying: false,
      bpm: 0,
      title: "",
      highFilterGain: 0,
      lowFilterGain: 0,
      midFilterGain: 0,
      zoom: 100,
    };
  });
};
