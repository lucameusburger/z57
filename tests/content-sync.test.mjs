import assert from "node:assert/strict";
import {
  mkdtempSync,
  writeFileSync,
  existsSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

function runSync(environment, status = 0) {
  const directory = mkdtempSync(join(tmpdir(), "z57-content-sync-"));
  const receipt = join(directory, "called.json");
  try {
    writeFileSync(
      join(directory, "einblick-sdk"),
      `#!${process.execPath}\nrequire('node:fs').writeFileSync(${JSON.stringify(receipt)}, JSON.stringify(process.argv.slice(2))); process.exit(${status});\n`,
      { mode: 0o700 },
    );
    const env = { ...process.env, PATH: directory };
    delete env.VERCEL_ENV;
    if (environment !== undefined) env.VERCEL_ENV = environment;
    const result = spawnSync(process.execPath, ["scripts/sync-content.mjs"], {
      env,
      encoding: "utf8",
    });
    return {
      status: result.status,
      args: existsSync(receipt)
        ? JSON.parse(readFileSync(receipt, "utf8"))
        : null,
    };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("local, development and preview builds never execute a manifest sync", () => {
  for (const environment of [undefined, "development", "preview"]) {
    assert.deepEqual(runSync(environment), { status: 0, args: null });
  }
});

test("production sync uses the declared manifest and a sync failure stops the build", () => {
  const args = ["content", "sync", "--manifest", "content/einblick.content.ts"];
  assert.deepEqual(runSync("production"), { status: 0, args });
  assert.deepEqual(runSync("production", 7), { status: 7, args });
});
