// api.mjs — toàn bộ API của hệ thống. Mỗi API khai báo vai trò được gọi:
//   null              : ai cũng gọi được (đăng ký, đăng nhập)
//   "dang-nhap"       : đã đăng nhập (vai trò nào cũng được)
//   ["admin", ...]    : chỉ các vai trò trong danh sách
// Mọi câu SQL dùng tham số "?" (mysql2 tự thoát ký tự) → chống SQL injection.
import { truyVan, giaoDich } from "./db.mjs";
import { maHoaMatKhau, kiemTraMatKhau } from "./mat-khau.mjs";
import { taoPhien, xoaPhien, nguoiDung } from "./phien.mjs";
import { chamBai } from "./harness.mjs";
import { chayTrenMay } from "./chay-tren-may.mjs";

const SO_TEST = 5;                       // mỗi bài 5 bộ test
const QUAN_LY = ["giao_vien", "admin"];  // vai trò được quản lý bài tập, giao bài, xem bảng điểm
const PHAN = ["kiemtra", "thi"];
const MUC = ["de", "tb", "kho"];
const VAI_TRO = ["admin", "giao_vien", "sinh_vien"];
const MSSV_HOP_LE = /^[A-Za-z0-9]{4,20}$/;
const TEN_DN_HOP_LE = /^[A-Za-z0-9_.]{3,50}$/;

class LoiApi extends Error {
  constructor(status, thongBao) { super(thongBao); this.status = status; }
}
const loi = (status, thongBao) => { throw new LoiApi(status, thongBao); };

function kiemTraMatKhauMoi(mk) {
  if (typeof mk !== "string" || mk.length < 6 || mk.length > 100) loi(400, "Mật khẩu cần từ 6 đến 100 ký tự.");
}
const sach = (s) => String(s ?? "").trim().replace(/\s+/g, " ");

// ---------- Bảng định tuyến ----------
const DS_API = [];
const api = (method, duongDan, vaiTro, xuLy) =>
  DS_API.push({ method, re: new RegExp("^" + duongDan.replace(/:id/g, "(\\d+)") + "$"), vaiTro, xuLy });

// ======================================================================
// TÀI KHOẢN CỦA TÔI
// ======================================================================
api("POST", "/api/dang-ky", null, async ({ body, res }) => {
  const maSV = String(body.maSV || "").trim();
  const hoTen = sach(body.hoTen);
  if (!MSSV_HOP_LE.test(maSV)) loi(400, "Mã SV gồm 4–20 chữ hoặc số.");
  if (hoTen.length < 2 || hoTen.length > 100) loi(400, "Nhập họ và tên.");
  kiemTraMatKhauMoi(body.matKhau);
  const daCo = await truyVan("SELECT id FROM tai_khoan WHERE ten_dang_nhap = ? OR ma_sv = ?", [maSV, maSV]);
  if (daCo.length) loi(409, "Mã SV này đã có tài khoản. Hãy đăng nhập.");
  const kq = await truyVan(
    "INSERT INTO tai_khoan (ten_dang_nhap, mat_khau, ho_ten, vai_tro, ma_sv) VALUES (?, ?, ?, 'sinh_vien', ?)",
    [maSV, await maHoaMatKhau(body.matKhau), hoTen, maSV]
  );
  await taoPhien(res, kq.insertId);
});

api("POST", "/api/dang-nhap", null, async ({ body, res }) => {
  const ten = String(body.tenDangNhap || "").trim();
  const [tk] = await truyVan("SELECT id, mat_khau, bi_khoa FROM tai_khoan WHERE ten_dang_nhap = ?", [ten]);
  // cùng một câu báo lỗi cho "sai tên" và "sai mật khẩu" → không lộ tên đăng nhập nào tồn tại
  if (!tk || !(await kiemTraMatKhau(String(body.matKhau || ""), tk.mat_khau))) loi(401, "Sai tên đăng nhập hoặc mật khẩu.");
  if (tk.bi_khoa) loi(403, "Tài khoản đã bị khóa. Liên hệ quản trị viên.");
  await taoPhien(res, tk.id);
});

api("POST", "/api/dang-xuat", null, async ({ req, res }) => { await xoaPhien(req, res); });

api("GET", "/api/toi", null, async ({ req }) => {
  const u = await nguoiDung(req);
  return { nguoiDung: u && { id: u.id, tenDangNhap: u.ten_dang_nhap, hoTen: u.ho_ten, vaiTro: u.vai_tro, maSV: u.ma_sv } };
});

