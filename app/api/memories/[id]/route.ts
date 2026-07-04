import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sql, type Memory } from "@/lib/db";
import { deletePhoto } from "@/lib/blob";

async function requireAdmin() {
  const role = (await headers()).get("x-session-role");
  return role === "admin";
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const relationship =
    typeof body?.relationship === "string" ? body.relationship.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !relationship || !message) {
    return NextResponse.json(
      { error: "Name, relationship, and message are required" },
      { status: 400 }
    );
  }

  const rows = (await sql`
    UPDATE "Memory"
    SET name = ${name}, relationship = ${relationship}, message = ${message}
    WHERE id = ${id}
    RETURNING id, name, relationship, message, personal_photo_url, created_at
  `) as Memory[];

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ memory: rows[0] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const rows = (await sql`
    DELETE FROM "Memory" WHERE id = ${id}
    RETURNING personal_photo_url
  `) as Pick<Memory, "personal_photo_url">[];

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (rows[0].personal_photo_url) {
    await deletePhoto(rows[0].personal_photo_url).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
