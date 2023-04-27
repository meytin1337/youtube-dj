export const usePotentionmeter = (min: number, max: number, result: Ref) => {
  const offset = Math.PI / 3;
  const element = ref<HTMLDivElement | null>(null);
  const angle = ref<number>(resultToAngle(result.value));
  function getRotation(event: MouseEvent | TouchEvent): number {
    const { clientX, clientY } = event;
    const { left, top, width, height } = element.value.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = -(clientY - (top + height / 2));
    // rotate 300 degrees
    const rotatedX =
      x * Math.cos((Math.PI * 5) / 3) - y * Math.sin((Math.PI * 5) / 3);
    const rotatedY =
      x * Math.sin((Math.PI * 5) / 3) + y * Math.cos((Math.PI * 5) / 3);
    const rotation = Math.atan2(rotatedX, rotatedY);
    if (rotation + offset < 0 && angle.value < 0) {
      return -offset;
    }
    if (rotation + offset < 0 && angle.value > 0) {
      return Math.PI;
    }
    return rotation;
  }
  function angleToResult(angle: number) {
    return (
      min * (1 - (angle + offset) / ((Math.PI * 4) / 3)) +
      ((angle + offset) / ((Math.PI * 4) / 3)) * max
    );
  }
  function resultToAngle(result: number) {
    return ((result - min) / (max - min)) * ((Math.PI * 4) / 3) - offset;
  }
  function startDrag(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    if (!(event.target instanceof HTMLDivElement)) return;
    element.value = event.target;
    angle.value = getRotation(event);
    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);
  }
  function drag(event: MouseEvent) {
    event.preventDefault();
    angle.value = getRotation(event);
    result.value = angleToResult(angle.value);
  }

  function stopDrag() {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchend", stopDrag);
  }

  return { startDrag, angle, result, resultToAngle };
};
