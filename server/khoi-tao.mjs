// khoi-tao.mjs — tạo cơ sở dữ liệu và nạp dữ liệu mẫu:  npm run khoi-tao
// Chạy database/schema.sql rồi database/du-lieu-mau.sql. Chạy lại nhiều lần không mất dữ liệu (IF NOT EXISTS / INSERT IGNORE).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { CAU_HINH_DB } from "./db.mjs";

const THU_MUC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "database");
const { database, ...khongTenDb } = CAU_HINH_DB; // kết nối chưa chọn CSDL, vì CSDL có thể chưa tồn tại

let ketNoi;
try {
  ketNoi = await mysql.createConnection({ ...khongTenDb, multipleStatements: true, charset: "utf8mb4" });
} catch (e) {
  console.error(`Không kết nối được MySQL tại ${khongTenDb.host}:${khongTenDb.port} — hãy bấm Start MySQL trong XAMPP.\n(${e.code || e.message})`);
  process.exit(1);
}
try {
  for (const tep of ["schema.sql", "du-lieu-mau.sql"]) {
    await ketNoi.query(fs.readFileSync(path.join(THU_MUC, tep), "utf8"));
    console.log("Đã chạy", tep);
  }
  const [[dem]] = await ketNoi.query(
    `SELECT (SELECT COUNT(*) FROM ${database}.tai_khoan) AS tai_khoan, (SELECT COUNT(*) FROM ${database}.bai_tap) AS bai_tap,
            (SELECT COUNT(*) FROM ${database}.bo_test) AS bo_test, (SELECT COUNT(*) FROM ${database}.giao_bai) AS giao_bai`
  );
  console.log("Hiện có:", dem);
} finally {
  await ketNoi.end();
}
