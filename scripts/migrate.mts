import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

async function runMigrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }

  console.log("⏳ Connecting to database...");
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  const db = drizzle(connection);

  console.log("⏳ Running migrations from ./drizzle...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations applied successfully!");

  await connection.end();
  process.exit(0);
}

runMigrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
