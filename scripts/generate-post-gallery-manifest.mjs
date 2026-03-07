import fs from "node:fs";
import path from "node:path";

const rootDirectory = process.cwd();
const galleriesDirectory = path.join(rootDirectory, "public", "images", "events");
const outputFile = path.join(rootDirectory, "app", "content", "post-galleries.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function toPosixPath(input) {
  return input.split(path.sep).join("/");
}

function walkFiles(directory, nestedPath = "") {
  const targetDirectory = path.join(directory, nestedPath);

  return fs
    .readdirSync(targetDirectory, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.name.startsWith(".")) {
        return [];
      }

      const relativePath = path.join(nestedPath, entry.name);

      if (entry.isDirectory()) {
        return walkFiles(directory, relativePath);
      }

      if (!imageExtensions.has(path.extname(entry.name).toLowerCase())) {
        return [];
      }

      return [toPosixPath(relativePath)];
    })
    .sort((left, right) => left.localeCompare(right, "de", { numeric: true }));
}

function buildManifest() {
  if (!fs.existsSync(galleriesDirectory)) {
    return {};
  }

  return fs
    .readdirSync(galleriesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .sort((left, right) => left.name.localeCompare(right.name, "de", { numeric: true }))
    .reduce((manifest, entry) => {
      manifest[entry.name] = walkFiles(path.join(galleriesDirectory, entry.name));
      return manifest;
    }, {});
}

const manifest = buildManifest();

fs.writeFileSync(outputFile, `${JSON.stringify(manifest, null, 2)}\n`);
