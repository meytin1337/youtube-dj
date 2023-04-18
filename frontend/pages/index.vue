<script lang="ts" setup>
import { NuxtError } from "#app";
const youtubeLink = useState("youtubeLink", () => "");

const tracks = useTracks();
const waveFormContainerDeckOne = ref<HTMLDivElement | null>(null);
const waveFormContainerDeckTwo = ref<HTMLDivElement | null>(null);
const loadTrack = (deck: number, file: Blob, trackId: string) => {
  const activeDeck = deck === 1 ? useDeckOne() : useDeckTwo();
  const activeWaveFormContainer =
    deck === 1
      ? waveFormContainerDeckOne.value
      : waveFormContainerDeckTwo.value;
  useLoadTrackOnDeck(activeDeck, file, trackId, activeWaveFormContainer);
};
const resetError = (error: NuxtError) => {
  youtubeLink.value = "";
  error.value = null;
};
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-2xl m-10">Welcome to youtube-dj</h1>
    <NuxtErrorBoundary>
      <TrackLoader />
      <template #error="{ error }">
        <p class="text-red-500">{{ error }}</p>
        <button @click="resetError(error)">Try Again</button>
      </template>
    </NuxtErrorBoundary>
    <div class="flex flex-col w-full m-10">
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
