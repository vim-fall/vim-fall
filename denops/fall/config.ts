import type { Denops } from "https://deno.land/x/denops_std@v6.3.0/mod.ts";
import { batch } from "https://deno.land/x/denops_std@v6.3.0/batch/mod.ts";
import * as autocmd from "https://deno.land/x/denops_std@v6.3.0/autocmd/mod.ts";
import * as buffer from "https://deno.land/x/denops_std@v6.3.0/buffer/mod.ts";
import * as opt from "https://deno.land/x/denops_std@v6.3.0/option/mod.ts";
import { dirname } from "https://deno.land/std@0.219.0/path/mod.ts";
import { ensureDir, exists } from "https://deno.land/std@0.219.0/fs/mod.ts";

import { getExtensionConfigPath, getPickerConfigPath } from "./const.ts";
import { defaultConfig as defaultPickerConfig } from "./config/picker.ts";
import { defaultConfig as defaultExtensionConfig } from "./config/extension.ts";

export async function editPickerConfig(
  denops: Denops,
): Promise<void> {
  const path = getPickerConfigPath();
  await ensureDir(dirname(path));
  if (!await exists(path)) {
    await Deno.writeTextFile(
      path,
      JSON.stringify(defaultPickerConfig, null, 2),
    );
  }
  await buffer.open(denops, path);
  await batch(denops, async (denops) => {
    await opt.autochdir.set(denops, false);
    await opt.bufhidden.set(denops, "wipe");
  });
  await autocmd.group(denops, "fall_picker_config_edit", (helper) => {
    helper.remove("*", "<buffer>");
    helper.define(
      "BufWritePost",
      "<buffer>",
      `call denops#notify('${denops.name}', 'reloadConfig', ['picker'])`,
    );
  });
}

export async function editExtensionConfig(
  denops: Denops,
): Promise<void> {
  const path = getExtensionConfigPath();
  await ensureDir(dirname(path));
  if (!await exists(path)) {
    await Deno.writeTextFile(
      path,
      JSON.stringify(defaultExtensionConfig, null, 2),
    );
  }
  await buffer.open(denops, path);
  await batch(denops, async (denops) => {
    await opt.autochdir.set(denops, false);
    await opt.bufhidden.set(denops, "wipe");
  });
  await autocmd.group(denops, "fall_extension_config_edit", (helper) => {
    helper.remove("*", "<buffer>");
    helper.define(
      "BufWritePost",
      "<buffer>",
      `call denops#notify('${denops.name}', 'reloadConfig', ['extension'])`,
    );
  });
}
