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
  <div class="flex flex-col items-center justify-center space-y-4">
    <div class="flex flex-col w-full">
      <div class="flex justify-center">
        <DeckComponent :deck="1">
          <div
            ref="waveFormContainerDeckOne"
            class="h-28 border border-gray-500 w-full"
          ></div>
        </DeckComponent>
        <DeckComponent :deck="2">
          <div
            ref="waveFormContainerDeckTwo"
            class="h-28 border border-gray-500 w-full"
          ></div>
        </DeckComponent>
      </div>
      <div class="w-1/2 mr-auto ml-auto">
        <NuxtErrorBoundary>
          <TrackLoader />
          <template #error="{ error }">
            <p class="text-red-500">{{ error }}</p>
            <button @click="resetError(error)">Try Again</button>
          </template>
        </NuxtErrorBoundary>
        <TrackList :tracks="tracks" @load-track="loadTrack" />
      </div>
    </div>
  </div>
</template>
