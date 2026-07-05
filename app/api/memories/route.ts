import { NextResponse } from "next/server";
import { sql, dedupeGalleryPhotos, type Memory } from "@/lib/db";
import { uploadPhoto, isImageFile } from "@/lib/blob";

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
    if (!isImageFile(personalPhoto)) {
      return NextResponse.json(
        { error: "Personal photo must be an image" },
        { status: 400 }
      );
    }
    try {
      ({ url: personalPhotoUrl } = await uploadPhoto(personalPhoto.name, personalPhoto, personalPhoto.type));
    } catch {
      return NextResponse.json(
        { error: "Could not process the personal photo. Please try a different file." },
        { status: 400 }
      );
    }
  }

  const photosOfHim = formData
    .getAll("photos_of_him")
    .filter((f): f is File => f instanceof File && f.size > 0);
  for (const photo of photosOfHim) {
    if (!isImageFile(photo)) {
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
    let url: string;
    let contentHash: string;
    try {
      ({ url, contentHash } = await uploadPhoto(photo.name, photo, photo.type));
    } catch {
      continue; // skip a photo we can't process; the memory itself is already saved
    }
    const [inserted] = (await sql`
      INSERT INTO "GalleryPhoto" (url, contributed_by, content_hash)
      VALUES (${url}, ${name}, ${contentHash})
      RETURNING id
    `) as { id: number }[];
    await dedupeGalleryPhotos(contentHash, inserted.id);
  }

  return NextResponse.json({ memory: rows[0] }, { status: 201 });
}
