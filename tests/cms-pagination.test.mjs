import assert from "node:assert/strict";
import { test } from "node:test";

import { collectCmsPages } from "../app/lib/cms-pagination.ts";

const page = (records, nextCursor, included = []) => ({
  resource: { slug: "events" },
  fields: [],
  records,
  nextCursor,
  included,
});

test("follows short and empty pages and retains included relations", async () => {
  const cursors = [];
  const pages = [page([1], "a", ["tour"]), page([], "b"), page([2], null)];
  const result = await collectCmsPages(async (cursor) => {
    cursors.push(cursor);
    return pages.shift();
  });
  assert.deepEqual(cursors, [undefined, "a", "b"]);
  assert.deepEqual(result.records, [1, 2]);
  assert.deepEqual(result.included, ["tour"]);
  assert.equal(result.nextCursor, null);
});

test("keeps the preview bounded by its explicit limit", async () => {
  let calls = 0;
  const result = await collectCmsPages(async () => {
    calls++;
    return page([1], "a");
  }, 1);
  assert.deepEqual(result.records, [1]);
  assert.equal(calls, 1);
});

test("rejects repeated cursors and failed later pages instead of returning partial data", async () => {
  await assert.rejects(
    collectCmsPages(async () => page([], "a")),
    /repeated pagination cursor/,
  );
  await assert.rejects(
    collectCmsPages(async (cursor) => {
      if (cursor) throw new Error("API unavailable");
      return page([1], "a");
    }),
    /API unavailable/,
  );
});
