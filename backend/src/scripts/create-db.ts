import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import mysql from "mysql2/promise";

dotenv.config();

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    const sql = fs.readFileSync(path.join(__dirname, "init-db.sql"), "utf8");

    await connection.query(sql);

    console.log("✅ Database and tables created successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Failed to create database:", error);
  }
})();
