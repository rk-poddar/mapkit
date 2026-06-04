import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { addComponents, createRegistryIndex, getRegistryItem, resolveRegistryItems, runCli } from "./index";

describe("@map-kit/cli registry", () => {
  it("resolves component dependencies before the requested component", () => {
    expect(resolveRegistryItems(["popup-card"]).map((item) => item.name)).toEqual(["utils", "popup-card"]);
  });

  it("creates a lightweight registry index without file contents", () => {
    const index = createRegistryIndex();
    const mapControls = index.items.find((item) => item.name === "map-controls");

    expect(index.schemaVersion).toBe("0.1.0");
    expect(mapControls?.files).toEqual([{ path: "map-controls.tsx", type: "registry:component" }]);
    expect(JSON.stringify(index)).not.toContain("HeadlessMapControls");
  });

  it("returns full item payloads for component endpoints", () => {
    const item = getRegistryItem("map-controls");

    expect(item?.preview?.component).toBe("MapControls");
    expect(item?.files[0]?.content).toContain("HeadlessMapControls");
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

  it("prints registry JSON from the CLI command", () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      logs.push(String(value));
    };

    try {
      expect(runCli(["registry", "popup-card"])).toBe(0);
    } finally {
      console.log = originalLog;
    }

    const payload = JSON.parse(logs.join("\n")) as { files: Array<{ content: string }>; name: string };
    expect(payload.name).toBe("popup-card");
    expect(payload.files[0]?.content).toContain("PopupCard");
  });
});
