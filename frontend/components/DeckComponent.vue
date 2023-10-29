<script lang="ts" setup>
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
interface Props {
  deck: number;
}
const props = defineProps<Props>();
const deck = props.deck === 1 ? useDeckOne().value : useDeckTwo().value;
const liveBpm = computed(() => Math.floor(deck.bpm * deck.rate * 100) / 100);
const lowFilterGain = ref(deck.lowFilter?.gain.value || 0);
const midFilterGain = ref(deck.midFilter?.gain.value || 0);
const highFilterGain = ref(deck.highFilter?.gain.value || 0);
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
  if (!deck.lowFilter) return;
  deck.lowFilter.gain.value = Number(value);
  lowFilterGain.value = Number(value);
};
const applyHighFilter = (value: string) => {
  if (!deck.highFilter) return;
  deck.highFilter.gain.value = Number(value);
  highFilterGain.value = Number(value);
};
const applyMidFilter = (value: string) => {
  if (!deck.midFilter) return;
  deck.midFilter.gain.value = Number(value);
  midFilterGain.value = Number(value);
};
const zoom = (value: string) => {
  deck.zoom = deck.zoom + Number(value);
  deck.wavesurfer?.zoom(deck.zoom);
};
const loop = () => {
  if (!deck.wavesurfer) return;
  const regions = deck.wavesurfer
    ?.getActivePlugins()
    .find((plugin) => plugin?.regions) as RegionsPlugin | undefined;
  if (!regions) return;
  regions.clearRegions();
  const nextBeat = useCalculateNextBeat(deck);
  // we add a 30ms offset here
  // because we want to loop before the kick
  const start = deck.wavesurfer?.getCurrentTime() + nextBeat - 0.03;
  // the offset here is 45ms because we need a 15ms timeout
  // before jumping to the beginning of the loop to decrease distortion
  const end = start + (4 * 60) / deck.bpm - 0.045;
  regions.addRegion({
    start,
    end,
    drag: false,
    resize: false,
  });
  regions.on("region-out", (region) => {
    if (!deck.highFilter || !deck.midFilter || !deck.lowFilter) return;
    // this lowers distortion
    deck.highFilter.gain.value = -100;
    deck.midFilter.gain.value = -100;
    deck.lowFilter.gain.value = -100;
    setTimeout(() => region.play(), 15);
  });
  regions.on("region-in", () => {
    setTimeout(() => {
      if (!deck.highFilter) return;
      deck.highFilter.gain.value = highFilterGain.value;
    }, 10);
    setTimeout(() => {
      if (!deck.midFilter) return;
      deck.midFilter.gain.value = midFilterGain.value;
    }, 10);
    setTimeout(() => {
      if (!deck.lowFilter) return;
      deck.lowFilter.gain.value = lowFilterGain.value;
    }, 10);
  });
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
        <UIcon
          v-if="deck.isWaveformReady"
          name="i-heroicons-plus-circle"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="zoom('-1')"
        />
        <UIcon
          v-else
          name="i-heroicons-minus-circle"
          class="text-gray-300 h-11 w-11 m-2"
        />
        <UIcon
          v-if="deck.isWaveformReady"
          name="i-heroicons-backward"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="deck.wavesurfer?.skip(-0.5)"
        />
        <UIcon
          v-else
          name="i-heroicons-backward"
          class="text-gray-300 h-11 w-11 m-2"
        />
        <UIcon
          v-if="deck.isWaveformReady && deck.isPlaying"
          name="i-heroicons-play-circle"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="pause()"
        />
        <UIcon
          v-else-if="deck.isWaveformReady && !deck.isPlaying"
          name="i-heroicons-play-circle"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="play"
        />
        <UIcon
          v-else
          name="i-heroicons-play-circle"
          class="text-gray-300 h-11 w-11 m-2"
        />
        <UIcon
          v-if="deck.isWaveformReady"
          name="i-heroicons-forward"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="deck.wavesurfer?.skip(0.5)"
        />
        <UIcon
          v-else
          name="i-heroicons-forward"
          class="text-gray-300 h-11 w-11 m-2"
        />
        <UIcon
          v-if="deck.isWaveformReady"
          name="i-heroicons-plus-circle"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="zoom('1')"
        />
        <UIcon
          v-else
          name="i-heroicons-plus-circle"
          class="text-gray-300 h-11 w-11 m-2"
        />
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
          <UIcon name="i-heroicons-speaker-wave" class="w-5 ml-1"></UIcon>
        </div>
        <div v-else class="flex">
          Muted
          <UIcon name="i-heroicons-speaker-x-mark" class="w-5 ml-1"></UIcon>
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
    <button @click="loop">Loop next 4 beats</button>
  </div>
</template>

<style scoped></style>
