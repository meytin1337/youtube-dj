import { test, expect, describe } from "vitest";

const result = ref(0);
const min = 0;
const max = 5;
const { resultToRotation, getRotation, rotationToResult } = usePotentionmeter(
  min,
  max,
  result
);

describe("getResult", () => {
  test("It should return 0 when the vector points to the y-axis", () => {
    expect(getRotation(0, -1, 0, 0, 0, 0)).toBe(0);
  });

  test("It should return PI / 2 when the vector points to the x axis", () => {
    expect(getRotation(1, 0, 0, 0, 0, 0)).toBe(Math.PI / 2);
  });
});

describe("resultToRotation", () => {
  test("It should return PI * 2 / 3 when the result is max", () => {
    expect(resultToRotation(max)).toBe((Math.PI * 2) / 3);
  });

  test("It should return -PI * 3 / 2 when the result is min", () => {
    expect(resultToRotation(min)).toBe((-Math.PI * 2) / 3);
  });

  test("It should return 0 when the result is the arithmetic middle of min and max", () => {
    expect(resultToRotation((min + max) / 2)).toBe(0);
  });
});

describe("rotationToResult", () => {
  test("It should return max when the rotation is PI * 2 / 3", () => {
    expect(rotationToResult((Math.PI * 2) / 3)).toBe(max);
  });

  test("It should return min when the rotation is -PI * 3 / 2", () => {
    expect(rotationToResult((-Math.PI * 2) / 3)).toBe(min);
  });

  test("It should return the arithmetic middle of min and max when the rotation is 0", () => {
    expect(rotationToResult(0)).toBe((min + max) / 2);
  });
});
