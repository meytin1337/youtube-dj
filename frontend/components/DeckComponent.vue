<script lang="ts" setup>
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/vue/24/solid";
interface Props {
  deck: number;
}
const props = defineProps<Props>();
const deck = props.deck === 1 ? useDeckOne() : useDeckTwo();
const setVolume = (value: string) => {
  deck.volume.value = Number(value);
  deck.wavesurfer.value?.setVolume(value);
};
const setRate = (value: string) => {
  deck.rate.value = Number(value);
  deck.wavesurfer.value?.setPlaybackRate(value);
};
const pause = () => {
  deck.wavesurfer.value?.pause();
};
const play = () => {
  deck.wavesurfer.value?.play();
};
</script>

<template>
  <div class="w-full flex flex-col justify-center align-middle m-5">
    <slot></slot>
    <PauseCircleIcon
      v-if="deck.isWaveformReady.value && deck.isPlaying.value"
      class="text-blue-400 ml-auto mr-auto h-11 w-11 m-5 cursor-pointer"
      @click="pause()"
    />
    <PlayCircleIcon
      v-else-if="deck.isWaveformReady.value && !deck.isPlaying.value"
      class="text-blue-400 ml-auto mr-auto h-11 w-11 m-5 cursor-pointer"
      @click="play"
    />
    <PlayCircleIcon
      v-else
      class="text-gray-400 ml-auto mr-auto h-11 w-11 m-5"
    />

    <RangeSlider
      type="volume"
      :min="0"
      :max="1"
      :value="String(deck.volume.value)"
      :disabled="!deck.trackId.value"
      emit="setVolume"
      @set-volume="setVolume"
    />
    <RangeSlider
      type="rate"
      :min="0.5"
      :max="2"
      :value="String(deck.rate.value)"
      :disabled="!deck.trackId.value"
      emit="setRate"
      @set-rate="setRate"
    />
  </div>
</template>

<style scoped></style>