api("POST", "/api/doi-mat-khau", "dang-nhap", async ({ body, user }) => {
  const [tk] = await truyVan("SELECT mat_khau FROM tai_khoan WHERE id = ?", [user.id]);
  if (!(await kiemTraMatKhau(String(body.matKhauCu || ""), tk.mat_khau))) loi(400, "Mật khẩu hiện tại không đúng.");
  kiemTraMatKhauMoi(body.matKhauMoi);
  await truyVan("UPDATE tai_khoan SET mat_khau = ? WHERE id = ?", [await maHoaMatKhau(body.matKhauMoi), user.id]);
});

// ======================================================================
// LÀM BÀI (mọi tài khoản đã đăng nhập)
// ======================================================================
// Danh sách bài được giao cho một phần. Chỉ gửi kèm Test 1 (ví dụ công khai); các test còn lại ở lại máy chủ.
async function baiDuocGiao(phan) {
  const hang = await truyVan(
    `SELECT b.id, b.tieu_de, b.chuong, b.muc, b.de_bai, t1.input AS vd_in, t1.output AS vd_out,
            (SELECT COUNT(*) FROM bo_test t WHERE t.bai_tap_id = b.id) AS so_test
       FROM giao_bai g JOIN bai_tap b ON b.id = g.bai_tap_id
       LEFT JOIN bo_test t1 ON t1.bai_tap_id = b.id AND t1.thu_tu = 1
      WHERE g.phan = ?
      ORDER BY FIELD(b.muc, 'de', 'tb', 'kho'), b.id`,
    [phan]
  );
  return hang.map((h) => ({ id: h.id, tieuDe: h.tieu_de, chuong: h.chuong, muc: h.muc, deBai: h.de_bai, soTest: Number(h.so_test), viDu: { input: h.vd_in ?? "", output: h.vd_out ?? "" } }));
}

api("GET", "/api/bai-tap", "dang-nhap", async ({ url }) => {
  const phan = url.searchParams.get("phan");
  if (!PHAN.includes(phan)) loi(400, "Phần phải là kiemtra hoặc thi.");
  return baiDuocGiao(phan);
});

// Nộp bài: máy chủ tự lấy bộ test trong CSDL để chấm (trình duyệt chỉ gửi mã bài + code)
api("POST", "/api/nop-bai", "dang-nhap", async ({ body, user }) => {
  const phan = body.phan;
  if (!PHAN.includes(phan)) loi(400, "Phần phải là kiemtra hoặc thi.");
  const ds = Array.isArray(body.bai) ? body.bai : [];
  const [itNhat, nhieuNhat] = phan === "thi" ? [2, 3] : [1, 1];
  if (ds.length < itNhat || ds.length > nhieuNhat) loi(400, phan === "thi" ? "Phần Thi cần nộp 2 đến 3 bài." : "Phần Kiểm tra nộp đúng 1 bài.");
  const giao = new Map((await baiDuocGiao(phan)).map((b) => [b.id, b]));
  const ids = ds.map((x) => Number(x.id));
  if (new Set(ids).size !== ids.length) loi(400, "Một bài bị chọn hai lần.");
  for (const x of ds) {
    if (!giao.has(Number(x.id))) loi(400, "Có bài không nằm trong danh sách được giao.");
    if (typeof x.code !== "string" || x.code.length > 20000) loi(400, "Code thiếu hoặc quá dài (tối đa 20.000 ký tự).");
  }

  const ketQua = [];
  for (const x of ds) {
    const bai = giao.get(Number(x.id));
    const tests = await truyVan("SELECT input, output FROM bo_test WHERE bai_tap_id = ? ORDER BY thu_tu", [bai.id]);
    const kq = await chamBai(x.code, tests, chayTrenMay);
    if (kq.loiMay) loi(503, "Máy chấm gặp lỗi: " + kq.loi + " Hãy nộp lại.");
    ketQua.push({ bai, kq, code: x.code });
  }
  const diem = Math.round((ketQua.reduce((t, r) => t + (r.kq.diem / r.kq.toiDa) * 10, 0) / ketQua.length) * 100) / 100;

  const luotNopId = await giaoDich(async (kn) => {
    const [kq] = await kn.execute("INSERT INTO luot_nop (tai_khoan_id, phan, diem) VALUES (?, ?, ?)", [user.id, phan, diem]);
    for (const r of ketQua)
      await kn.execute("INSERT INTO ket_qua_bai (luot_nop_id, bai_tap_id, tieu_de, diem, toi_da, ma_nguon) VALUES (?, ?, ?, ?, ?, ?)",
        [kq.insertId, r.bai.id, r.bai.tieuDe, r.kq.diem, r.kq.toiDa, r.code]);
    return kq.insertId;
  });

  return {
    luotNopId, phan, diem,
    bai: ketQua.map(({ bai, kq }) => ({
      id: bai.id, tieuDe: bai.tieuDe, muc: bai.muc, viDu: bai.viDu,
      diem: kq.diem, toiDa: kq.toiDa, soDung: kq.soDung, bienDich: kq.bienDich, loi: kq.loi,
      // output của chương trình chỉ trả về cho Test 1 (để so với ví dụ); test ẩn chỉ báo trạng thái
      tests: kq.tests.map((t, k) => ({ dung: t.dung, trangThai: t.trangThai, ms: t.ms, loi: t.loi, output: k === 0 ? t.output : undefined })),
    })),
  };
});

