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
  firstBeatOffset: number;
  ctx: AudioContext | undefined;
  highFilter: BiquadFilterNode | undefined;
  lowFilter: BiquadFilterNode | undefined;
  midFilter: BiquadFilterNode | undefined;
  zoom: number;
}

export const useTracks = () => {
  return useState<Track[]>("tracks", () => []);
};

export const useDeckOne = () => {
  return useState<Deck>("deckOne", () => {
    return {
      firstBeatOffset: 0,
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
      highFilter: undefined,
      lowFilter: undefined,
      midFilter: undefined,
      zoom: 100,
    };
  });
};

export const useDeckTwo = () => {
  return useState<Deck>("deckTwo", () => {
    return {
      firstBeatOffset: 0,
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
      highFilter: undefined,
      lowFilter: undefined,
      midFilter: undefined,
      zoom: 100,
    };
  });
};
