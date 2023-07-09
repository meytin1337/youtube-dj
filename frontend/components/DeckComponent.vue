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
const zoom = (value: string) => {
  deck.zoom.value = deck.zoom.value + Number(value);
  deck.wavesurfer.value?.zoom(deck.zoom.value);
};
</script>

<template>
  <div
    class="bg-gray-100 border p-3 w-full flex flex-col justify-center items-center space-y-2"
  >
    <p class="font-bold">
      {{ deck.trackId.value ? deck.title.value : "No Track Loaded" }}
    </p>
    <slot></slot>
    <div class="flex flex-col items-center justify-center">
      <p class="font-italic mt-4">BPM: {{ liveBpm }}</p>
      <div class="flex flex-row items-center justify-center">
        <MinusCircleIcon
          v-if="deck.isWaveformReady.value"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="zoom('-1')"
        />
        <MinusCircleIcon v-else class="text-gray-300 h-11 w-11 m-2" />
        <BackwardIcon
          v-if="deck.isWaveformReady.value"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="deck.wavesurfer.value?.skip(-0.5)"
        />
        <BackwardIcon v-else class="text-gray-300 h-11 w-11 m-2" />
        <PauseCircleIcon
          v-if="deck.isWaveformReady.value && deck.isPlaying.value"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="pause()"
        />
        <PlayCircleIcon
          v-else-if="deck.isWaveformReady.value && !deck.isPlaying.value"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="play"
        />
        <PlayCircleIcon v-else class="text-gray-300 h-11 w-11 m-2" />
        <ForwardIcon
          v-if="deck.isWaveformReady.value"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="deck.wavesurfer.value?.skip(0.5)"
        />
        <ForwardIcon v-else class="text-gray-300 h-11 w-11 m-2" />
        <PlusCircleIcon
          v-if="deck.isWaveformReady.value"
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
        :initial-value="deck.volume.value"
        :disabled="!deck.isWaveformReady.value"
        @rotate="setVolume"
        ><div v-if="deck.volume.value > 0" class="flex">
          Volume {{ Math.round(100 * deck.volume.value) }}%
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
        :initial-value="deck.rate.value"
        :disabled="!deck.isWaveformReady.value"
        @rotate="setRate"
        >Playback Rate:
        {{ Math.round(100 * deck.rate.value) / 100 }}x</PotentiometerComponent
      >
      <PotentiometerComponent
        :min="-40"
        :max="40"
        :initial-value="deck.lowFilter.value"
        :disabled="!deck.isWaveformReady.value"
        @rotate="applyLowFilter"
        >Low Filter:
        {{
          Math.round(100 * deck.lowFilter.value) / 100
        }}dB</PotentiometerComponent
      >
      <PotentiometerComponent
        :min="-40"
        :max="40"
        :initial-value="deck.midFilter.value"
        :disabled="!deck.isWaveformReady.value"
        @rotate="applyMidFilter"
        >Mid Filter:
        {{
          Math.round(100 * deck.midFilter.value) / 100
        }}dB</PotentiometerComponent
      >
      <PotentiometerComponent
        :min="-40"
        :max="40"
        :initial-value="deck.highFilter.value"
        :disabled="!deck.isWaveformReady.value"
        @rotate="applyHighFilter"
        >High Filter:
        {{
          Math.round(100 * deck.highFilter.value) / 100
        }}dB</PotentiometerComponent
      >
      <PotentiometerComponent
        :min="-40"
        :max="40"
        :initial-value="deck.highFilter.value"
        :disabled="false"
        @rotate="applyHighFilter"
        >High Filter:
        {{
          Math.round(100 * deck.highFilter.value) / 100
        }}dB</PotentiometerComponent
      >
    </div>
  </div>
</template>

<style scoped></style>
