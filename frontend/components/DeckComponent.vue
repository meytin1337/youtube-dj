<script lang="ts" setup>
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/vue/24/solid";
interface Props {
  useDeck: Function;
}
const canvas = useCanvas();
const props = defineProps<Props>();
const deck = props.useDeck();
const setVolume = (value: string) => {
  deck.volume.value = Number(value);
  deck.sound.value?.volume(deck.volume.value);
};
const setRate = (value: string) => {
  deck.rate.value = Number(value);
  deck.sound.value?.rate(deck.rate.value);
};
deck.sound.value?.on("load", () => {
  console.log('load');
});
</script>

<template>
  <div class="w-full flex flex-col justify-center align-middle m-5">
    <slot></slot>
    <PauseCircleIcon
      v-if="deck.title.value && deck.isPlaying.value"
      class="text-blue-400 ml-auto mr-auto h-11 w-11 m-5 cursor-pointer"
      @click="deck.sound.value?.pause()"
    />
    <PlayCircleIcon
      v-else-if="deck.title.value && !deck.isPlaying.value"
      class="text-blue-400 ml-auto mr-auto h-11 w-11 m-5 cursor-pointer"
      @click="deck.sound.value?.play()"
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
      emit="setVolume"
      @set-volume="setVolume"
    />
    <RangeSlider
      type="rate"
      :min="0.5"
      :max="2"
      :value="String(deck.rate.value)"
      emit="setRate"
      @set-rate="setRate"
    />
  </div>
</template>

<style scoped></style>
