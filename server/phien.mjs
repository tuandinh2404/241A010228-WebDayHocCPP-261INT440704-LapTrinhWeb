// phien.mjs — phiên đăng nhập bằng cookie.
// Đăng nhập xong, máy chủ tạo một token ngẫu nhiên, lưu vào bảng phien_dang_nhap và gửi về trình duyệt
// trong cookie "sid" (HttpOnly: JavaScript trên trang không đọc được → khó bị đánh cắp).
// Mỗi yêu cầu sau đó, máy chủ đọc cookie, tra bảng để biết ai đang gọi và vai trò gì.
import { randomBytes } from "node:crypto";
import { truyVan } from "./db.mjs";

export const THOI_HAN_GIO = 12; // phiên tự hết hạn sau 12 giờ — đổi ở đây
const TEN_COOKIE = "sid";

function docCookie(req) {
  const ds = {};
  for (const phan of String(req.headers.cookie || "").split(";")) {
    const i = phan.indexOf("=");
    if (i > 0) ds[phan.slice(0, i).trim()] = decodeURIComponent(phan.slice(i + 1).trim());
  }
  return ds;
}

export async function taoPhien(res, taiKhoanId) {
  const token = randomBytes(32).toString("hex");
  await truyVan("INSERT INTO phien_dang_nhap (token, tai_khoan_id, het_han) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? HOUR))", [token, taiKhoanId, THOI_HAN_GIO]);
  res.setHeader("Set-Cookie", `${TEN_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${THOI_HAN_GIO * 3600}`);
}

export async function xoaPhien(req, res) {
  const token = docCookie(req)[TEN_COOKIE];
  if (token) await truyVan("DELETE FROM phien_dang_nhap WHERE token = ?", [token]);
  res.setHeader("Set-Cookie", `${TEN_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

// Trả về tài khoản đang đăng nhập, hoặc null (chưa đăng nhập / hết hạn / bị khóa)
export async function nguoiDung(req) {
  const token = docCookie(req)[TEN_COOKIE];
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const [tk] = await truyVan(
    `SELECT t.id, t.ten_dang_nhap, t.ho_ten, t.vai_tro, t.ma_sv
       FROM phien_dang_nhap p JOIN tai_khoan t ON t.id = p.tai_khoan_id
      WHERE p.token = ? AND p.het_han > NOW() AND t.bi_khoa = 0`,
    [token]
  );
  return tk || null;
}

// Dọn các phiên đã hết hạn (gọi định kỳ từ server.mjs)
export const donPhienHetHan = () => truyVan("DELETE FROM phien_dang_nhap WHERE het_han <= NOW()");
