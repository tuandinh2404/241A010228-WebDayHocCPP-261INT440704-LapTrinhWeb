// thuc-hanh.js — Phòng thực hành: phân quyền GV/SV, Tạo bài tập, Kiểm tra, Thi, Chấm điểm trực tiếp.
//
// Dữ liệu lưu trong trình duyệt:
//   localStorage  cpp_nganHang  : danh sách bài tập (lần đầu lấy từ js/data/ngan-hang.js)
//                 cpp_giao      : { kiemTra: [id], thi: [id] } — bài GV giao cho 2 phần
//                 cpp_ketQua    : các lần nộp bài (bảng điểm)
//   sessionStorage cpp_gv       : "1" khi đã đăng nhập Giáo viên (mất khi đóng tab)
//                 cpp_sv        : { hoTen, maSV } của sinh viên đang làm bài
//                 cpp_nhap_<id> : code đang viết dở của từng bài

const MA_GIAO_VIEN = "GV2026";   // mã để vào quyền Giáo viên — đổi ở đây
const SO_TEST = 5;               // số bộ test mỗi bài
const THI_IT_NHAT = 2, THI_NHIEU_NHAT = 3; // phần Thi: chọn 2–3 bài
const API_CHAM = "/api/judge";   // máy chấm trong server.mjs

// Mức của ngân hàng bài tập phòng thực hành (3 mức, khác 4 mức ở phần Lý thuyết)
const MUC_TH = {
  de: { ten: "Dễ", lop: "lv1" },
  tb: { ten: "Trung bình", lop: "lv2" },
  kho: { ten: "Khó", lop: "lv4" },
};
const TAB = [
  { hash: "tao-bai", ten: "Tạo bài tập", gv: true },
  { hash: "kiem-tra", ten: "Kiểm tra" },
  { hash: "thi", ten: "Thi" },
  { hash: "cham-diem", ten: "Chấm điểm trực tiếp", gv: true },
];
const CODE_MAU = `#include <iostream>
using namespace std;

int main() {
    // Viết code của bạn ở đây: đọc bằng cin, in bằng cout

    return 0;
}
`;

