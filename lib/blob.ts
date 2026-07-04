import { put, del } from "@vercel/blob";

export async function uploadPhoto(filename: string, file: Blob | Buffer) {
  const blob = await put(`photos/${Date.now()}-${filename}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function deletePhoto(url: string) {
  await del(url);
}
