import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Saves the manual gallery order set on the /order page. Body: { ids: number[] }
// where the array position is the desired display order. Any photo not listed
// has its sort_order cleared, so it drops to the end of the gallery.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const ids = body?.ids;

  if (
    !Array.isArray(ids) ||
    ids.some((id) => !Number.isInteger(id))
  ) {
    return NextResponse.json(
      { error: "Expected { ids: number[] }" },
      { status: 400 }
    );
  }

  // Clear every existing position, then stamp the new order in one shot.
  await sql`UPDATE "GalleryPhoto" SET sort_order = NULL WHERE sort_order IS NOT NULL`;

  if (ids.length > 0) {
    await sql`
      UPDATE "GalleryPhoto" AS g
      SET sort_order = v.ord
      FROM (
        SELECT id, ord
        FROM unnest(${ids}::int[]) WITH ORDINALITY AS t(id, ord)
      ) AS v
      WHERE g.id = v.id
    `;
  }

  return NextResponse.json({ ok: true, count: ids.length });
}
