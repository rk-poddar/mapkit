import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { addComponents, resolveRegistryItems } from "./index";

describe("@map-kit/cli registry", () => {
  it("resolves component dependencies before the requested component", () => {
    expect(resolveRegistryItems(["popup-card"]).map((item) => item.name)).toEqual(["utils", "popup-card"]);
  });

  it("writes app-owned components to the requested output directory", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "map-kit-cli-"));

    const result = addComponents(["map-controls"], {
      cwd,
      outDir: "src/components/map-kit",
    });

    expect(result.written).toEqual([
      "src/components/map-kit/utils.ts",
      "src/components/map-kit/map-controls.tsx",
    ]);
    expect(readFileSync(path.join(cwd, "src/components/map-kit/map-controls.tsx"), "utf8")).toContain(
      "HeadlessMapControls",
    );
  });

  it("skips existing files unless force is enabled", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "map-kit-cli-"));

    addComponents(["marker-badge"], { cwd });
    const result = addComponents(["marker-badge"], { cwd });

    expect(result.skipped).toEqual(["components/map-kit/utils.ts", "components/map-kit/marker-badge.tsx"]);
    expect(result.written).toEqual([]);
  });
});
