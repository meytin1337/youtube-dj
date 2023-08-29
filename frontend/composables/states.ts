import WaveSurfer from "wavesurfer.js";

export interface Track {
  id: string;
  title: string;
  file: Blob;
}

export interface Deck {
  id: number;
  wavesurfer: WaveSurfer | undefined;
  trackId: string;
  rate: number;
  volume: number;
  isWaveformReady: Boolean;
  isPlaying: Boolean;
  title: string;
  bpm: number;
  ctx: AudioContext | undefined;
  filters: Array<BiquadFilterNode>;
  zoom: number;
}

export const useTracks = () => {
  return useState<Track[]>("tracks", () => []);
};

export const useDeckOne = (): Ref<Deck> => {
  return useState<Deck>("deckOne", (): Deck => {
    return {
      id: 0,
      wavesurfer: undefined,
      trackId: "",
      rate: 1,
      volume: 1,
      isWaveformReady: false,
      isPlaying: false,
      bpm: 0,
      title: "",
      ctx: undefined,
      filters: [],
      zoom: 100,
    };
  });
};

export const useDeckTwo = (): Ref<Deck> => {
  return useState<Deck>("deckTwo", (): Deck => {
    return {
      id: 0,
      wavesurfer: undefined,
      trackId: "",
      rate: 1,
      volume: 1,
      isWaveformReady: false,
      isPlaying: false,
      bpm: 0,
      title: "",
      ctx: undefined,
      filters: [],
      zoom: 100,
    };
  });
};
