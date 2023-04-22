<script lang="ts" setup>
interface Props {
  type: string;
  min: number;
  max: number;
  value: string;
  disabled: boolean;
  step: number | "any";
  emit: string;
}
const props = defineProps<Props>();
</script>

<template>
  <div v-if="disabled">
    <label
      for="disabled-range"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      ><slot></slot
    ></label>
    <input
      id="disabled-range"
      type="range"
      :min="min"
      :max="max"
      :value="value"
      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      disabled
    />
  </div>
  <div v-else>
    <label
      :for="type"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      ><slot></slot
    ></label>
    <input
      :id="type"
      type="range"
      :min="min"
      :max="max"
      :value="value"
      :step="step"
      autocomplete="off"
      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      @input="$emit(props.emit, $event.target.value)"
    />
  </div>
</template>

<style scoped></style>