// Lấy các lượt nộp kèm kết quả từng bài (dùng chung cho "Kết quả của tôi" và "Bảng điểm")
async function layLuotNop(dieuKien, thamSo, { maNguon = false, gioiHan = 500 } = {}) {
  const luot = await truyVan(
    `SELECT l.id, l.phan, l.diem, l.nop_luc, t.id AS tk_id, t.ho_ten, t.ma_sv, t.ten_dang_nhap, t.vai_tro
       FROM luot_nop l JOIN tai_khoan t ON t.id = l.tai_khoan_id
      ${dieuKien ? "WHERE " + dieuKien : ""}
      ORDER BY l.nop_luc DESC, l.id DESC LIMIT ${Number(gioiHan)}`,
    thamSo
  );
  if (!luot.length) return [];
  const ids = luot.map((l) => l.id);
  const bai = await truyVan(
    `SELECT luot_nop_id, bai_tap_id, tieu_de, diem, toi_da${maNguon ? ", ma_nguon" : ""}
       FROM ket_qua_bai WHERE luot_nop_id IN (${ids.map(() => "?").join(",")}) ORDER BY id`,
    ids
  );
  return luot.map((l) => ({
    id: l.id, phan: l.phan, diem: Number(l.diem), nopLuc: l.nop_luc,
    taiKhoan: { id: l.tk_id, hoTen: l.ho_ten, maSV: l.ma_sv, tenDangNhap: l.ten_dang_nhap, vaiTro: l.vai_tro },
    bai: bai.filter((b) => b.luot_nop_id === l.id).map((b) => ({ baiTapId: b.bai_tap_id, tieuDe: b.tieu_de, diem: b.diem, toiDa: b.toi_da, maNguon: b.ma_nguon })),
  }));
}

api("GET", "/api/ket-qua-cua-toi", "dang-nhap", async ({ user }) => layLuotNop("l.tai_khoan_id = ?", [user.id], { maNguon: true, gioiHan: 200 }));

// ======================================================================
// QUẢN LÝ BÀI TẬP, GIAO BÀI, BẢNG ĐIỂM (Giáo viên + Admin)
// ======================================================================
function kiemTraBaiTap(b) {
  const tieuDe = sach(b.tieuDe), deBai = String(b.deBai || "").trim();
  const chuong = Number(b.chuong);
  if (!tieuDe || tieuDe.length > 120) loi(400, "Tên bài cần từ 1 đến 120 ký tự.");
  if (!Number.isInteger(chuong) || chuong < 1 || chuong > 6) loi(400, "Chương phải từ 1 đến 6.");
  if (!MUC.includes(b.muc)) loi(400, "Mức phải là Dễ, Trung bình hoặc Khó.");
  if (!deBai || deBai.length > 10000) loi(400, "Nhập đề bài (tối đa 10.000 ký tự).");
  if (!Array.isArray(b.tests) || b.tests.length !== SO_TEST) loi(400, `Cần đúng ${SO_TEST} bộ test.`);
  const tests = b.tests.map((t) => ({ input: String(t?.input ?? ""), output: String(t?.output ?? "").replace(/\s+$/, "") }));
  if (tests.some((t) => !t.output.trim())) loi(400, "Mỗi bộ test cần có output đúng.");
  if (tests.some((t) => t.input.length > 10000 || t.output.length > 10000)) loi(400, "Bộ test quá dài (tối đa 10.000 ký tự).");
  return { tieuDe, chuong, muc: b.muc, deBai, tests };
}

