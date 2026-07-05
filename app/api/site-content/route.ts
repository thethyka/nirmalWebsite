import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";

async function requireAdmin() {
  const role = (await headers()).get("x-session-role");
  return role === "admin";
}

// Updates the editable bio shown on the home page. Body: { bio: string }.
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const bio = typeof body?.bio === "string" ? body.bio.trim() : "";

  if (!bio) {
    return NextResponse.json({ error: "Bio is required" }, { status: 400 });
  }

  await sql`
    INSERT INTO "SiteContent" (key, value, updated_at)
    VALUES ('bio', ${bio}, now())
    ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = now()
  `;

  // Refresh the home page so the new bio is served immediately.
  revalidatePath("/");

  return NextResponse.json({ bio });
}
