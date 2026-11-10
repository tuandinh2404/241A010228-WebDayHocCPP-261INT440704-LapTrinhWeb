// db.mjs — kết nối MySQL (MariaDB của XAMPP) bằng thư viện mysql2.
// Thông số đọc từ biến môi trường, mặc định đúng với XAMPP mới cài: localhost:3306, user root, không mật khẩu.
//   DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
import mysql from "mysql2/promise";

export const CAU_HINH_DB = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "web_day_hoc_cpp",
};

// Pool: giữ sẵn vài kết nối dùng lại, không mở/đóng kết nối mới cho mỗi yêu cầu.
export const pool = mysql.createPool({ ...CAU_HINH_DB, connectionLimit: 10, charset: "utf8mb4", dateStrings: true });

// Chạy một câu SQL có tham số (dấu ?) — mysql2 tự thoát ký tự, chống SQL injection.
export async function truyVan(sql, thamSo = []) {
  const [hang] = await pool.execute(sql, thamSo);
  return hang;
}

// Chạy nhiều câu trong một giao dịch: lỗi ở bất kỳ câu nào thì hoàn tác tất cả.
export async function giaoDich(lam) {
  const ketNoi = await pool.getConnection();
  try {
    await ketNoi.beginTransaction();
    const kq = await lam(ketNoi);
    await ketNoi.commit();
    return kq;
  } catch (e) {
    await ketNoi.rollback();
    throw e;
  } finally {
    ketNoi.release();
  }
}
