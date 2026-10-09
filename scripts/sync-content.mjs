import { spawnSync } from "node:child_process";

// A preview must never remove production fields by syncing a branch manifest.
if (process.env.VERCEL_ENV === "production") {
  const result = spawnSync(
    "einblick-sdk",
    ["content", "sync", "--manifest", "content/einblick.content.ts"],
    { stdio: "inherit" },
  );
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}
console.log("Content sync skipped outside a production deployment.");
