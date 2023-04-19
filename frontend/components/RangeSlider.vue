<script lang="ts" setup>
interface Props {
  type: string;
  min: number;
  max: number;
  value: string;
  disabled: boolean;
  emit: string;
}
const props = defineProps<Props>();
</script>

<template>
  <div>
    <label
      :for="type"
      class="w-full mb-2 inline-block text-neutral-700 dark:text-neutral-200"
      ><slot></slot
    ></label>
    <input
      :id="type"
      type="range"
      :min="min"
      :max="max"
      :value="value"
      :disabled="disabled"
      step="any"
      autocomplete="off"
      class="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
      @input="$emit(props.emit, $event.target.value)"
    />
  </div>
</template>

<style scoped></style>
