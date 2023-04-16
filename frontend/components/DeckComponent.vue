<script lang="ts" setup>
interface Props {
  deck: number;
}
const props = defineProps<Props>();
const activeTrack = useActiveTracks()[props.deck - 1];
const isPlaying = ref(false);
const volume = ref("1");
const rate = ref("1");
activeTrack.sound?.value?.on("end", () => {
  isPlaying.value = false;
});
const buttonText = computed(() => {
  if (isPlaying.value) {
    return "pause";
  } else {
    return "play";
  }
});
const togglePlay = () => {
  if (isPlaying.value) {
    activeTrack.sound?.value?.pause();
    isPlaying.value = false;
  } else {
    activeTrack?.sound?.value?.play();
    isPlaying.value = true;
  }
};
const setVolume = (value: string) => {
  volume.value = value;
  activeTrack.sound?.value?.volume(Number(value));
};
const setRate = (value: string) => {
  rate.value = value;
  activeTrack.sound?.value?.rate(Number(value));
};
</script>

<template>
  <div class="w-full flex flex-col justify-center align-middle m-5">
    <div
      v-if="activeTrack.title.value"
      class="flex justify-center align-middle h-28 shadow w-full"
    >
      <p>
        {{ activeTrack.title.value }}
      </p>
    </div>

    <div v-else class="flex justify-center align-middle h-28 shadow w-full">
      Deck {{ deck }} - no track loaded
    </div>
    <button
      class="w-1/3 ml-auto mr-auto middle none center mt-5 rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      @click="togglePlay"
    >
      {{ buttonText }}
    </button>
    <RangeSlider
      type="volume"
      :min="0"
      :max="1"
      :input="setVolume"
      :value="volume"
    />
    <RangeSlider
      type="rate"
      :min="0.5"
      :max="2"
      :input="setRate"
      :value="rate"
    />
  </div>
</template>

<style scoped></style>
