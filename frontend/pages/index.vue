<script lang="ts" setup>
const youtubeLink = useState(
  "youtubeLink",
  () => "https://www.youtube.com/watch?v=5IrHzrg4qdQ",
);

const tracks = useTracks();
const waveFormContainerDeckOne = ref<HTMLDivElement | null>(null);
const waveFormAudioDeckOne = ref<HTMLAudioElement | null>(null);
const waveFormContainerDeckTwo = ref<HTMLDivElement | null>(null);
const waveFormAudioDeckTwo = ref<HTMLAudioElement | null>(null);
const loadTrack = (
  deck: number,
  file: Blob,
  trackId: string,
  title: string,
) => {
  const deckOne = useDeckOne();
  const deckTwo = useDeckTwo();
  const activeDeck = deck === 1 ? deckOne : deckTwo;
  const activeWaveFormContainer =
    deck === 1
      ? waveFormContainerDeckOne.value
      : waveFormContainerDeckTwo.value;
  const activeAudioElement =
    deck === 1 ? waveFormAudioDeckOne.value : waveFormAudioDeckTwo.value;
  if (!activeWaveFormContainer || !activeAudioElement) return;
  useLoadTrackOnDeck(
    activeDeck.value,
    file,
    trackId,
    activeWaveFormContainer,
    activeAudioElement,
    title,
  );
};
</script>

<template>
  <div class="select-none flex flex-col items-center justify-center space-y-4">
    <div class="flex flex-col w-full">
      <div class="flex justify-center">
        <DeckComponent :deck="1">
          <div
            ref="waveFormContainerDeckOne"
            class="h-28 border border-gray-500 w-full"
          >
            <audio ref="waveFormAudioDeckOne"></audio>
          </div>
        </DeckComponent>
        <DeckComponent :deck="2">
          <div
            ref="waveFormContainerDeckTwo"
            class="h-28 border border-gray-500 w-full"
          >
            <audio ref="waveFormAudioDeckTwo"></audio>
          </div>
        </DeckComponent>
      </div>
      <div class="w-5/6 mr-auto ml-auto">
        <TrackLoader />
        <TrackList :tracks="tracks" @load-track="loadTrack" />
      </div>
    </div>
  </div>
</template>
