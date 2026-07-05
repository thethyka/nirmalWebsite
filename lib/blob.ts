import { put, del } from "@vercel/blob";
import sharp from "sharp";
import convertHeic from "heic-convert";
import { createHash } from "crypto";

const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 82;

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"];

// Browsers don't reliably report a `image/*` MIME type for .heic/.heif files
// (some report "", some "application/octet-stream"), so fall back to the
// file extension rather than rejecting a real photo.
export function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  const lower = file.name.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function isHeic(filename: string, mimeType?: string): boolean {
  const lower = filename.toLowerCase();
  return (
    lower.endsWith(".heic") ||
    lower.endsWith(".heif") ||
    mimeType === "image/heic" ||
    mimeType === "image/heif"
  );
}

// Every upload path (admin batch import, Gallery "+", Memories "photos of
// him") funnels through here so guests' phone photos — HEIC from iPhones,
// arbitrary-resolution JPG/PNG — all land as consistently-sized, web-ready
// JPEGs. sharp's prebuilt binary can't decode HEIC's HEVC compression
// (patent-encumbered codec, excluded from the published binary), so HEIC
// input goes through heic-convert (WASM libheif) first; everything else
// (and the HEIC output) is normalized through sharp.
async function normalizeImage(
  input: Buffer,
  filename: string,
  mimeType?: string
): Promise<Buffer> {
  const source = isHeic(filename, mimeType)
    ? Buffer.from(await convertHeic({ buffer: input, format: "JPEG", quality: 0.9 }))
    : input;

  return sharp(source, { failOn: "none" })
    .rotate() // apply EXIF orientation before resizing; no-op if absent
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();
}

export async function uploadPhoto(
  filename: string,
  file: Blob | Buffer,
  mimeType?: string
) {
  const inputBuffer = Buffer.isBuffer(file) ? file : Buffer.from(await file.arrayBuffer());
  const normalized = await normalizeImage(inputBuffer, filename, mimeType);
  const jpegName = filename.replace(/\.[^./]+$/, "") + ".jpg";
  const contentHash = createHash("sha256").update(normalized).digest("hex");

  const blob = await put(`photos/${Date.now()}-${jpegName}`, normalized, {
    access: "public",
    addRandomSuffix: true,
    contentType: "image/jpeg",
  });
  return { url: blob.url, contentHash };
}

export async function deletePhoto(url: string) {
  await del(url);
}
