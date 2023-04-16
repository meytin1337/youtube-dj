<script lang="ts" setup>
interface Props {
  type: string;
  min: number;
  max: number;
  value: string;
  input: Function;
}
const props = defineProps<Props>();
const label = computed(() => {
  if (props.type === "volume") {
    return `${Math.round(Number(props.value) * 100)}% Volume`;
  } else if (props.type === "rate") {
    return `${Math.round(Number(props.value) * 100) / 100}x Speed`;
  } else {
    return `${Math.round(Number(props.value) * 100) / 100}`;
  }
});
</script>

<template>
  <div>
    <label
      :for="type"
      class="w-full mb-2 inline-block text-neutral-700 dark:text-neutral-200"
      >{{ label }}</label
    >
    <input
      :id="type"
      type="range"
      :min="min"
      :max="max"
      :value="value"
      step="any"
      class="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
      @input="input($event.target?.value)"
    />
  </div>
</template>

<style scoped></style>
