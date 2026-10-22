import { describe, expect, it } from "vitest";
import { riskTone } from "@/lib/api";

describe("risk score colors", () => {
  it("0–35 is green", () => expect(riskTone(35)).toBe("success"));
  it("36–65 is amber", () => {
    expect(riskTone(36)).toBe("warning");
    expect(riskTone(65)).toBe("warning");
  });
  it("66–100 is red", () => expect(riskTone(66)).toBe("danger"));
});
