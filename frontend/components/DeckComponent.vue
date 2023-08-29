<script lang="ts" setup>
import {
  PlayCircleIcon,
  PauseCircleIcon,
  ForwardIcon,
  BackwardIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/vue/24/solid";
interface Props {
  deck: number;
}
const props = defineProps<Props>();
const deck = props.deck === 1 ? useDeckOne().value : useDeckTwo().value;
const liveBpm = computed(() => Math.floor(deck.bpm * deck.rate * 100) / 100);
const lowFilterGain = ref(
  deck.filters.find((filter) => filter.type === "lowshelf")?.gain.value,
);
const midFilterGain = ref(
  deck.filters.find((filter) => filter.type === "peaking")?.gain.value,
);
const highFilterGain = ref(
  deck.filters.find((filter) => filter.type === "highshelf")?.gain.value,
);
const lowFilterValue = computed(() => {
  return lowFilterGain.value || 0;
});
const midFilterValue = computed(() => {
  return midFilterGain.value || 0;
});
const highFilterValue = computed(() => {
  return highFilterGain.value || 0;
});
const setVolume = (value: string) => {
  deck.volume = Number(value);
  deck.wavesurfer?.setVolume(Number(value));
};
const setRate = (value: string) => {
  deck.rate = Number(value);
  deck.wavesurfer?.setPlaybackRate(Number(value));
};
const pause = () => {
  deck.wavesurfer?.pause();
};
const play = () => {
  deck.wavesurfer?.play();
};
const applyLowFilter = (value: string) => {
  const lowFilter = deck.filters.find((filter) => filter.type === "lowshelf");
  if (!lowFilter) return;
  lowFilter.gain.value = Number(value);
  lowFilterGain.value = Number(value);
};
const applyHighFilter = (value: string) => {
  const highFilter = deck.filters.find((filter) => filter.type === "highshelf");
  if (!highFilter) return;
  highFilter.gain.value = Number(value);
  highFilterGain.value = Number(value);
};
const applyMidFilter = (value: string) => {
  const midFilter = deck.filters.find((filter) => filter.type === "peaking");
  if (!midFilter) return;
  midFilter.gain.value = Number(value);
  midFilterGain.value = Number(value);
};
const zoom = (value: string) => {
  deck.zoom = deck.zoom + Number(value);
  deck.wavesurfer?.zoom(deck.zoom);
};
</script>

<template>
  <div
    class="bg-gray-100 border p-3 w-1/2 flex flex-col justify-center items-center space-y-2"
  >
    <p class="font-bold">
      {{ deck.trackId ? deck.title : "No Track Loaded" }}
    </p>
    <slot></slot>
    <div class="flex flex-col items-center justify-center">
      <p class="font-italic mt-4">BPM: {{ liveBpm }}</p>
      <div class="flex flex-row items-center justify-center">
        <MinusCircleIcon
          v-if="deck.isWaveformReady"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="zoom('-1')"
        />
        <MinusCircleIcon v-else class="text-gray-300 h-11 w-11 m-2" />
        <BackwardIcon
          v-if="deck.isWaveformReady"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="deck.wavesurfer?.skip(-0.5)"
        />
        <BackwardIcon v-else class="text-gray-300 h-11 w-11 m-2" />
        <PauseCircleIcon
          v-if="deck.isWaveformReady && deck.isPlaying"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="pause()"
        />
        <PlayCircleIcon
          v-else-if="deck.isWaveformReady && !deck.isPlaying"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="play"
        />
        <PlayCircleIcon v-else class="text-gray-300 h-11 w-11 m-2" />
        <ForwardIcon
          v-if="deck.isWaveformReady"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="deck.wavesurfer?.skip(0.5)"
        />
        <ForwardIcon v-else class="text-gray-300 h-11 w-11 m-2" />
        <PlusCircleIcon
          v-if="deck.isWaveformReady"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="zoom('1')"
        />
        <PlusCircleIcon v-else class="text-gray-300 h-11 w-11 m-2" />
      </div>
    </div>

    <div class="flex justify-around w-full">
      <PotentiometerComponent
        :min="0"
        :max="1"
        :initial-value="deck.volume"
        :disabled="!deck.isWaveformReady"
        @rotate="setVolume"
        ><div v-if="deck.volume > 0" class="flex">
          Volume {{ Math.round(100 * deck.volume) }}%
          <SpeakerWaveIcon class="w-5 ml-1"></SpeakerWaveIcon>
        </div>
        <div v-else class="flex">
          Muted
          <SpeakerXMarkIcon class="w-5 ml-1"></SpeakerXMarkIcon>
        </div>
      </PotentiometerComponent>
      <PotentiometerComponent
        :min="0.5"
        :max="2"
        :initial-value="deck.rate"
        :disabled="!deck.isWaveformReady"
        @rotate="setRate"
        >Playback Rate:
        {{ Math.round(100 * deck.rate) / 100 }}x</PotentiometerComponent
      >
      <PotentiometerComponent
        :min="-40"
        :max="40"
        :initial-value="lowFilterValue"
        :disabled="!deck.isWaveformReady"
        @rotate="applyLowFilter"
        >Low Filter:
        {{ Math.round(100 * lowFilterValue) / 100 }}dB</PotentiometerComponent
      >
      <PotentiometerComponent
        :min="-40"
        :max="40"
        :initial-value="midFilterValue"
        :disabled="!deck.isWaveformReady"
        @rotate="applyMidFilter"
        >Mid Filter:
        {{ Math.round(100 * midFilterValue) / 100 }}dB</PotentiometerComponent
      >
      <PotentiometerComponent
        :min="-40"
        :max="40"
        :initial-value="highFilterValue"
        :disabled="!deck.isWaveformReady"
        @rotate="applyHighFilter"
        >High Filter:
        {{ Math.round(100 * highFilterValue) / 100 }}dB</PotentiometerComponent
      >
    </div>
  </div>
</template>

<style scoped></style>
