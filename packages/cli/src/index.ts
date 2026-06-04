#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { createRegistryIndex, getRegistryItem, registry, type RegistryItem } from "./registry.js";

export { createRegistryIndex, getRegistryItem, registry };

export type AddOptions = {
  cwd?: string;
  dryRun?: boolean;
  force?: boolean;
  outDir?: string;
};

export type AddResult = {
  skipped: string[];
  written: string[];
};

const registryByName = new Map(registry.map((item) => [item.name, item]));

export function listRegistry(): RegistryItem[] {
  return registry;
}

export function resolveRegistryItems(names: string[]): RegistryItem[] {
  const queue = names.length > 0 ? names : registry.filter((item) => item.name !== "utils").map((item) => item.name);
  const resolved = new Map<string, RegistryItem>();

  function visit(name: string) {
    const item = registryByName.get(name);
    if (!item) {
      throw new Error(`Unknown component "${name}". Run "map-kit list" to see available components.`);
    }

    for (const dependency of item.dependencies ?? []) {
      visit(dependency);
    }

    resolved.set(item.name, item);
  }

  for (const name of queue) {
    visit(name);
  }

  return Array.from(resolved.values());
}

export function addComponents(names: string[], options: AddOptions = {}): AddResult {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const outDir = path.resolve(cwd, options.outDir ?? "components/map-kit");
  const items = resolveRegistryItems(names);
  const result: AddResult = { skipped: [], written: [] };

  if (!options.dryRun) {
    mkdirSync(outDir, { recursive: true });
  }

  for (const item of items) {
    for (const file of item.files) {
      const target = path.join(outDir, file.path);

      if (existsSync(target) && !options.force) {
        result.skipped.push(path.relative(cwd, target));
        continue;
      }

      result.written.push(path.relative(cwd, target));

      if (!options.dryRun) {
        mkdirSync(path.dirname(target), { recursive: true });
        writeFileSync(target, file.content, "utf8");
      }
    }
  }

  return result;
}

function printHelp() {
  console.log(`Map Kit CLI

Usage:
  map-kit list
  map-kit registry [component]
  map-kit add [components...] [--out components/map-kit] [--force] [--dry-run]

Examples:
  map-kit add map-controls popup-card
  map-kit add --out src/components/map-kit
  map-kit add marker-badge --force
  map-kit registry > registry.json
  map-kit registry map-controls > map-controls.json
`);
}

function parseAddOptions(args: string[]): { names: string[]; options: AddOptions } {
  const names: string[] = [];
  const options: AddOptions = {};

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];

    if (value === "--force") {
      options.force = true;
    } else if (value === "--dry-run") {
      options.dryRun = true;
    } else if (value === "--cwd") {
      const cwd = args[++index];
      if (!cwd) {
        throw new Error('Missing value for "--cwd".');
      }
      options.cwd = cwd;
    } else if (value === "--out") {
      const outDir = args[++index];
      if (!outDir) {
        throw new Error('Missing value for "--out".');
      }
      options.outDir = outDir;
    } else if (value.startsWith("--")) {
      throw new Error(`Unknown option "${value}".`);
    } else {
      names.push(value);
    }
  }

  return { names, options };
}

export function runCli(argv = process.argv.slice(2)): number {
  const [command, ...args] = argv;

  try {
    if (!command || command === "--help" || command === "-h") {
      printHelp();
      return 0;
    }

    if (command === "list") {
      for (const item of registry.filter((entry) => entry.name !== "utils")) {
        console.log(`${item.name.padEnd(18)} ${item.description}`);
      }
      return 0;
    }

    if (command === "registry") {
      const [itemName] = args;

      if (itemName) {
        const item = getRegistryItem(itemName);
        if (!item) {
          throw new Error(`Unknown component "${itemName}". Run "map-kit list" to see available components.`);
        }
        console.log(JSON.stringify(item, null, 2));
      } else {
        console.log(JSON.stringify(createRegistryIndex(), null, 2));
      }
      return 0;
    }

    if (command === "add") {
      const { names, options } = parseAddOptions(args);
      const result = addComponents(names, options);

      for (const file of result.written) {
        console.log(`${options.dryRun ? "would create" : "created"} ${file}`);
      }

      for (const file of result.skipped) {
        console.log(`skipped ${file} (already exists)`);
      }

      return 0;
    }

    throw new Error(`Unknown command "${command}".`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runCli();
}
