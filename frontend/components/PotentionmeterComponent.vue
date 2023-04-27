<script lang="ts" setup>
// todo: emit value to deck component
// pass values from deck component
//
interface Props {
  min: number;
  max: number;
  initialValue: number;
  disabled: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["rotate"]);
const result = ref<number>(props.initialValue);
watch(result, (value) => {
  emit("rotate", value);
});
const { startDrag, angle } = usePotentionmeter(props.min, props.max, result);
const rotate = computed(() => {
  const rotation = angle.value + (Math.PI * 5) / 3;
  return { transform: "rotate(" + rotation + "rad)" };
});
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div
      v-if="props.disabled"
      class="bg-gray-300 knob w-20 h-20"
      :style="rotate"
    ></div>
    <div
      v-else
      class="bg-gray-800 knob w-20 h-20"
      :style="rotate"
      @mousedown="startDrag"
    ></div>
    <slot></slot>
  </div>
</template>

<style scoped>
.knob {
  border-radius: 50%;
  display: inline-block;
  cursor: -webkit-grab;
  cursor: -moz-grab;
  position: relative;
}
.knob::after {
  content: "";
  width: 4px;
  height: 20px;
  background: #fff;
  position: absolute;
  top: 3px;
  left: 50%;
  margin-left: -1px;
}
</style>
