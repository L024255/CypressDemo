import { checkType } from "../criteriaUtils";

describe("checkType", () => {
  it("check criterion's type is Include or Exclude", () => {
    const result1 = checkType("Include", "inclusion");
    const result2 = checkType("Include", "exclusion");
    const result3 = checkType("Exclude", "inclusion");
    const result4 = checkType("Exclude", "exclusion");
    expect(result1).toBe(true);
    expect(result2).toBe(false);
    expect(result3).toBe(false);
    expect(result4).toBe(true);
  })
})