import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = neon(process.env.DATABASE_URL);

export type Memory = {
  id: number;
  name: string;
  relationship: string;
  message: string;
  personal_photo_url: string | null;
  created_at: string;
};

export type GalleryPhoto = {
  id: number;
  url: string;
  contributed_by: string | null;
  created_at: string;
};
