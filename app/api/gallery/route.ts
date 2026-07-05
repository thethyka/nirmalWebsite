import { NextResponse } from "next/server";
import { sql, dedupeGalleryPhotos, type GalleryPhoto } from "@/lib/db";
import { uploadPhoto, isImageFile } from "@/lib/blob";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("photo");
  const contributedByRaw = formData?.get("contributed_by");
  const contributedBy =
    typeof contributedByRaw === "string" && contributedByRaw.trim()
      ? contributedByRaw.trim()
      : null;

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A photo file is required" }, { status: 400 });
  }
  if (!isImageFile(file)) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  let url: string;
  let contentHash: string;
  try {
    ({ url, contentHash } = await uploadPhoto(file.name, file, file.type));
  } catch {
    return NextResponse.json(
      { error: "Could not process that image. Please try a different file." },
      { status: 400 }
    );
  }

  const rows = (await sql`
    INSERT INTO "GalleryPhoto" (url, contributed_by, content_hash)
    VALUES (${url}, ${contributedBy}, ${contentHash})
    RETURNING id, url, contributed_by, created_at
  `) as GalleryPhoto[];

  await dedupeGalleryPhotos(contentHash, rows[0].id);

  return NextResponse.json({ photo: rows[0] }, { status: 201 });
}
