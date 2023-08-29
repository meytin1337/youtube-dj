<script lang="ts" setup>
interface Props {
  type: string;
  min: number;
  max: number;
  value: string;
  disabled: boolean;
  step: number | "any";
}
const props = defineProps<Props>();
</script>

<template>
  <div v-if="disabled" class="flex justify-center">
    <label
      for="disabled-range"
      class="mr-2 text-right text-xl font-medium text-gray-900 dark:text-white"
      ><slot></slot
    ></label>
    <input
      id="disabled-range"
      type="range"
      :min="min"
      :max="max"
      :value="value"
      class="mt-1 w-2/3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      disabled
    />
  </div>
  <div v-else>
    <label
      :for="type"
      class="mr-2 text-right text-xl font-medium text-gray-900 dark:text-white"
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
      class="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      @input="$emit('slide', $event.target.value)"
    />
  </div>
</template>

<style scoped></style>