// Giáo viên chỉ sửa / xóa bài mình tạo; Admin sửa / xóa được mọi bài
async function baiDuocSua(id, user) {
  const [b] = await truyVan("SELECT id, nguoi_tao FROM bai_tap WHERE id = ?", [id]);
  if (!b) loi(404, "Không tìm thấy bài tập.");
  if (user.vai_tro !== "admin" && b.nguoi_tao !== user.id) loi(403, "Bạn chỉ sửa được bài do mình tạo.");
}

api("GET", "/api/quan-ly/bai-tap", QUAN_LY, async ({ user }) => {
  const bai = await truyVan(
    `SELECT b.id, b.tieu_de, b.chuong, b.muc, b.de_bai, b.nguoi_tao, t.ho_ten AS ten_nguoi_tao, b.tao_luc,
            (SELECT GROUP_CONCAT(g.phan) FROM giao_bai g WHERE g.bai_tap_id = b.id) AS giao
       FROM bai_tap b LEFT JOIN tai_khoan t ON t.id = b.nguoi_tao
      ORDER BY FIELD(b.muc, 'de', 'tb', 'kho'), b.id`
  );
  const tests = await truyVan("SELECT bai_tap_id, input, output FROM bo_test ORDER BY bai_tap_id, thu_tu");
  return bai.map((b) => ({
    id: b.id, tieuDe: b.tieu_de, chuong: b.chuong, muc: b.muc, deBai: b.de_bai, taoLuc: b.tao_luc,
    nguoiTao: b.ten_nguoi_tao || "(đã xóa)", coTheSua: user.vai_tro === "admin" || b.nguoi_tao === user.id,
    giao: b.giao ? b.giao.split(",") : [],
    tests: tests.filter((t) => t.bai_tap_id === b.id).map((t) => ({ input: t.input, output: t.output })),
  }));
});

api("POST", "/api/quan-ly/bai-tap", QUAN_LY, async ({ body, user }) => {
  const b = kiemTraBaiTap(body);
  const id = await giaoDich(async (kn) => {
    const [kq] = await kn.execute("INSERT INTO bai_tap (tieu_de, chuong, muc, de_bai, nguoi_tao) VALUES (?, ?, ?, ?, ?)", [b.tieuDe, b.chuong, b.muc, b.deBai, user.id]);
    for (const [k, t] of b.tests.entries())
      await kn.execute("INSERT INTO bo_test (bai_tap_id, thu_tu, input, output) VALUES (?, ?, ?, ?)", [kq.insertId, k + 1, t.input, t.output]);
    return kq.insertId;
  });
  return { id };
});

api("PUT", "/api/quan-ly/bai-tap/:id", QUAN_LY, async ({ body, user, id }) => {
  await baiDuocSua(id, user);
  const b = kiemTraBaiTap(body);
  await giaoDich(async (kn) => {
    await kn.execute("UPDATE bai_tap SET tieu_de = ?, chuong = ?, muc = ?, de_bai = ? WHERE id = ?", [b.tieuDe, b.chuong, b.muc, b.deBai, id]);
    await kn.execute("DELETE FROM bo_test WHERE bai_tap_id = ?", [id]);
    for (const [k, t] of b.tests.entries())
      await kn.execute("INSERT INTO bo_test (bai_tap_id, thu_tu, input, output) VALUES (?, ?, ?, ?)", [id, k + 1, t.input, t.output]);
  });
});

api("DELETE", "/api/quan-ly/bai-tap/:id", QUAN_LY, async ({ user, id }) => {
  await baiDuocSua(id, user);
  await truyVan("DELETE FROM bai_tap WHERE id = ?", [id]); // bộ test + giao bài tự xóa theo (ON DELETE CASCADE)
});

api("GET", "/api/quan-ly/giao-bai", QUAN_LY, async () => {
  const hang = await truyVan("SELECT bai_tap_id, phan FROM giao_bai ORDER BY bai_tap_id");
  return { kiemTra: hang.filter((h) => h.phan === "kiemtra").map((h) => h.bai_tap_id), thi: hang.filter((h) => h.phan === "thi").map((h) => h.bai_tap_id) };
});

