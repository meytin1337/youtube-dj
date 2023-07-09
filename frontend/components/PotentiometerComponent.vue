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
const element = ref<HTMLElement>();
const { getRotation, rotationToResult, resultToRotation } = usePotentionmeter(
  props.min,
  props.max
);
const rotation = ref<number>(resultToRotation(props.initialValue));
function startDrag(event: MouseEvent) {
  const { clientX, clientY } = event;
  if (!element.value) return;
  const { left, top, width, height } = element.value.getBoundingClientRect();
  rotation.value = getRotation(clientX, clientY, left, top, width, height);
  addEventListener("mousemove", drag);
  addEventListener("mouseup", () => {
    removeEventListener("mousemove", drag);
  });
  emit("rotate", rotationToResult(rotation.value));
}

function drag(event: MouseEvent) {
  if (!element.value) return;
  const { left, top, width, height } = element.value.getBoundingClientRect();
  const { clientX, clientY } = event;
  rotation.value = getRotation(clientX, clientY, left, top, width, height);
  emit("rotate", rotationToResult(rotation.value));
}
const rotate = computed(() => {
  return { transform: "rotate(" + rotation.value + "rad)" };
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
      ref="element"
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
