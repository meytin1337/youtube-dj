<script lang="ts" setup>
import { Howl } from "howler";
import { NuxtError } from "#app";
const youtubeLink = useState("youtubeLink", () => "");

const tracks = useTracks();
const deckOne = useDeckOne();
const deckTwo = useDeckTwo();
const canvasDeckOne = ref<HTMLCanvasElement | null>(null);
const canvasDeckTwo = ref<HTMLCanvasElement | null>(null);
const loadTrack = (deck: number, file: Blob, title: string, id: string) => {
  const fileUrl = URL.createObjectURL(file);
  const activeDeck = deck === 1 ? deckOne : deckTwo;
  const activeCanvas = deck === 1 ? canvasDeckOne.value : canvasDeckTwo.value;
  console.log(canvasDeckOne.value);
  if (!activeCanvas) throw createError("canvas not found");
  useDrawSoundWave(activeCanvas, fileUrl);
  if (activeDeck.sound.value) activeDeck.sound.value.unload();
  activeDeck.sound.value = new Howl({
    src: [fileUrl],
    onloaderror() {
      throw createError("error loading");
    },
    onplayerror() {
      throw createError("error playing");
    },
    onend() {
      activeDeck.isPlaying.value = false;
    },
    onplay() {
      activeDeck.isPlaying.value = true;
    },
    onpause() {
      activeDeck.isPlaying.value = false;
    },
    onstop() {
      activeDeck.isPlaying.value = false;
    },
    onload() {
      activeDeck.sound?.value?.rate(activeDeck.rate.value);
      activeDeck.sound?.value?.volume(activeDeck.volume.value);
    },
    format: ["mp4"],
  });
  activeDeck.title.value = title;
  activeDeck.id.value = id;
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
        <DeckComponent :use-deck="useDeckOne" :deck="1">
          <div ref="canvasDeckOne" class="h-28 shadow w-full"></div>
        </DeckComponent>
        <DeckComponent :use-deck="useDeckTwo" :deck="2">
          <div ref="canvasDeckTwo" class="h-28 shadow w-full"></div>
        </DeckComponent>
      </div>
      <TrackList
        :tracks="tracks"
        :deck-one="deckOne"
        :deck-two="deckTwo"
        @load-track="loadTrack"
      />
    </div>
  </div>
</template>
