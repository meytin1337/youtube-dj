<script lang="ts" setup>
import {
  PlayCircleIcon,
  PauseCircleIcon,
  ForwardIcon,
  BackwardIcon,
} from "@heroicons/vue/24/solid";
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
const applyHighFilter = (value: string) => {
  const filter = deck.wavesurfer.value
    ?.getFilters()
    ?.find((filter) => filter.type === "highshelf");
  if (!filter?.gain) return;
  filter.gain.value = Number(value);
  deck.highFilter.value = Number(value);
};
const applyMidFilter = (value: string) => {
  const filter = deck.wavesurfer.value
    ?.getFilters()
    ?.find((filter) => filter.type === "peaking");
  if (!filter?.gain) return;
  filter.gain.value = Number(value);
  deck.midFilter.value = Number(value);
};
</script>

<template>
  <div class="w-full flex flex-col justify-center items-center m-2">
    {{ deck.trackId.value ? deck.title.value : "No Track Loaded" }}
    <slot></slot>
    <div class="mt-4 flex flex-col items-center justify-center">
      <div class="mt-4 flex flex-row items-center justify-center">
        <BackwardIcon
          v-if="deck.isWaveformReady.value"
          class="text-blue-600 h-11 w-11 m-2 cursor-pointer"
          @click="deck.wavesurfer.value?.skip(-0.5)"
        />
        <BackwardIcon v-else class="text-gray-400 h-11 w-11 m-2" />
        <PauseCircleIcon
          v-if="deck.isWaveformReady.value && deck.isPlaying.value"
          class="text-blue-600 h-11 w-11 m-2 cursor-pointer"
          @click="pause()"
        />
        <PlayCircleIcon
          v-else-if="deck.isWaveformReady.value && !deck.isPlaying.value"
          class="text-blue-600 h-11 w-11 m-2 cursor-pointer"
          @click="play"
        />
        <PlayCircleIcon v-else class="text-gray-400 h-11 w-11 m-2" />
        <ForwardIcon
          v-if="deck.isWaveformReady.value"
          class="text-blue-600 h-11 w-11 m-2 cursor-pointer"
          @click="deck.wavesurfer.value?.skip(0.5)"
        />
        <ForwardIcon v-else class="text-gray-400 h-11 w-11 m-2" />
      </div>
      <p class="font-bold">BPM: {{ liveBpm }}</p>
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
      :disabled="!deck.isWaveformReady.value"
      emit="applyLowFilter"
      @apply-low-filter="applyLowFilter"
      >Low Filter:
      {{ Math.round(100 * deck.lowFilter.value) / 100 }}dB</RangeSlider
    >
    <RangeSlider
      type="midFilter"
      class="w-5/6"
      :min="-40"
      :max="40"
      :value="String(deck.midFilter.value)"
      :disabled="!deck.isWaveformReady.value"
      emit="applyMidFilter"
      @apply-mid-filter="applyMidFilter"
      >Mid Filter:
      {{ Math.round(100 * deck.midFilter.value) / 100 }}dB</RangeSlider
    >
    <RangeSlider
      type="highFilter"
      class="w-5/6"
      :min="-40"
      :max="40"
      :value="String(deck.highFilter.value)"
      :disabled="!deck.isWaveformReady.value"
      emit="applyHighFilter"
      @apply-high-filter="applyHighFilter"
      >High Filter:
      {{ Math.round(100 * deck.highFilter.value) / 100 }}dB</RangeSlider
    >
  </div>
</template>

<style scoped></style>
