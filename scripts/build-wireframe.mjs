// Bakes the architectural OBJ into the compact edge lists the homepage draws.
//
//   pnpm model:build
//
// Vertices are snapped to a grid of `cellSize` model units (metres), which
// collapses fine detail such as screws and railings while keeping the long
// structural lines. A `crop` keeps only what lies inside a sphere, cutting
// lines at its surface, for a camera placed inside that sphere.
//
// Format (little endian):
//   Uint32  vertexCount
//   Uint32  edgeCount
//   Int16[vertexCount * 3]  x, y, z, normalised so 32767 = radius
//   Uint16[edgeCount * 2]   vertex indices
import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

const SOURCE = "model-source/model.obj";
const OUTPUTS = [
  // The whole building, centred on its bounding box.
  { file: "public/model/wireframe.bin", cellSize: 0.06 },
  // A few metres of the stairwell, for the hero's close-up.
  {
    file: "public/model/wireframe-detail.bin",
    cellSize: 0.05,
    crop: { center: [0.3, 4.8, -0.3], radius: 3.5 },
  },
];

const positions = [];
const faces = [];

for await (const line of createInterface({
  input: createReadStream(SOURCE),
})) {
  if (line.startsWith("v ")) {
    const [, x, y, z] = line.trim().split(/\s+/);
    positions.push(Number(x), Number(y), Number(z));
  } else if (line.startsWith("f ")) {
    const vertexCount = positions.length / 3;
    faces.push(
      line
        .trim()
        .split(/\s+/)
        .slice(1)
        .map((corner) => {
          const index = Number.parseInt(corner, 10);
          return index < 0 ? vertexCount + index : index - 1;
        }),
    );
  }
}

const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < positions.length; i++) {
  min[i % 3] = Math.min(min[i % 3], positions[i]);
  max[i % 3] = Math.max(max[i % 3], positions[i]);
}
const boundsCenter = min.map((value, axis) => (value + max[axis]) / 2);

/** Merges vertices per grid cell, averaging so edges don't stair-step. */
function cluster(cellSize) {
  const cellIds = new Map();
  const sums = [];
  const cellOf = new Int32Array(positions.length / 3);
  for (let vertex = 0; vertex < cellOf.length; vertex++) {
    const p = positions.slice(vertex * 3, vertex * 3 + 3);
    const key = p.map((value) => Math.round(value / cellSize)).join(",");
    let id = cellIds.get(key);
    if (id === undefined) {
      id = sums.length;
      cellIds.set(key, id);
      sums.push([0, 0, 0, 0]);
    }
    cellOf[vertex] = id;
    const sum = sums[id];
    sum[0] += p[0];
    sum[1] += p[1];
    sum[2] += p[2];
    sum[3]++;
  }

  // Fan triangulation gives the same diagonals a triangle wireframe shows.
  const edges = new Set();
  const addEdge = (from, to) => {
    const a = cellOf[from];
    const b = cellOf[to];
    if (a !== b) edges.add(a < b ? a * 2 ** 26 + b : b * 2 ** 26 + a);
  };
  for (const face of faces) {
    for (let i = 0; i < face.length; i++) {
      addEdge(face[i], face[(i + 1) % face.length]);
    }
    for (let i = 2; i < face.length - 1; i++) {
      addEdge(face[0], face[i]);
    }
  }

  return {
    cells: sums.map(([x, y, z, count]) => [x / count, y / count, z / count]),
    edges: [...edges].map((edge) => [
      Math.floor(edge / 2 ** 26),
      edge % 2 ** 26,
    ]),
  };
}

const along = (a, b, t) => a.map((value, axis) => value + (b[axis] - value) * t);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** The part of segment a-b inside a sphere at the origin, as [from, to] or null. */
function clipToSphere(a, b, radius) {
  const direction = b.map((value, axis) => value - a[axis]);
  const qa = dot(direction, direction);
  const qb = 2 * dot(a, direction);
  const qc = dot(a, a) - radius * radius;
  const discriminant = qb * qb - 4 * qa * qc;
  if (discriminant <= 0) return null;
  const root = Math.sqrt(discriminant);
  const from = Math.max(0, (-qb - root) / (2 * qa));
  const to = Math.min(1, (-qb + root) / (2 * qa));
  return from < to ? [from, to] : null;
}

function bake({ file, cellSize, crop }) {
  const { cells, edges } = cluster(cellSize);
  const origin = crop?.center ?? boundsCenter;
  const local = (cell) => cells[cell].map((value, axis) => value - origin[axis]);

  const vertices = [];
  const indices = [];
  const indexOfCell = new Map();
  const cellVertex = (cell) => {
    let index = indexOfCell.get(cell);
    if (index === undefined) {
      index = vertices.push(local(cell)) - 1;
      indexOfCell.set(cell, index);
    }
    return index;
  };

  for (const [cellA, cellB] of edges) {
    if (!crop) {
      indices.push(cellVertex(cellA), cellVertex(cellB));
      continue;
    }
    const a = local(cellA);
    const b = local(cellB);
    const clipped = clipToSphere(a, b, crop.radius);
    if (!clipped) continue;
    const [from, to] = clipped;
    indices.push(
      from === 0 ? cellVertex(cellA) : vertices.push(along(a, b, from)) - 1,
      to === 1 ? cellVertex(cellB) : vertices.push(along(a, b, to)) - 1,
    );
  }
  if (vertices.length > 65535) {
    throw new Error(
      `${file}: ${vertices.length} vertices do not fit 16-bit indices; raise cellSize`,
    );
  }

  const radius =
    crop?.radius ?? Math.max(...vertices.map(([x, , z]) => Math.hypot(x, z)));

  const headerSize = 8;
  const verticesSize = vertices.length * 6;
  const buffer = Buffer.alloc(headerSize + verticesSize + indices.length * 2);
  buffer.writeUInt32LE(vertices.length, 0);
  buffer.writeUInt32LE(indices.length / 2, 4);
  vertices.forEach((vertex, index) => {
    vertex.forEach((value, axis) => {
      buffer.writeInt16LE(
        Math.round((value / radius) * 32767),
        headerSize + index * 6 + axis * 2,
      );
    });
  });
  indices.forEach((value, index) => {
    buffer.writeUInt16LE(value, headerSize + verticesSize + index * 2);
  });
  writeFileSync(file, buffer);

  console.log(
    `${file}: ${vertices.length} vertices, ${indices.length / 2} edges, ` +
      `${(buffer.length / 1024).toFixed(0)} KB`,
  );
}

OUTPUTS.forEach(bake);
