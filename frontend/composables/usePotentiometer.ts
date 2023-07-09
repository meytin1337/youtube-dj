interface Potentiometer {
  resultToRotation: (result: number) => number;
  getRotation: (
    clientX: number,
    clientY: number,
    left: number,
    top: number,
    width: number,
    height: number
  ) => number;
  rotationToResult: (rotation: number) => number;
}
export function usePotentionmeter(min: number, max: number): Potentiometer {
  // we want the range of motion to be 3/4 of a circle
  // therefore we need this offset in the calculation
  function getRotation(
    clientX: number,
    clientY: number,
    left: number,
    top: number,
    width: number,
    height: number
  ): number {
    // x = pixels to the right of the center of the div
    const x = clientX - (left + width / 2);
    // y = pixels to the top of the center of the div
    const y = -(clientY - (top + height / 2));
    const rotation = Math.atan2(x, y);
    // this is true for the lower third of the circle
    if (rotation > (2 * Math.PI) / 3) {
      return (2 * Math.PI) / 3;
    } else if (rotation < -(2 * Math.PI) / 3) {
      return -((2 * Math.PI) / 3);
    }
    return rotation;
  }
  function rotationToResult(rotation: number) {
    return (
      (min * (1 - rotation / ((Math.PI * 2) / 3))) / 2 +
      (max * (1 + rotation / ((Math.PI * 2) / 3))) / 2
    );
  }
  function resultToRotation(result: number) {
    return (
      // The first part returns 0 for result = min and 1 for result = max
      ((result - min) / (max - min)) * ((Math.PI * 4) / 3) - (Math.PI * 2) / 3
    );
  }
  return { resultToRotation, getRotation, rotationToResult };
}