// ---------- Lưu trữ (bọc try/catch vì trình duyệt có thể chặn storage) ----------
function taoKho(store) {
  return {
    doc(k, macDinh) { try { const v = store.getItem(k); return v == null ? macDinh : JSON.parse(v); } catch { return macDinh; } },
    ghi(k, v) { try { store.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
    xoa(k) { try { store.removeItem(k); } catch {} },
  };
}
const kho = taoKho(window.localStorage);
const phien = taoKho(window.sessionStorage);
const saoChep = (x) => JSON.parse(JSON.stringify(x));

const layNganHang = () => kho.doc("cpp_nganHang", null) || saoChep(window.NGAN_HANG_MAU || []);
const luuNganHang = (ds) => kho.ghi("cpp_nganHang", ds);
function layGiao() {
  const g = kho.doc("cpp_giao", null) || saoChep(window.GIAO_MAU || { kiemTra: [], thi: [] });
  const co = new Set(layNganHang().map((b) => b.id)); // bỏ id của bài đã bị xóa
  return { kiemTra: g.kiemTra.filter((id) => co.has(id)), thi: g.thi.filter((id) => co.has(id)) };
}
const laGV = () => phien.doc("cpp_gv", false) === true;
const timBai = (id) => layNganHang().find((b) => b.id === id);
const tenChuong = (so) => `Chương ${so}`;
const nhanMuc = (m) => `<span class="lv ${MUC_TH[m]?.lop || ""}">${MUC_TH[m]?.ten || m}</span>`;

// Trạng thái màn hình hiện tại của Kiểm tra / Thi (giữ trong bộ nhớ trang)
const st = {
  kiemtra: { buoc: "chon", chon: [], ketQua: null },
  thi: { buoc: "chon", chon: [], ketQua: null },
  dangSua: null,   // id bài GV đang sửa ở "Tạo bài tập"
  locMuc: "all",
};

// ---------- Thông báo nhỏ góc dưới ----------
let henGioToast;
function bao(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.hidden = false;
  t.classList.add("is-on");
  clearTimeout(henGioToast);
  henGioToast = setTimeout(() => { t.classList.remove("is-on"); setTimeout(() => (t.hidden = true), 300); }, 2400);
}

// ======================================================================
// KHUNG: nút chọn vai trò + thanh menu 4 mục
// ======================================================================
function veVaiTro() {
  const el = document.getElementById("role");
  const gv = laGV();
  el.innerHTML = `
    <div class="role-switch" role="group" aria-label="Vai trò">
      <button type="button" data-vai="sv" aria-pressed="${!gv}">Sinh viên</button>
      <button type="button" data-vai="gv" aria-pressed="${gv}">${gv ? "" : icon("lock")} Giáo viên</button>
    </div>
    <form class="gv-gate" id="gv-gate" hidden>
      <label for="ma-gv">Mã giáo viên</label>
      <div class="gv-gate-row"><input id="ma-gv" type="password" autocomplete="off" required><button class="btn btn-ink" type="submit">Vào</button></div>
      <p class="field-err" id="gv-err" hidden>Mã không đúng.</p>
    </form>`;
  el.querySelector('[data-vai="sv"]').onclick = () => {
    phien.xoa("cpp_gv");
    veVaiTro(); veTabs();
    if (TAB.find((t) => t.hash === hashHienTai())?.gv) location.hash = "kiem-tra"; else veView();
  };
  el.querySelector('[data-vai="gv"]').onclick = () => {
    if (laGV()) return;
    const f = document.getElementById("gv-gate");
    f.hidden = !f.hidden;
    if (!f.hidden) document.getElementById("ma-gv").focus();
  };
  document.getElementById("gv-gate").onsubmit = (e) => {
    e.preventDefault();
    dangNhapGV(document.getElementById("ma-gv").value, document.getElementById("gv-err"));
  };
}

function dangNhapGV(ma, oLoi) {
  if (ma.trim() !== MA_GIAO_VIEN) { oLoi.hidden = false; return; }
  phien.ghi("cpp_gv", true);
  veVaiTro(); veTabs();
  bao("Đã vào quyền Giáo viên");
  if (["kiem-tra", "thi"].includes(hashHienTai())) location.hash = "tao-bai"; else veView();
}

function hashHienTai() {
  const h = location.hash.slice(1);
  return TAB.some((t) => t.hash === h) ? h : laGV() ? "tao-bai" : "kiem-tra";
}

function veTabs() {
  const h = hashHienTai();
  document.getElementById("lab-tabs").innerHTML = TAB.map(
    (t) => `<a href="#${t.hash}" class="${t.hash === h ? "is-on" : ""}"${t.hash === h ? ' aria-current="page"' : ""}>${t.gv && !laGV() ? icon("lock") + " " : ""}${t.ten}</a>`
  ).join("");
}

function veView() {
  veTabs();
  const h = hashHienTai();
  const tab = TAB.find((t) => t.hash === h);
  const lab = document.getElementById("lab");
  if (tab.gv && !laGV()) return veKhoa(lab, tab);
  if (h === "tao-bai") return veTaoBai(lab);
  if (h === "cham-diem") return veChamDiem(lab);
  return veLamBai(lab, h === "thi" ? "thi" : "kiemtra");
}

// Mục chỉ dành cho GV, khi đang ở vai trò SV
function veKhoa(lab, tab) {
  lab.innerHTML = `
    <div class="locked">
      <span class="locked-ic">${icon("lock")}</span>
      <h2 class="display">${tab.ten} dành cho Giáo viên</h2>
      <p>Nhập mã giáo viên để tiếp tục.</p>
      <form class="gv-gate-row" id="gate2"><input type="password" id="ma-gv2" aria-label="Mã giáo viên" placeholder="Mã giáo viên" autocomplete="off" required><button class="btn btn-ink" type="submit">Vào</button></form>
      <p class="field-err" id="gv-err2" hidden>Mã không đúng.</p>
    </div>`;
  document.getElementById("gate2").onsubmit = (e) => {
    e.preventDefault();
    dangNhapGV(document.getElementById("ma-gv2").value, document.getElementById("gv-err2"));
  };
}

// ======================================================================
// KIỂM TRA / THI (sinh viên)
// ======================================================================
const TEN_PHAN = { kiemtra: "Kiểm tra", thi: "Thi" };

function veLamBai(lab, phan) {
  const sv = phien.doc("cpp_sv", null);
  if (!sv) return vePhieu(lab, phan);
  const s = st[phan];
  const dau = `
    <div class="sv-strip">
      <div><b>${escapeHtml(sv.hoTen)}</b><span class="num">${escapeHtml(sv.maSV)}</span><span class="sv-phan">Phần ${TEN_PHAN[phan]}</span></div>
      <button class="link-arrow" type="button" id="doi-sv">Đổi thông tin</button>
    </div>`;
  lab.innerHTML = dau + `<div id="buoc"></div>`;
  const box = document.getElementById("buoc");
  if (s.buoc === "lam") veSoanCode(box, phan);
  else if (s.buoc === "ketqua" && s.ketQua) veKetQua(box, phan);
  else veChonBai(box, phan);
  document.getElementById("doi-sv").onclick = () => { phien.xoa("cpp_sv"); veView(); };
}

// Bước 0 — Phiếu thông tin: Họ tên, Mã SV, chọn Phần
function vePhieu(lab, phan) {
  lab.innerHTML = `
    <form class="slip" id="slip" novalidate>
      <h2 class="display">Thông tin sinh viên</h2>
      <p class="slip-sub">Điền trước khi làm bài. Thông tin này đi kèm điểm trong bảng điểm.</p>
      <div class="field"><label for="ho-ten">Họ và tên</label><input id="ho-ten" name="hoTen" autocomplete="name" required>
        <p class="field-err" hidden>Nhập họ và tên.</p></div>
      <div class="field"><label for="ma-sv">Mã sinh viên</label><input id="ma-sv" name="maSV" autocomplete="off" required inputmode="text">
        <p class="field-err" hidden>Mã SV gồm 4–20 chữ hoặc số.</p></div>
      <fieldset class="field">
        <legend>Chọn phần</legend>
        <div class="part-pick">
          <label><input type="radio" name="phan" value="kiemtra"${phan === "kiemtra" ? " checked" : ""}><span><b>Kiểm tra</b><small>Chọn 1 bài</small></span></label>
          <label><input type="radio" name="phan" value="thi"${phan === "thi" ? " checked" : ""}><span><b>Thi</b><small>Chọn ${THI_IT_NHAT} đến ${THI_NHIEU_NHAT} bài</small></span></label>
        </div>
      </fieldset>
      <button class="btn btn-primary" type="submit">Vào làm bài ${icon("arrow-right")}</button>
    </form>`;
  const f = document.getElementById("slip");
  f.onsubmit = (e) => {
    e.preventDefault();
    const hoTen = f.hoTen.value.trim().replace(/\s+/g, " ");
    const maSV = f.maSV.value.trim();
    const ok1 = hoTen.length >= 2, ok2 = /^[A-Za-z0-9]{4,20}$/.test(maSV);
    f.hoTen.closest(".field").querySelector(".field-err").hidden = ok1;
    f.maSV.closest(".field").querySelector(".field-err").hidden = ok2;
    f.hoTen.setAttribute("aria-invalid", String(!ok1));
    f.maSV.setAttribute("aria-invalid", String(!ok2));
    if (!ok1 || !ok2) return (ok1 ? f.maSV : f.hoTen).focus();
    phien.ghi("cpp_sv", { hoTen, maSV });
    const chon = f.phan.value === "thi" ? "thi" : "kiem-tra";
    if (hashHienTai() === chon) veView(); else location.hash = chon;
  };
}

// Bước 1 — Chọn bài từ danh sách GV đã giao
function veChonBai(box, phan) {
  const s = st[phan];
  const ds = layGiao()[phan === "thi" ? "thi" : "kiemTra"].map(timBai).filter(Boolean);
  const nhieu = phan === "thi";
  if (!ds.length) {
    box.innerHTML = `<div class="empty"><p>Giáo viên chưa giao bài nào cho phần ${TEN_PHAN[phan]}.</p></div>`;
    return;
  }
  s.chon = s.chon.filter((id) => ds.some((b) => b.id === id));
  box.innerHTML = `
    <div class="pick-head">
      <h2 class="display">${nhieu ? `Chọn ${THI_IT_NHAT}–${THI_NHIEU_NHAT} bài thi` : "Chọn 1 bài kiểm tra"}</h2>
      <p id="pick-count" class="num"></p>
    </div>
    <ul class="pick-list">
      ${ds.map((b) => `
        <li><label class="pick ${MUC_TH[b.muc]?.lop || ""}">
          <input type="${nhieu ? "checkbox" : "radio"}" name="bai" value="${b.id}"${s.chon.includes(b.id) ? " checked" : ""}>
          <span class="pick-main"><b>${escapeHtml(b.tieuDe)}</b><small>${inline(catNgan(b.deBai, 140))}</small></span>
          <span class="pick-meta">${nhanMuc(b.muc)}<small>${tenChuong(b.chuong)}</small></span>
        </label></li>`).join("")}
    </ul>
    <div class="actions"><button class="btn btn-primary" type="button" id="bat-dau">Bắt đầu làm bài ${icon("arrow-right")}</button></div>`;
  const nut = document.getElementById("bat-dau");
  const capNhat = () => {
    s.chon = [...box.querySelectorAll("input[name=bai]:checked")].map((i) => i.value);
    const n = s.chon.length;
    const hopLe = nhieu ? n >= THI_IT_NHAT && n <= THI_NHIEU_NHAT : n === 1;
    nut.disabled = !hopLe;
    document.getElementById("pick-count").textContent = nhieu ? `Đã chọn ${n}/${THI_NHIEU_NHAT}` : n ? "Đã chọn 1 bài" : "Chưa chọn bài";
    // Thi: đủ 3 bài thì khóa các ô còn lại
    if (nhieu) box.querySelectorAll("input[name=bai]").forEach((i) => (i.disabled = !i.checked && n >= THI_NHIEU_NHAT));
  };
  box.querySelectorAll("input[name=bai]").forEach((i) => (i.onchange = capNhat));
  capNhat();
  nut.onclick = () => { s.buoc = "lam"; s.ketQua = null; veView(); cuonToiLab(); };
}
// Cuộn tới đầu khu làm bài (ngay dưới thanh menu đang dính), thay vì lên tận đầu trang
function cuonToiLab() {
  const tabs = document.querySelector(".ch-tabs").offsetHeight;
  const hdr = document.getElementById("site-header").offsetHeight;
  const y = document.getElementById("lab").getBoundingClientRect().top + window.scrollY - hdr - tabs;
  window.scrollTo({ top: Math.max(0, y) });
}
const catNgan = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);

// Khung soạn code: CodeMirror nếu tải được, không thì textarea thường
function taoEditor(el, giaTri, khiDoi) {
  if (window.CodeMirror) {
    const cm = CodeMirror(el, {
      value: giaTri, mode: "text/x-c++src", lineNumbers: true, indentUnit: 4, tabSize: 4,
      matchBrackets: true, autoCloseBrackets: true, lineWrapping: false,
      extraKeys: { Tab: (c) => (c.somethingSelected() ? c.indentSelection("add") : c.replaceSelection("    ")) },
    });
    cm.on("change", () => khiDoi(cm.getValue()));
    return { lay: () => cm.getValue(), lamMoi: () => cm.refresh() };
  }
  const ta = document.createElement("textarea");
  ta.className = "code-fallback";
  ta.value = giaTri;
  ta.spellcheck = false;
  ta.oninput = () => khiDoi(ta.value);
  ta.onkeydown = (e) => { if (e.key === "Tab") { e.preventDefault(); ta.setRangeText("    ", ta.selectionStart, ta.selectionEnd, "end"); } };
  el.appendChild(ta);
  return { lay: () => ta.value, lamMoi: () => {} };
}

// Bước 2 — Soạn code cho bài đã chọn (Thi: mỗi bài một tab)
function veSoanCode(box, phan) {
  const s = st[phan];
  const ds = s.chon.map(timBai).filter(Boolean);
  if (!ds.length) { s.buoc = "chon"; return veView(); }
  box.innerHTML = `
    ${ds.length > 1 ? `<div class="bai-tabs" role="tablist">${ds.map((b, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}">Bài ${i + 1}</button>`).join("")}</div>` : ""}
    ${ds.map((b, i) => `
      <section class="work" data-panel="${i}"${i ? " hidden" : ""}>
        <div class="problem">
          <div class="problem-head"><h2>${ds.length > 1 ? `Bài ${i + 1}. ` : ""}${escapeHtml(b.tieuDe)}</h2>${nhanMuc(b.muc)}</div>
          <p class="problem-meta">${tenChuong(b.chuong)} · ${b.tests.length} bộ test · ${b.tests.length * 2} điểm</p>
          <p>${inline(b.deBai)}</p>
          <div class="io"><div><span>Input ví dụ</span><pre>${escapeHtml(b.tests[0].input)}</pre></div><div><span>Output ví dụ</span><pre>${escapeHtml(b.tests[0].output)}</pre></div></div>
          <p class="problem-note">Ví dụ chính là Test 1. ${b.tests.length - 1} bộ test còn lại được giữ kín. Đọc dữ liệu bằng <code>cin</code>, in kết quả bằng <code>cout</code>, <code>main</code> trả về 0.</p>
        </div>
        <div class="editor"><div class="editor-bar"><b>main.cpp</b><button type="button" class="link-arrow reset-code" data-id="${b.id}">Viết lại từ đầu</button></div><div class="editor-host" data-id="${b.id}"></div></div>
      </section>`).join("")}
    <div class="submit-bar">
      <p id="submit-msg" class="submit-msg">${ds.length > 1 ? `Nộp một lần cho cả ${ds.length} bài. ` : ""}Sau khi nộp, hệ thống chạy code và cho điểm ngay.</p>
      <div class="submit-actions">
        <button type="button" class="link-arrow" id="doi-bai">${icon("arrow-left")} Chọn bài khác</button>
        <button type="button" class="btn btn-primary" id="nop">${phan === "thi" ? "Nộp bài thi" : "Nộp bài"} ${icon("arrow-right")}</button>
      </div>
    </div>`;

  const editors = {};
  box.querySelectorAll(".editor-host").forEach((host) => {
    const id = host.dataset.id;
    editors[id] = taoEditor(host, phien.doc("cpp_nhap_" + id, CODE_MAU), (v) => phien.ghi("cpp_nhap_" + id, v));
  });
  box.querySelectorAll(".reset-code").forEach((btn) => (btn.onclick = () => {
    phien.xoa("cpp_nhap_" + btn.dataset.id);
    veSoanCode(box, phan);
  }));
  box.querySelectorAll(".bai-tabs button").forEach((tb) => (tb.onclick = () => {
    box.querySelectorAll(".bai-tabs button").forEach((x) => x.setAttribute("aria-selected", String(x === tb)));
    box.querySelectorAll(".work").forEach((p) => (p.hidden = p.dataset.panel !== tb.dataset.i));
    Object.values(editors).forEach((e) => e.lamMoi()); // CodeMirror cần vẽ lại khi vừa hiện ra
  }));
  document.getElementById("doi-bai").onclick = () => { s.buoc = "chon"; veView(); };
  document.getElementById("nop").onclick = () => nopBai(phan, ds, editors);
}

// Gửi code từng bài tới máy chấm
async function nopBai(phan, ds, editors) {
  const nut = document.getElementById("nop");
  const msg = document.getElementById("submit-msg");
  nut.disabled = true;
  document.getElementById("doi-bai").disabled = true;
  const ketQua = [];
  for (let i = 0; i < ds.length; i++) {
    const b = ds[i];
    nut.innerHTML = `<span class="spinner" aria-hidden="true"></span> Đang chấm${ds.length > 1 ? ` bài ${i + 1}/${ds.length}` : ""}…`;
    let kq;
    try {
      const res = await fetch(API_CHAM, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: editors[b.id].lay(), tests: b.tests.map((t) => ({ input: t.input, output: t.output })) }),
      });
      kq = await res.json().catch(() => ({ loi: `Máy chấm trả lỗi ${res.status}.` }));
      if (!res.ok && !kq.loi) kq.loi = `Máy chấm trả lỗi ${res.status}.`;
    } catch {
      kq = { loi: location.protocol === "file:" ? "Trang đang mở trực tiếp từ file nên không gọi được máy chấm. Hãy chạy: node server.mjs rồi mở http://localhost:8080" : "Không kết nối được máy chấm. Kiểm tra mạng rồi nộp lại." };
    }
    // Lỗi phía máy chấm (không phải lỗi code của SV) → dừng, cho nộp lại, không ghi điểm
    if (kq.loi && kq.tests === undefined) {
      msg.innerHTML = `<span class="err-text">${escapeHtml(kq.loi)}</span>`;
      nut.disabled = false;
      document.getElementById("doi-bai").disabled = false;
      nut.innerHTML = `Nộp lại ${icon("arrow-right")}`;
      return;
    }
    ketQua.push({ bai: b, kq });
  }
  const tong = ketQua.reduce((t, x) => t + (x.kq.diem / x.kq.toiDa) * 10, 0) / ketQua.length; // thang 10
  const sv = phien.doc("cpp_sv", {});
  const bang = kho.doc("cpp_ketQua", []);
  bang.push({
    luc: new Date().toISOString(), hoTen: sv.hoTen, maSV: sv.maSV, phan,
    bai: ketQua.map((x) => ({ id: x.bai.id, tieuDe: x.bai.tieuDe, diem: x.kq.diem, toiDa: x.kq.toiDa })),
    diem: Math.round(tong * 100) / 100,
  });
  kho.ghi("cpp_ketQua", bang);
  st[phan].ketQua = { ds: ketQua, tong };
  st[phan].buoc = "ketqua";
  veView();
  cuonToiLab();
}

// Bước 3 — Kết quả
const NHAN_TT = { OK: "Đúng", WA: "Sai kết quả", TLE: "Quá thời gian", RTE: "Lỗi khi chạy" };
function veKetQua(box, phan) {
  const { ds, tong } = st[phan].ketQua;
  const diemTong = Number.isInteger(tong) ? String(tong) : tong.toFixed(2);
  box.innerHTML = `
    <div class="score-hero">
      <div><p class="score-label">${phan === "thi" ? `Điểm thi (trung bình ${ds.length} bài)` : "Điểm kiểm tra"}</p>
        <p class="score-big num">${diemTong}<span>/10</span></p></div>
      <div class="score-actions">
        <button class="btn btn-primary" type="button" id="lam-lai">Sửa code, nộp lại</button>
        <button class="link-arrow" type="button" id="bai-khac">Chọn bài khác ${icon("arrow-right")}</button>
      </div>
    </div>
    ${ds.map(({ bai, kq }, i) => `
      <article class="kq-bai">
        <header class="kq-head"><h3>${ds.length > 1 ? `Bài ${i + 1}. ` : ""}${escapeHtml(bai.tieuDe)}</h3>${nhanMuc(bai.muc)}<b class="kq-diem num">${kq.diem}<small>/${kq.toiDa}</small></b></header>
        ${kq.bienDich ? `<div class="kq-loi"><b>Lỗi biên dịch</b><p>Code chưa biên dịch được nên chưa chạy test nào. Sửa lỗi dưới đây rồi nộp lại.</p><pre>${escapeHtml(kq.bienDich)}</pre></div>` : ""}
        ${kq.loi ? `<div class="kq-loi"><b>Chưa chấm được</b><p>${escapeHtml(kq.loi)}</p></div>` : ""}
        ${kq.tests.length ? `<ol class="kq-tests">${kq.tests.map((t, k) => `
          <li class="kq-test ${t.dung ? "pass" : "fail"}">
            <span class="kq-t">Test ${k + 1}</span>
            <span class="kq-s">${icon(t.dung ? "check" : "x")} ${NHAN_TT[t.trangThai] || t.trangThai}</span>
            <span class="kq-p num">${t.dung ? "+2" : "0"}</span>
          </li>`).join("")}</ol>` : ""}
        ${chiTietTest1(bai, kq)}
        ${kq.tests.filter((t) => t.trangThai === "RTE").slice(0, 1).map((t) => `<p class="kq-rte"><b>Lỗi khi chạy:</b> <code>${escapeHtml(t.loi)}</code></p>`).join("")}
      </article>`).join("")}`;
  document.getElementById("lam-lai").onclick = () => { st[phan].buoc = "lam"; veView(); };
  document.getElementById("bai-khac").onclick = () => { st[phan].buoc = "chon"; st[phan].chon = []; veView(); };
}
// Test 1 là ví dụ công khai → nếu sai thì cho xem output để SV tự so sánh
function chiTietTest1(bai, kq) {
  const t = kq.tests[0];
  if (!t || t.dung || t.trangThai === "TLE") return "";
  return `<div class="kq-diff">
    <div><span>Input (Test 1)</span><pre>${escapeHtml(bai.tests[0].input)}</pre></div>
    <div><span>Output mong đợi</span><pre>${escapeHtml(bai.tests[0].output)}</pre></div>
    <div><span>Bạn in ra</span><pre>${escapeHtml(t.output) || "<i>(không in gì)</i>"}</pre></div>
  </div>`;
}

// ======================================================================
// TẠO BÀI TẬP (giáo viên): soạn đề + 5 bộ test, quản lý ngân hàng bài
// ======================================================================
function veTaoBai(lab) {
  const ds = layNganHang();
  const sua = st.dangSua ? ds.find((b) => b.id === st.dangSua) : null;
  const b = sua || { tieuDe: "", chuong: 1, muc: "de", deBai: "", tests: Array.from({ length: SO_TEST }, () => ({ input: "", output: "" })) };
  const loc = st.locMuc;
  const hien = ds.filter((x) => loc === "all" || x.muc === loc);

  lab.innerHTML = `
  <div class="maker">
    <form class="maker-form" id="maker" novalidate>
      <h2 class="display">${sua ? "Sửa bài tập" : "Tạo bài tập mới"}</h2>
      <div class="field"><label for="f-td">Tên bài</label><input id="f-td" name="tieuDe" value="${escapeHtml(b.tieuDe)}" required maxlength="120">
        <p class="field-err" hidden>Nhập tên bài.</p></div>
      <div class="field-row">
        <div class="field"><label for="f-ch">Chương</label>
          <select id="f-ch" name="chuong">${DS_CHUONG.map((c) => `<option value="${c.so}"${c.so === b.chuong ? " selected" : ""}>${c.so}. ${escapeHtml(c.ten)}</option>`).join("")}</select></div>
        <fieldset class="field"><legend>Mức độ</legend><div class="seg">
          ${Object.entries(MUC_TH).map(([k, m]) => `<label><input type="radio" name="muc" value="${k}"${b.muc === k ? " checked" : ""}><span class="lv ${m.lop}">${m.ten}</span></label>`).join("")}
        </div></fieldset>
      </div>
      <div class="field"><label for="f-db">Đề bài</label><textarea id="f-db" name="deBai" rows="5" required>${escapeHtml(b.deBai)}</textarea>
        <p class="field-hint">Ghi rõ định dạng input và output. Viết <code>\`code\`</code> để hiện chữ dạng code.</p>
        <p class="field-err" hidden>Nhập đề bài.</p></div>
      <fieldset class="field tests-field"><legend>Bộ test <span class="num">(${SO_TEST} bộ × 2 điểm)</span></legend>
        ${b.tests.map((t, i) => `
          <div class="test-pair">
            <span class="test-no num">${i + 1}</span>
            <label><span>Input</span><textarea name="in${i}" rows="2" spellcheck="false">${escapeHtml(t.input)}</textarea></label>
            <label><span>Output đúng</span><textarea name="out${i}" rows="2" spellcheck="false">${escapeHtml(t.output)}</textarea></label>
          </div>`).join("")}
        <p class="field-err" id="err-tests" hidden>Mỗi bộ test cần có output đúng.</p>
      </fieldset>
      <div class="actions">
        <button class="btn btn-primary" type="submit">${sua ? "Lưu thay đổi" : "Lưu bài tập"}</button>
        ${sua ? `<button class="link-arrow" type="button" id="huy-sua">Hủy sửa</button>` : ""}
      </div>
    </form>

    <aside class="bank">
      <div class="bank-head"><h2 class="display">Ngân hàng bài tập</h2><span class="num">${ds.length} bài</span></div>
      <div class="filters" role="group" aria-label="Lọc theo mức">
        <button class="chip" type="button" data-loc="all" aria-pressed="${loc === "all"}">Tất cả</button>
        ${Object.entries(MUC_TH).map(([k, m]) => `<button class="chip" type="button" data-loc="${k}" aria-pressed="${loc === k}"><span class="lv ${m.lop}">${m.ten}</span><span class="count">${ds.filter((x) => x.muc === k).length}</span></button>`).join("")}
      </div>
      <ul class="bank-list">
        ${hien.length ? hien.map((x) => `
          <li class="bank-item${x.id === st.dangSua ? " is-editing" : ""}">
            <div><b>${escapeHtml(x.tieuDe)}</b><small>${nhanMuc(x.muc)} · ${tenChuong(x.chuong)}</small></div>
            <div class="bank-act">
              <button type="button" class="txt-btn" data-sua="${x.id}">Sửa</button>
              <button type="button" class="txt-btn danger" data-xoa="${x.id}">Xóa</button>
            </div>
          </li>`).join("") : `<li class="bank-empty">Chưa có bài ở mức này.</li>`}
      </ul>
      <div class="bank-tools">
        <button type="button" class="txt-btn" id="xuat">Xuất JSON</button>
        <label class="txt-btn">Nhập JSON<input type="file" id="nhap" accept=".json,application/json" hidden></label>
        <button type="button" class="txt-btn" id="khoi-phuc">Khôi phục bài mẫu</button>
      </div>
      <p class="bank-note">Ngân hàng lưu trong trình duyệt này. Dùng Xuất / Nhập JSON để chuyển sang máy khác.</p>
    </aside>
  </div>`;

  const f = document.getElementById("maker");
  f.onsubmit = (e) => {
    e.preventDefault();
    const tieuDe = f.tieuDe.value.trim(), deBai = f.deBai.value.trim();
    const tests = Array.from({ length: SO_TEST }, (_, i) => ({ input: f["in" + i].value, output: f["out" + i].value.replace(/\s+$/, "") }));
    const ok1 = !!tieuDe, ok2 = !!deBai, ok3 = tests.every((t) => t.output.trim() !== "");
    f.tieuDe.closest(".field").querySelector(".field-err").hidden = ok1;
    f.deBai.closest(".field").querySelector(".field-err").hidden = ok2;
    document.getElementById("err-tests").hidden = ok3;
    if (!ok1 || !ok2 || !ok3) return;
    const moi = { id: sua ? sua.id : "gv-" + Date.now().toString(36), tieuDe, chuong: Number(f.chuong.value), muc: f.muc.value, deBai, tests };
    const ds2 = layNganHang();
    const i = ds2.findIndex((x) => x.id === moi.id);
    if (i >= 0) ds2[i] = moi; else ds2.unshift(moi);
    luuNganHang(ds2);
    st.dangSua = null;
    bao(sua ? "Đã lưu thay đổi" : `Đã thêm "${tieuDe}" vào ngân hàng`);
    veTaoBai(lab);
  };
  document.getElementById("huy-sua")?.addEventListener("click", () => { st.dangSua = null; veTaoBai(lab); });
  lab.querySelectorAll("[data-loc]").forEach((c) => (c.onclick = () => { st.locMuc = c.dataset.loc; veTaoBai(lab); }));
  lab.querySelectorAll("[data-sua]").forEach((btn) => (btn.onclick = () => { st.dangSua = btn.dataset.sua; veTaoBai(lab); f.scrollIntoView({ behavior: "smooth" }); }));
  lab.querySelectorAll("[data-xoa]").forEach((btn) => (btn.onclick = () => xacNhan(btn, "Xóa?", () => {
    luuNganHang(layNganHang().filter((x) => x.id !== btn.dataset.xoa));
    const g = layGiao(); kho.ghi("cpp_giao", g); // layGiao() đã tự bỏ id vừa xóa
    if (st.dangSua === btn.dataset.xoa) st.dangSua = null;
    bao("Đã xóa bài tập");
    veTaoBai(lab);
  })));
  document.getElementById("xuat").onclick = () => taiFile("ngan-hang-bai-tap.json", JSON.stringify(layNganHang(), null, 2), "application/json");
  document.getElementById("nhap").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const them = JSON.parse(await file.text());
      if (!Array.isArray(them) || !them.every(hopLeBai)) throw new Error();
      const ds2 = layNganHang();
      for (const x of them) { const i = ds2.findIndex((y) => y.id === x.id); if (i >= 0) ds2[i] = x; else ds2.push(x); }
      luuNganHang(ds2);
      bao(`Đã nhập ${them.length} bài`);
      veTaoBai(lab);
    } catch { bao("File JSON không đúng định dạng ngân hàng bài tập"); }
  };
  document.getElementById("khoi-phuc").onclick = (e) => xacNhan(e.currentTarget, "Thay toàn bộ bằng bài mẫu?", () => {
    kho.xoa("cpp_nganHang"); kho.xoa("cpp_giao"); st.dangSua = null;
    bao("Đã khôi phục bài mẫu");
    veTaoBai(lab);
  });
}
const hopLeBai = (x) => x && typeof x.id === "string" && typeof x.tieuDe === "string" && typeof x.deBai === "string" &&
  MUC_TH[x.muc] && x.chuong >= 1 && x.chuong <= 6 && Array.isArray(x.tests) && x.tests.length >= 1 &&
  x.tests.every((t) => typeof t.input === "string" && typeof t.output === "string");

// Xác nhận ngay tại chỗ (không dùng hộp thoại): nút đổi thành "Xóa? Có · Không"
function xacNhan(nut, cauHoi, lam) {
  const span = document.createElement("span");
  span.className = "confirm-inline";
  span.innerHTML = `${escapeHtml(cauHoi)} <button type="button" class="txt-btn danger">Có</button><button type="button" class="txt-btn">Không</button>`;
  nut.replaceWith(span);
  const [co, khong] = span.querySelectorAll("button");
  co.focus();
  co.onclick = lam;
  khong.onclick = () => veView(); // vẽ lại là nút cũ trở về
}

function taiFile(ten, noiDung, loai) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([noiDung], { type: loai }));
  a.download = ten;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ======================================================================
