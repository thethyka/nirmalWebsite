import { NextResponse } from "next/server";
import { sql, type Memory } from "@/lib/db";
import { uploadPhoto } from "@/lib/blob";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const name = String(formData.get("name") ?? "").trim();
  const relationship = String(formData.get("relationship") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !relationship || !message) {
    return NextResponse.json(
      { error: "Name, relationship, and message are required" },
      { status: 400 }
    );
  }

  const personalPhoto = formData.get("personal_photo");
  let personalPhotoUrl: string | null = null;
  if (personalPhoto instanceof File && personalPhoto.size > 0) {
    if (!personalPhoto.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Personal photo must be an image" },
        { status: 400 }
      );
    }
    personalPhotoUrl = await uploadPhoto(personalPhoto.name, personalPhoto);
  }

  const photosOfHim = formData
    .getAll("photos_of_him")
    .filter((f): f is File => f instanceof File && f.size > 0);
  for (const photo of photosOfHim) {
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Photos of him must be images" },
        { status: 400 }
      );
    }
  }

  const rows = (await sql`
    INSERT INTO "Memory" (name, relationship, message, personal_photo_url)
    VALUES (${name}, ${relationship}, ${message}, ${personalPhotoUrl})
    RETURNING id, name, relationship, message, personal_photo_url, created_at
  `) as Memory[];

  for (const photo of photosOfHim) {
    const url = await uploadPhoto(photo.name, photo);
    await sql`
      INSERT INTO "GalleryPhoto" (url, contributed_by)
      VALUES (${url}, ${name})
    `;
  }

  return NextResponse.json({ memory: rows[0] }, { status: 201 });
}
