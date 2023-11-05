<script lang="ts" setup>
import WaveSurfer from "wavesurfer.js";
interface Deck {
  wavesurfer: WaveSurfer | undefined;
  ctx: AudioContext;
  lowFilter: BiquadFilterNode;
  midFilter: BiquadFilterNode;
  highFilter: BiquadFilterNode;
}
interface MediaElement {
  trackId: string;
  element: HTMLAudioElement;
  deckId: number;
}
const tracks = useTracks();
const waveFormContainer = ref([]);
const mediaElement = ref<Array<MediaElement>>([]);
const decks: Deck[] = [{} as Deck, {} as Deck];
const loadTrack = (deckId: number, trackId: string) => {
  const track = tracks.value.find((item) => item.id === trackId);
  if (track === undefined) return;
  const deckValues = useDeckValues(deckId).value;
  const media = mediaElement.value?.find(
    (item) => item.trackId === trackId && item.deckId === deckId,
  )?.element;
  if (media === undefined || waveFormContainer.value.length === 0) return;
  let wavesurfer = decks[deckId].wavesurfer;
  if (wavesurfer) {
    wavesurfer?.destroy();
    wavesurfer?.seekTo(0);
    deckValues.activeLoop = null;
  }
  wavesurfer = useWavesurfer(
    deckValues,
    track,
    media,
    waveFormContainer.value[deckId],
  );
  decks[deckId].wavesurfer = wavesurfer;
  if (!decks[deckId].ctx) {
    const ctx = new AudioContext();
    const lowFilter = useLowFilter(ctx, 0);
    const midFilter = useMidFilter(ctx, 0);
    const highFilter = useHighFilter(ctx, 0);
    const source = ctx.createMediaElementSource(media);
    const equalizer = [lowFilter, midFilter, highFilter].reduce(
      (prev, curr) => {
        prev.connect(curr);
        return curr;
      },
      source,
    );
    equalizer?.connect(ctx.destination);
    decks[deckId] = { wavesurfer, ctx, lowFilter, midFilter, highFilter };
  }
};

const setVolume = (deckId: number) => {
  const deckValues = useDeckValues(deckId).value;
  const deck = decks[deckId];
  if (!deck.wavesurfer) return;
  deck.wavesurfer.setVolume(deckValues.volume);
};

const setRate = (deckId: number) => {
  const deckValues = useDeckValues(deckId).value;
  const deck = decks[deckId];
  if (!deck.wavesurfer) return;
  deck.wavesurfer.setPlaybackRate(deckValues.rate);
};

const setZoom = (deckId: number) => {
  const deckValues = useDeckValues(deckId).value;
  const deck = decks[deckId];
  if (!deck.wavesurfer) return;
  deck.wavesurfer.zoom(deckValues.zoom);
};

const togglePlay = (deckId: number) => {
  const deckValues = useDeckValues(deckId).value;
  const deck = decks[deckId];
  if (!deck.wavesurfer) return;
  if (deckValues.isPlaying) {
    deck.wavesurfer.pause();
    deckValues.isPlaying = false;
    return;
  }
  deck.wavesurfer.play();
  deckValues.isPlaying = true;
};

const applyLowFilter = (deckId: number) => {
  const deckValues = useDeckValues(deckId).value;
  const deck = decks[deckId];
  if (!deck.lowFilter) return;
  deck.lowFilter.gain.value = deckValues.lowFilterGain;
};

const applyMidFilter = (deckId: number) => {
  const deckValues = useDeckValues(deckId).value;
  const deck = decks[deckId];
  if (!deck.midFilter) return;
  deck.midFilter.gain.value = deckValues.midFilterGain;
};

const applyHighFilter = (deckId: number) => {
  const deckValues = useDeckValues(deckId).value;
  const deck = decks[deckId];
  if (!deck.highFilter) return;
  deck.highFilter.gain.value = deckValues.highFilterGain;
};
const toggleLoop = (deckId: number, beats: number) => {
  const deckValues = useDeckValues(deckId).value;
  const deck = decks[deckId];
  if (!deck.wavesurfer) return;
  useToggleLoop(
    deckValues,
    beats,
    deck.wavesurfer,
    deck.lowFilter,
    deck.midFilter,
    deck.highFilter,
  );
};

const skip = (deckId: number, seconds: number) => {
  const deck = decks[deckId];
  if (!deck.wavesurfer) return;
  deck.wavesurfer.skip(seconds);
};
</script>

<template>
  <div class="select-none flex flex-col items-center justify-center space-y-4">
    <div class="flex flex-col w-full">
      <div class="flex flex-row w-full">
        <div
          v-for="deckId in [0, 1]"
          :key="deckId"
          class="w-1/2 bg-gray-100 border flex justify-center flex-col"
        >
          <div ref="waveFormContainer" class="m-3 h-28 border border-gray-500">
            <audio
              v-for="(track, index) in tracks"
              :ref="
                (el) => {
                  mediaElement.push({
                    deckId: deckId,
                    trackId: track.id,
                    element: el,
                  });
                }
              "
              :key="track.id"
              :src="track.url"
            >
              {{ deckId + index }}
            </audio>
          </div>
          <DeckComponent
            :deck-id="deckId"
            @set-volume="setVolume"
            @set-rate="setRate"
            @toggle-play="togglePlay"
            @toggle-loop="toggleLoop"
            @set-zoom="setZoom"
            @skip="skip"
            @apply-low-filter="applyLowFilter"
            @apply-mid-filter="applyMidFilter"
            @apply-high-filter="applyHighFilter"
          />
        </div>
      </div>
      <div class="w-5/6 mr-auto ml-auto">
        <TrackLoader />
        <TrackList @load-track="loadTrack" />
      </div>
    </div>
  </div>
</template>
