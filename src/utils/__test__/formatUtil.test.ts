import { formatTime, formatNumber, unique } from "../formatUtil";

describe("test formatUtils functions", () => {
  it("test formatTime function with normal time string", () => {
    const result = formatTime("2022-03-09T08:16:30.492Z");
    expect(result).toBe("Wed Mar 09 2022 下午4:16:30");
  });
  it("test formatTime function with empty value", () => {
    const result = formatTime();
    expect(result).toBe("");
  });

  it("test formatNumber", () => {
    const result1 = formatNumber(999);
    const result2 = formatNumber(1000);
    const result3 = formatNumber(1001);
    const result4 = formatNumber(1000000);
    const result5 = formatNumber(1000000000);
    const result6 = formatNumber(1000000000000);
    expect(result1).toBe("999");
    expect(result2).toBe("1K");
    expect(result3).toBe("1K");
    expect(result4).toBe("1M");
    expect(result5).toBe("1B");
    expect(result6).toBe("1T");
  });

  it("test unique function", () => {
    const reuslt = unique([1,1,2,3,4,5]);
    expect(reuslt).toStrictEqual([1,2,3,4,5]);
  })
});