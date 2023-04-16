<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-2xl m-10">Welcome to youtube-dj</h1>
    <div class="flex w-1/2 justify-center">
      <DeckComponent :deck="1" />
      <DeckComponent :deck="2" />
    </div>
    <NuxtErrorBoundary>
      <TrackLoader />
      <template #error="{ error }">
        <p class="text-red-500">{{ error }}</p>
        <button @click="resetError(error)">Try Again</button>
      </template>
    </NuxtErrorBoundary>
    <TrackList />
  </div>
</template>

<script lang="ts" setup>
import { NuxtError } from "#app";
const youtubeLink = useState("youtubeLink", () => "");

const resetError = (error: NuxtError) => {
  youtubeLink.value = "";
  error.value = null;
};
</script>