api("PUT", "/api/quan-ly/giao-bai", QUAN_LY, async ({ body }) => {
  const kiemTra = [...new Set((body.kiemTra || []).map(Number))], thi = [...new Set((body.thi || []).map(Number))];
  if (!kiemTra.length) loi(400, "Phần Kiểm tra cần ít nhất 1 bài.");
  if (thi.length < 2) loi(400, "Đề thi cần ít nhất 2 bài.");
  const tatCa = [...new Set([...kiemTra, ...thi])];
  const co = await truyVan(`SELECT id FROM bai_tap WHERE id IN (${tatCa.map(() => "?").join(",")})`, tatCa);
  if (co.length !== tatCa.length) loi(400, "Có bài tập không tồn tại.");
  await giaoDich(async (kn) => {
    await kn.execute("DELETE FROM giao_bai");
    for (const id of kiemTra) await kn.execute("INSERT INTO giao_bai (bai_tap_id, phan) VALUES (?, 'kiemtra')", [id]);
    for (const id of thi) await kn.execute("INSERT INTO giao_bai (bai_tap_id, phan) VALUES (?, 'thi')", [id]);
  });
});

api("GET", "/api/quan-ly/bang-diem", QUAN_LY, async ({ url }) => {
  const dk = [], ts = [];
  const phan = url.searchParams.get("phan"), q = sach(url.searchParams.get("q"));
  if (PHAN.includes(phan)) { dk.push("l.phan = ?"); ts.push(phan); }
  if (q) { dk.push("(t.ho_ten LIKE ? OR t.ma_sv LIKE ? OR t.ten_dang_nhap LIKE ?)"); ts.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  return layLuotNop(dk.join(" AND "), ts);
});

api("GET", "/api/quan-ly/luot-nop/:id", QUAN_LY, async ({ id }) => {
  const [l] = await layLuotNop("l.id = ?", [id], { maNguon: true, gioiHan: 1 });
  if (!l) loi(404, "Không tìm thấy lượt nộp.");
  return l;
});

// ======================================================================
// QUẢN TRỊ (chỉ Admin)
// ======================================================================
api("DELETE", "/api/admin/luot-nop/:id", ["admin"], async ({ id }) => {
  await truyVan("DELETE FROM luot_nop WHERE id = ?", [id]);
});

api("DELETE", "/api/admin/luot-nop", ["admin"], async ({ body }) => {
  if (body.xacNhan !== true) loi(400, "Thiếu xác nhận xóa toàn bộ bảng điểm.");
  await truyVan("DELETE FROM luot_nop");
});

api("GET", "/api/admin/tai-khoan", ["admin"], async ({ url }) => {
  const dk = [], ts = [];
  const vaiTro = url.searchParams.get("vaiTro"), q = sach(url.searchParams.get("q"));
  if (VAI_TRO.includes(vaiTro)) { dk.push("t.vai_tro = ?"); ts.push(vaiTro); }
  if (q) { dk.push("(t.ho_ten LIKE ? OR t.ten_dang_nhap LIKE ? OR t.ma_sv LIKE ?)"); ts.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  const hang = await truyVan(
    `SELECT t.id, t.ten_dang_nhap, t.ho_ten, t.vai_tro, t.ma_sv, t.bi_khoa, t.tao_luc,
            (SELECT COUNT(*) FROM luot_nop l WHERE l.tai_khoan_id = t.id) AS so_luot_nop
       FROM tai_khoan t ${dk.length ? "WHERE " + dk.join(" AND ") : ""}
      ORDER BY FIELD(t.vai_tro, 'admin', 'giao_vien', 'sinh_vien'), t.ho_ten`,
    ts
  );
  return hang.map((h) => ({ id: h.id, tenDangNhap: h.ten_dang_nhap, hoTen: h.ho_ten, vaiTro: h.vai_tro, maSV: h.ma_sv, biKhoa: !!h.bi_khoa, taoLuc: h.tao_luc, soLuotNop: Number(h.so_luot_nop) }));
});

api("POST", "/api/admin/tai-khoan", ["admin"], async ({ body }) => {
  const vaiTro = body.vaiTro, hoTen = sach(body.hoTen);
  if (!VAI_TRO.includes(vaiTro)) loi(400, "Vai trò không hợp lệ.");
  let ten = String(body.tenDangNhap || "").trim(), maSV = null;
  if (vaiTro === "sinh_vien") {
    maSV = String(body.maSV || ten).trim();
    if (!MSSV_HOP_LE.test(maSV)) loi(400, "Mã SV gồm 4–20 chữ hoặc số.");
    ten = maSV; // sinh viên đăng nhập bằng MSSV
  } else if (!TEN_DN_HOP_LE.test(ten)) loi(400, "Tên đăng nhập gồm 3–50 chữ, số, dấu chấm hoặc gạch dưới.");
  if (hoTen.length < 2 || hoTen.length > 100) loi(400, "Nhập họ và tên.");
  kiemTraMatKhauMoi(body.matKhau);
  const kq = await truyVan("INSERT INTO tai_khoan (ten_dang_nhap, mat_khau, ho_ten, vai_tro, ma_sv) VALUES (?, ?, ?, ?, ?)",
    [ten, await maHoaMatKhau(body.matKhau), hoTen, vaiTro, maSV]);
  return { id: kq.insertId };
});

// Không để hệ thống mất hết admin: luôn còn ít nhất 1 admin chưa bị khóa
async function conAdminKhac(id) {
  const [h] = await truyVan("SELECT COUNT(*) AS n FROM tai_khoan WHERE vai_tro = 'admin' AND bi_khoa = 0 AND id <> ?", [id]);
  return Number(h.n) > 0;
}

api("PUT", "/api/admin/tai-khoan/:id", ["admin"], async ({ body, user, id }) => {
  const [tk] = await truyVan("SELECT id, vai_tro FROM tai_khoan WHERE id = ?", [id]);
  if (!tk) loi(404, "Không tìm thấy tài khoản.");
  const doi = [], ts = [];
  if (body.hoTen !== undefined) {
    const hoTen = sach(body.hoTen);
    if (hoTen.length < 2 || hoTen.length > 100) loi(400, "Nhập họ và tên.");
    doi.push("ho_ten = ?"); ts.push(hoTen);
  }
  if (body.biKhoa !== undefined) {
    if (id === user.id && body.biKhoa) loi(400, "Không thể tự khóa tài khoản của mình.");
    if (body.biKhoa && tk.vai_tro === "admin" && !(await conAdminKhac(id))) loi(400, "Phải còn ít nhất một quản trị viên hoạt động.");
    doi.push("bi_khoa = ?"); ts.push(body.biKhoa ? 1 : 0);
  }
  if (body.matKhauMoi !== undefined) {
    kiemTraMatKhauMoi(body.matKhauMoi);
    doi.push("mat_khau = ?"); ts.push(await maHoaMatKhau(body.matKhauMoi));
  }
  if (!doi.length) loi(400, "Không có gì để cập nhật.");
  await truyVan(`UPDATE tai_khoan SET ${doi.join(", ")} WHERE id = ?`, [...ts, id]);
  // Bị khóa hoặc bị đặt lại mật khẩu → đăng xuất khỏi mọi máy
  if (body.biKhoa || body.matKhauMoi !== undefined) await truyVan("DELETE FROM phien_dang_nhap WHERE tai_khoan_id = ? AND tai_khoan_id <> ?", [id, user.id]);
});

api("DELETE", "/api/admin/tai-khoan/:id", ["admin"], async ({ user, id }) => {
  if (id === user.id) loi(400, "Không thể tự xóa tài khoản của mình.");
  const [tk] = await truyVan("SELECT vai_tro FROM tai_khoan WHERE id = ?", [id]);
  if (!tk) loi(404, "Không tìm thấy tài khoản.");
  if (tk.vai_tro === "admin" && !(await conAdminKhac(id))) loi(400, "Phải còn ít nhất một quản trị viên hoạt động.");
  await truyVan("DELETE FROM tai_khoan WHERE id = ?", [id]); // lượt nộp + phiên tự xóa theo (CASCADE)
});

api("GET", "/api/admin/thong-ke", ["admin"], async () => {
  const [tk] = await truyVan(
    `SELECT SUM(vai_tro = 'admin') AS admin, SUM(vai_tro = 'giao_vien') AS giao_vien, SUM(vai_tro = 'sinh_vien') AS sinh_vien, SUM(bi_khoa) AS bi_khoa FROM tai_khoan`
  );
  const [bt] = await truyVan(`SELECT COUNT(*) AS tong, SUM(muc = 'de') AS de, SUM(muc = 'tb') AS tb, SUM(muc = 'kho') AS kho FROM bai_tap`);
  const [ln] = await truyVan(
    `SELECT COUNT(*) AS tong, SUM(DATE(nop_luc) = CURDATE()) AS hom_nay,
            AVG(CASE WHEN phan = 'kiemtra' THEN diem END) AS tb_kiem_tra, AVG(CASE WHEN phan = 'thi' THEN diem END) AS tb_thi,
            SUM(phan = 'kiemtra') AS so_kiem_tra, SUM(phan = 'thi') AS so_thi
       FROM luot_nop`
  );
  const baiKho = await truyVan(
    `SELECT tieu_de, COUNT(*) AS so_lan, AVG(diem / toi_da * 10) AS diem_tb
       FROM ket_qua_bai GROUP BY bai_tap_id, tieu_de ORDER BY diem_tb ASC, so_lan DESC LIMIT 5`
  );
  const theoNgay = await truyVan(
    `SELECT DATE(nop_luc) AS ngay, COUNT(*) AS so_luot FROM luot_nop
      WHERE nop_luc >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) GROUP BY DATE(nop_luc) ORDER BY ngay`
  );
  const n = (v) => Number(v || 0);
  const tb = (v) => (v == null ? null : Math.round(Number(v) * 100) / 100);
  return {
    taiKhoan: { admin: n(tk.admin), giaoVien: n(tk.giao_vien), sinhVien: n(tk.sinh_vien), biKhoa: n(tk.bi_khoa) },
    baiTap: { tong: n(bt.tong), de: n(bt.de), tb: n(bt.tb), kho: n(bt.kho) },
    luotNop: { tong: n(ln.tong), homNay: n(ln.hom_nay), kiemTra: n(ln.so_kiem_tra), thi: n(ln.so_thi) },
    diemTB: { kiemTra: tb(ln.tb_kiem_tra), thi: tb(ln.tb_thi) },
    baiDiemThapNhat: baiKho.map((b) => ({ tieuDe: b.tieu_de, soLan: n(b.so_lan), diemTB: tb(b.diem_tb) })),
    nopTheoNgay: theoNgay.map((d) => ({ ngay: String(d.ngay).slice(0, 10), soLuot: n(d.so_luot) })),
  };
});

// ======================================================================
// Bộ xử lý chung: tìm API, kiểm tra đăng nhập + vai trò, đọc JSON, trả kết quả
// ======================================================================
function gui(res, status, data) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(data));
}

