import { readFileSync } from "fs";
import { join } from "path";
import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);
  const schema = readFileSync(join(process.cwd(), "db", "schema.sql"), "utf8")
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`Applied ${statements.length} statement(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
