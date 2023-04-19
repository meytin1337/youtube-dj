<script lang="ts" setup>
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/vue/24/solid";
interface Props {
  deck: number;
}
const props = defineProps<Props>();
const deck = props.deck === 1 ? useDeckOne() : useDeckTwo();
const liveBpm = computed(
  () => Math.floor(deck.bpm.value * deck.rate.value * 100) / 100
);
const setVolume = (value: string) => {
  deck.volume.value = Number(value);
  deck.wavesurfer.value?.setVolume(Number(value));
};
const setRate = (value: string) => {
  deck.rate.value = Number(value);
  deck.wavesurfer.value?.setPlaybackRate(Number(value));
};
const pause = () => {
  deck.wavesurfer.value?.pause();
};
const play = () => {
  deck.wavesurfer.value?.play();
};
const applyLowFilter = (value: string) => {
  const filter = deck.wavesurfer.value
    ?.getFilters()
    ?.find((filter) => filter.type === "lowshelf");
  if (!filter?.gain) return;
  filter.gain.value = Number(value);
  deck.lowFilter.value = Number(value);
};
</script>

<template>
  <div class="w-full flex flex-col justify-center items-center m-5">
    {{ deck.trackId.value ? deck.title.value : "No Track Loaded" }}
    <slot></slot>
    <div class="m-5 flex flex-col items-center justify-center">
      <p class="font-bold">BPM: {{ liveBpm }}</p>
      <PauseCircleIcon
        v-if="deck.isWaveformReady.value && deck.isPlaying.value"
        class="text-blue-400 h-11 w-11 m-5 cursor-pointer"
        @click="pause()"
      />
      <PlayCircleIcon
        v-else-if="deck.isWaveformReady.value && !deck.isPlaying.value"
        class="text-blue-400 h-11 w-11 m-5 cursor-pointer"
        @click="play"
      />
      <PlayCircleIcon v-else class="text-gray-400 h-11 w-11 m-5" />
    </div>

    <RangeSlider
      class="w-5/6"
      type="volume"
      :min="0"
      :max="1"
      :value="String(deck.volume.value)"
      :disabled="!deck.trackId.value"
      emit="setVolume"
      @set-volume="setVolume"
      >Volume: {{ Math.round(deck.volume.value * 100) }}%</RangeSlider
    >
    <RangeSlider
      type="rate"
      class="w-5/6"
      :min="0.5"
      :max="2"
      :value="String(deck.rate.value)"
      :disabled="!deck.trackId.value"
      emit="setRate"
      @set-rate="setRate"
      >Speed: {{ Math.round(100 * deck.rate.value) / 100 }}x</RangeSlider
    >
    <RangeSlider
      type="lowFilter"
      class="w-5/6"
      :min="-40"
      :max="40"
      :value="String(deck.lowFilter.value)"
      :disabled="!deck.trackId.value"
      emit="applyLowFilter"
      @apply-low-filter="applyLowFilter"
      >Low Filter:
      {{ Math.round(100 * deck.lowFilter.value) / 100 }}dB</RangeSlider
    >
  </div>
</template>

<style scoped></style>
