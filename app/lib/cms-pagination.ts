import type { EinblickListResponse } from "@einblick/sdk";

/** Follow cursors even after an empty page; an explicit limit bounds previews. */
export async function collectCmsPages<Fields extends Record<string, unknown>>(
  readPage: (cursor?: string) => Promise<EinblickListResponse<Fields>>,
  limit?: number,
): Promise<EinblickListResponse<Fields>> {
  const result = await readPage();
  result.records = [...result.records];
  result.included = [...result.included];
  const seen = new Set<string>();

  while (
    result.nextCursor &&
    (limit === undefined || result.records.length < limit)
  ) {
    const cursor = result.nextCursor;
    if (seen.has(cursor))
      throw new Error("Einblick returned a repeated pagination cursor");
    seen.add(cursor);
    const page = await readPage(cursor);
    result.records.push(...page.records);
    result.included.push(...page.included);
    result.nextCursor = page.nextCursor;
  }

  if (limit !== undefined) result.records = result.records.slice(0, limit);
  return result;
}