// CHẤM ĐIỂM TRỰC TIẾP (giáo viên): giao bài cho 2 phần + bảng điểm
// ======================================================================
function veChamDiem(lab) {
  const ds = layNganHang();
  const g = layGiao();
  const bang = kho.doc("cpp_ketQua", []).slice().reverse(); // mới nhất lên đầu
  const cot = (phan, ten, ghiChu) => `
    <section class="assign-col">
      <div class="assign-head"><h3>${ten}</h3><span class="num" data-dem="${phan}"></span></div>
      <p class="assign-note">${ghiChu}</p>
      <ul class="assign-list">${ds.map((b) => `
        <li><label><input type="checkbox" data-phan="${phan}" value="${b.id}"${g[phan].includes(b.id) ? " checked" : ""}>
          <span><b>${escapeHtml(b.tieuDe)}</b><small>${nhanMuc(b.muc)} · ${tenChuong(b.chuong)}</small></span></label></li>`).join("")}
      </ul>
    </section>`;
  lab.innerHTML = `
    <div class="part-title"><h2 class="display">Giao bài</h2><p>Chọn bài từ ngân hàng cho từng phần</p></div>
    <div class="assign">
      ${cot("kiemTra", "Phần Kiểm tra", "Sinh viên chọn 1 bài trong danh sách này.")}
      ${cot("thi", "Phần Thi (đề thi)", `Sinh viên chọn ${THI_IT_NHAT}–${THI_NHIEU_NHAT} bài. Đề thi cần ít nhất ${THI_IT_NHAT} bài.`)}
    </div>
    <div class="actions"><button class="btn btn-primary" type="button" id="luu-giao">Lưu danh sách giao</button><p class="field-err" id="err-giao" hidden></p></div>

    <div class="part-title score-title"><h2 class="display">Bảng điểm</h2><p class="num">${bang.length} lượt nộp</p></div>
    ${bang.length ? `
      <div class="tbl-wrap"><table class="score-table">
        <thead><tr><th>Thời gian</th><th>Họ tên</th><th>Mã SV</th><th>Phần</th><th>Bài làm</th><th class="r">Điểm</th></tr></thead>
        <tbody>${bang.map((r) => `<tr>
          <td class="num">${new Date(r.luc).toLocaleString("vi-VN")}</td><td>${escapeHtml(r.hoTen)}</td><td class="num">${escapeHtml(r.maSV)}</td>
          <td>${TEN_PHAN[r.phan] || r.phan}</td>
          <td>${r.bai.map((x) => `${escapeHtml(x.tieuDe)} <span class="num muted">${x.diem}/${x.toiDa}</span>`).join("<br>")}</td>
          <td class="r num"><b>${r.diem}</b></td></tr>`).join("")}</tbody>
      </table></div>
      <div class="bank-tools"><button type="button" class="txt-btn" id="xuat-csv">Xuất CSV (Excel)</button><button type="button" class="txt-btn danger" id="xoa-bang">Xóa bảng điểm</button></div>
      <p class="bank-note">Bảng điểm lưu trong trình duyệt này: gồm các lượt nộp trên máy này.</p>`
      : `<div class="empty"><p>Chưa có lượt nộp bài nào trên trình duyệt này.</p></div>`}`;

  const dem = () => ["kiemTra", "thi"].forEach((p) => {
    lab.querySelector(`[data-dem="${p}"]`).textContent = `${lab.querySelectorAll(`input[data-phan="${p}"]:checked`).length} bài`;
  });
  lab.querySelectorAll("input[data-phan]").forEach((i) => (i.onchange = dem));
  dem();
  document.getElementById("luu-giao").onclick = () => {
    const lay = (p) => [...lab.querySelectorAll(`input[data-phan="${p}"]:checked`)].map((i) => i.value);
    const moi = { kiemTra: lay("kiemTra"), thi: lay("thi") };
    const err = document.getElementById("err-giao");
    err.hidden = true;
    if (!moi.kiemTra.length) { err.textContent = "Phần Kiểm tra cần ít nhất 1 bài."; err.hidden = false; return; }
    if (moi.thi.length < THI_IT_NHAT) { err.textContent = `Đề thi cần ít nhất ${THI_IT_NHAT} bài.`; err.hidden = false; return; }
    kho.ghi("cpp_giao", moi);
    bao("Đã lưu danh sách giao bài");
  };
  document.getElementById("xuat-csv")?.addEventListener("click", () => {
    const o = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    const dong = [["Thời gian", "Họ tên", "Mã SV", "Phần", "Bài làm", "Điểm"].map(o).join(",")];
    for (const r of bang) dong.push([new Date(r.luc).toLocaleString("vi-VN"), r.hoTen, r.maSV, TEN_PHAN[r.phan], r.bai.map((x) => `${x.tieuDe} (${x.diem}/${x.toiDa})`).join("; "), r.diem].map(o).join(","));
    taiFile("bang-diem.csv", "﻿" + dong.join("\r\n"), "text/csv;charset=utf-8"); // ﻿ để Excel đọc đúng tiếng Việt
  });
  document.getElementById("xoa-bang")?.addEventListener("click", (e) => xacNhan(e.currentTarget, "Xóa toàn bộ bảng điểm?", () => {
    kho.xoa("cpp_ketQua");
    bao("Đã xóa bảng điểm");
    veChamDiem(lab);
  }));
}

// ---------- Khởi động ----------
veHeader("thuc-hanh");
veFooter();
veVaiTro();
window.addEventListener("hashchange", () => { veView(); });
veView();
