import {
  getTransformRotateByValue,
  getStrokeColorByValue,
} from "../CircleProgressBar";

describe("Circle progress bar feature test", () => {
  it("get transform rotate by percentage value", () => {
    const result = getTransformRotateByValue(10);
    expect(result).toBe(`${(10 / 100) * 360}deg`);
  });

  it("get stroke dot color by percentage value", () => {
    const result = getStrokeColorByValue(10);
    expect(result).toBe(`#D52B1E`);
  });
});
