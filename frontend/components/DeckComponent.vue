<script lang="ts" setup>
interface Props {
  deckId: number;
}
const emit = defineEmits([
  "setVolume",
  "setZoom",
  "setRate",
  "toggleLoop",
  "togglePlay",
  "skip",
  "applyLowFilter",
  "applyMidFilter",
  "applyHighFilter",
]);
const props = defineProps<Props>();
const deckValues = useDeckValues(props.deckId).value;
const liveBpm = computed(
  () => Math.floor(deckValues.bpm * deckValues.rate * 100) / 100,
);
const setVolume = (value: string) => {
  deckValues.volume = Number(value);
  emit("setVolume", props.deckId);
};
const setRate = (value: string) => {
  deckValues.rate = Number(value);
  emit("setRate", props.deckId);
};
const setZoom = (value: number) => {
  deckValues.zoom += value;
  emit("setZoom", props.deckId);
};
const applyLowFilter = (value: string) => {
  deckValues.lowFilterGain = Number(value);
  emit("applyLowFilter", props.deckId);
};
const applyMidFilter = (value: string) => {
  deckValues.midFilterGain = Number(value);
  emit("applyMidFilter", props.deckId);
};
const applyHighFilter = (value: string) => {
  deckValues.highFilterGain = Number(value);
  emit("applyHighFilter", props.deckId);
};
const toggleLoop = (beats: number) => {
  deckValues.activeLoop = deckValues.activeLoop === beats ? null : beats;
  emit("toggleLoop", props.deckId, beats);
};
</script>

<template>
  <div class="p-3 flex flex-col justify-center items-center space-y-2">
    <p class="font-bold">
      {{ deckValues.trackId ? deckValues.title : "No Track Loaded" }}
    </p>
    <div class="flex flex-col items-center justify-center">
      <p class="font-italic mt-4">BPM: {{ liveBpm }}</p>
      <div class="flex flex-row items-center justify-center">
        <UIcon
          v-if="deckValues.isWaveformReady"
          name="i-heroicons-plus-circle"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="setZoom(-1)"
        />
        <UIcon
          v-else
          name="i-heroicons-minus-circle"
          class="text-gray-300 h-11 w-11 m-2"
        />
        <UIcon
          v-if="deckValues.isWaveformReady"
          name="i-heroicons-backward"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="$emit('skip', props.deckId, -0.5)"
        />
        <UIcon
          v-else
          name="i-heroicons-backward"
          class="text-gray-300 h-11 w-11 m-2"
        />
        <UIcon
          v-if="deckValues.isWaveformReady && deckValues.isPlaying"
          name="i-heroicons-play-circle"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="$emit('togglePlay', props.deckId)"
        />
        <UIcon
          v-else-if="deckValues.isWaveformReady && !deckValues.isPlaying"
          name="i-heroicons-play-circle"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="$emit('togglePlay', props.deckId)"
        />
        <UIcon
          v-else
          name="i-heroicons-play-circle"
          class="text-gray-300 h-11 w-11 m-2"
        />
        <UIcon
          v-if="deckValues.isWaveformReady"
          name="i-heroicons-forward"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="$emit('skip', props.deckId, 0.5)"
        />
        <UIcon
          v-else
          name="i-heroicons-forward"
          class="text-gray-300 h-11 w-11 m-2"
        />
        <UIcon
          v-if="deckValues.isWaveformReady"
          name="i-heroicons-plus-circle"
          class="text-gray-800 h-11 w-11 m-2 cursor-pointer"
          @click="setZoom(1)"
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
        :initial-value="deckValues.volume"
        :disabled="!deckValues.isWaveformReady"
        @rotate="setVolume"
        ><div v-if="deckValues.volume > 0" class="flex">
          Volume {{ Math.round(100 * deckValues.volume) }}%
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
        :initial-value="deckValues.rate"
        :disabled="!deckValues.isWaveformReady"
        @rotate="setRate"
        >Playback Rate:
        {{ Math.round(100 * deckValues.rate) / 100 }}x</PotentiometerComponent
      >
      <PotentiometerComponent
        :min="-40"
        :max="40"
        :initial-value="deckValues.lowFilterGain"
        :disabled="!deckValues.isWaveformReady"
        @rotate="applyLowFilter"
        >Low Filter:
        {{
          Math.round(100 * deckValues.lowFilterGain) / 100
        }}dB</PotentiometerComponent
      >
      <PotentiometerComponent
        :min="-40"
        :max="40"
        :initial-value="deckValues.midFilterGain"
        :disabled="!deckValues.isWaveformReady"
        @rotate="applyMidFilter"
        >Mid Filter:
        {{
          Math.round(100 * deckValues.midFilterGain) / 100
        }}dB</PotentiometerComponent
      >
      <PotentiometerComponent
        :min="-40"
        :max="40"
        :initial-value="deckValues.highFilterGain"
        :disabled="!deckValues.isWaveformReady"
        @rotate="applyHighFilter"
        >High Filter:
        {{
          Math.round(100 * deckValues.highFilterGain) / 100
        }}dB</PotentiometerComponent
      >
    </div>
    <div class="flex flex-row space-x-1">
      <UButton
        icon="i-heroicons-arrow-path"
        size="sm"
        :color="deckValues.activeLoop === 4 ? 'black' : 'gray'"
        :disabled="
          !deckValues.isWaveformReady ||
          (deckValues.activeLoop && deckValues.activeLoop !== 4)
        "
        label="4x"
        variant="solid"
        @click="toggleLoop(4)"
      />
      <UButton
        icon="i-heroicons-arrow-path"
        size="sm"
        :color="deckValues.activeLoop === 8 ? 'black' : 'gray'"
        :disabled="
          !deckValues.isWaveformReady ||
          (deckValues.activeLoop && deckValues.activeLoop !== 8)
        "
        label="8x"
        variant="solid"
        @click="toggleLoop(8)"
      />
      <UButton
        icon="i-heroicons-arrow-path"
        size="sm"
        :color="deckValues.activeLoop === 16 ? 'black' : 'gray'"
        :disabled="
          !deckValues.isWaveformReady ||
          (deckValues.activeLoop && deckValues.activeLoop !== 16)
        "
        label="16x"
        variant="solid"
        @click="toggleLoop(16)"
      />
    </div>
  </div>
</template>

<style scoped></style>