async function docBody(req) {
  let raw = "";
  for await (const phan of req) {
    raw += phan;
    if (raw.length > 300000) loi(413, "Dữ liệu gửi lên quá lớn.");
  }
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { loi(400, "Dữ liệu gửi lên không phải JSON."); }
}

export async function xuLyApi(req, res, url) {
  const khop = DS_API.filter((a) => a.re.test(url.pathname));
  const a = khop.find((x) => x.method === req.method);
  if (!a) return gui(res, khop.length ? 405 : 404, { loi: khop.length ? "Phương thức không được hỗ trợ." : "Không có API này." });
  try {
    const id = Number(url.pathname.match(a.re)[1]) || undefined;
    let user = null;
    if (a.vaiTro) {
      user = await nguoiDung(req);
      if (!user) loi(401, "Bạn cần đăng nhập.");
      if (Array.isArray(a.vaiTro) && !a.vaiTro.includes(user.vai_tro)) loi(403, "Bạn không có quyền dùng chức năng này.");
    }
    const body = req.method === "GET" ? {} : await docBody(req);
    const kq = await a.xuLy({ req, res, url, body, user, id });
    gui(res, 200, kq ?? { ok: true });
  } catch (e) {
    if (e instanceof LoiApi) return gui(res, e.status, { loi: e.message });
    if (e.code === "ER_DUP_ENTRY") return gui(res, 409, { loi: "Tên đăng nhập hoặc mã SV đã tồn tại." });
    if (["ECONNREFUSED", "ER_BAD_DB_ERROR", "ER_NO_SUCH_TABLE", "ER_ACCESS_DENIED_ERROR"].includes(e.code))
      return gui(res, 503, { loi: "Chưa kết nối được MySQL. Hãy Start MySQL trong XAMPP rồi chạy: npm run khoi-tao" });
    console.error(e);
    gui(res, 500, { loi: "Lỗi máy chủ." });
  }
}
