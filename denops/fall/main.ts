import "./polyfill.ts";

import type { Denops } from "https://deno.land/x/denops_std@v6.4.0/mod.ts";

import { main as mainConfig } from "./main/config.ts";
import { main as mainEvent } from "./main/event.ts";
import { main as mainExtension } from "./main/extension.ts";
import { main as mainPicker } from "./main/picker.ts";
import { main as mainUtil } from "./main/util.ts";

const entrypoints = [
  mainConfig,
  mainEvent,
  mainExtension,
  mainPicker,
  mainUtil,
] as const;

export async function main(denops: Denops): Promise<void> {
  entrypoints.forEach((entrypoint) => entrypoint(denops));
  // Discover fall extensions in runtimepath
  await denops.dispatcher["extension:discover"]();
}
