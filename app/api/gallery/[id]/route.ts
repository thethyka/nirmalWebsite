import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sql, type GalleryPhoto } from "@/lib/db";
import { deletePhoto } from "@/lib/blob";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = (await headers()).get("x-session-role");
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const rows = (await sql`
    DELETE FROM "GalleryPhoto" WHERE id = ${id}
    RETURNING url
  `) as Pick<GalleryPhoto, "url">[];

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deletePhoto(rows[0].url).catch(() => {});

  return NextResponse.json({ ok: true });
}
