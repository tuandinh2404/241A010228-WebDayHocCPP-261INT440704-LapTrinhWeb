// mat-khau.mjs — mã hóa và kiểm tra mật khẩu bằng scrypt (có sẵn trong Node, không cần thư viện).
// Không bao giờ lưu mật khẩu gốc: lưu "scrypt$<muối hex>$<băm hex>". Muối ngẫu nhiên khác nhau cho từng tài khoản,
// nên hai người cùng mật khẩu vẫn có chuỗi băm khác nhau.
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const DO_DAI_BAM = 64; // byte

export async function maHoaMatKhau(matKhau) {
  const muoi = randomBytes(16).toString("hex");
  const bam = await scryptAsync(String(matKhau), muoi, DO_DAI_BAM);
  return `scrypt$${muoi}$${bam.toString("hex")}`;
}

export async function kiemTraMatKhau(matKhau, daLuu) {
  const [loai, muoi, bamHex] = String(daLuu || "").split("$");
  if (loai !== "scrypt" || !muoi || !bamHex) return false;
  const bam = await scryptAsync(String(matKhau), muoi, DO_DAI_BAM);
  const goc = Buffer.from(bamHex, "hex");
  // so sánh thời gian cố định để không lộ thông tin qua thời gian phản hồi
  return goc.length === bam.length && timingSafeEqual(goc, bam);
}
