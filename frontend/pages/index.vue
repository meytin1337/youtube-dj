<script lang="ts" setup>
import { NuxtError } from "#app";

const youtubeLink = useState("youtubeLink", () => "");

const tracks = useTracks();
const waveFormContainerDeckOne = ref<HTMLDivElement | null>(null);
const waveFormContainerDeckTwo = ref<HTMLDivElement | null>(null);
const loadTrack = (
  deck: number,
  file: Blob,
  trackId: string,
  title: string
) => {
  const activeDeck = deck === 1 ? useDeckOne() : useDeckTwo();
  const activeWaveFormContainer =
    deck === 1
      ? waveFormContainerDeckOne.value
      : waveFormContainerDeckTwo.value;
  if (!activeWaveFormContainer) throw createError("No Waveform Container");
  useLoadTrackOnDeck(activeDeck, file, trackId, activeWaveFormContainer, title);
};
const resetError = (error: NuxtError) => {
  youtubeLink.value = "";
  error.value = null;
};
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
    >
      Welcome to the future of DJing
    </h1>
    <p
      class="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
    >
      To get started, paste a youtube link into the input below and click the
      Download button.
    </p>
    <NuxtErrorBoundary>
      <TrackLoader />
      <template #error="{ error }">
        <p class="text-red-500">{{ error }}</p>
        <button @click="resetError(error)">Try Again</button>
      </template>
    </NuxtErrorBoundary>
    <div class="flex flex-col w-full">
      <div class="flex justify-center">
        <DeckComponent :deck="1">
          <div ref="waveFormContainerDeckOne" class="h-28 shadow w-full"></div>
        </DeckComponent>
        <DeckComponent :deck="2">
          <div ref="waveFormContainerDeckTwo" class="h-28 shadow w-full"></div>
        </DeckComponent>
      </div>
      <TrackList :tracks="tracks" @load-track="loadTrack" />
    </div>
  </div>
</template>
