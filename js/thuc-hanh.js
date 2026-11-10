// thuc-hanh.js — Phòng thực hành: đăng nhập / đăng ký, Kiểm tra, Thi, Kết quả của tôi,
// Tạo bài tập, Chấm điểm trực tiếp (giao bài + bảng điểm) và Quản trị (thống kê + tài khoản).
// Mọi dữ liệu lấy từ máy chủ qua API (server/api.mjs) và lưu trong MySQL; trình duyệt chỉ giữ bản nháp code.

const THI_IT_NHAT = 2, THI_NHIEU_NHAT = 3; // phần Thi: chọn 2–3 bài
const SO_TEST = 5;                         // mỗi bài 5 bộ test

const MUC_TH = { de: { ten: "Dễ", lop: "lv1" }, tb: { ten: "Trung bình", lop: "lv2" }, kho: { ten: "Khó", lop: "lv4" } };
const TEN_VAI_TRO = { admin: "Quản trị viên", giao_vien: "Giáo viên", sinh_vien: "Sinh viên" };
const TEN_PHAN = { kiemtra: "Kiểm tra", thi: "Thi" };
const NHAN_TT = { OK: "Đúng", WA: "Sai kết quả", TLE: "Quá thời gian", RTE: "Lỗi khi chạy" };
// Menu theo vai trò (đúng thứ tự hiển thị)
const TAB_THEO_VAI_TRO = {
  sinh_vien: [["kiem-tra", "Kiểm tra"], ["thi", "Thi"], ["ket-qua", "Kết quả của tôi"]],
  giao_vien: [["tao-bai", "Tạo bài tập"], ["kiem-tra", "Kiểm tra"], ["thi", "Thi"], ["cham-diem", "Chấm điểm trực tiếp"]],
  admin: [["tao-bai", "Tạo bài tập"], ["kiem-tra", "Kiểm tra"], ["thi", "Thi"], ["cham-diem", "Chấm điểm trực tiếp"], ["quan-tri", "Quản trị"]],
};
const CODE_MAU = `#include <iostream>
using namespace std;

int main() {
    // Viết code của bạn ở đây: đọc bằng cin, in bằng cout

    return 0;
}
`;

let toi = null; // tài khoản đang đăng nhập
const st = { kiemtra: { buoc: "chon", ds: [], chon: [], ketQua: null }, thi: { buoc: "chon", ds: [], chon: [], ketQua: null }, dangSua: null, locMuc: "all" };

// ---------- Gọi API ----------
class LoiGoi extends Error { constructor(status, msg) { super(msg); this.status = status; } }
async function goi(method, duong, body) {
  let r;
  try {
    r = await fetch(duong, { method, headers: body ? { "content-type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new LoiGoi(0, location.protocol === "file:" ? "Trang đang mở trực tiếp từ file. Hãy chạy: node server.mjs rồi mở http://localhost:8080" : "Không kết nối được máy chủ. Kiểm tra server.mjs còn chạy không.");
  }
  const data = await r.json().catch(() => null);
  if (r.status === 401 && toi) { toi = null; veKhung(); } // phiên hết hạn / bị khóa → về màn đăng nhập
  if (!r.ok) throw new LoiGoi(r.status, data?.loi || `Máy chủ trả lỗi ${r.status}.`);
  return data;
}

// ---------- Tiện ích giao diện ----------
let henGioToast;
function bao(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.hidden = false;
  t.classList.add("is-on");
  clearTimeout(henGioToast);
  henGioToast = setTimeout(() => { t.classList.remove("is-on"); setTimeout(() => (t.hidden = true), 300); }, 2600);
}
const nhanMuc = (m) => `<span class="lv ${MUC_TH[m]?.lop || ""}">${MUC_TH[m]?.ten || m}</span>`;
const catNgan = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);
const thoiGian = (s) => { const d = new Date(String(s).replace(" ", "T")); return isNaN(d) ? s : d.toLocaleString("vi-VN"); };
const dangTai = (box) => (box.innerHTML = `<div class="empty"><span class="spinner" aria-hidden="true"></span></div>`);
const baoLoi = (box, e) => (box.innerHTML = `<div class="empty"><p class="err-text">${escapeHtml(e.message)}</p></div>`);

function cuonToiLab() {
  const tabs = document.querySelector(".ch-tabs").offsetHeight;
  const hdr = document.getElementById("site-header").offsetHeight;
  const y = document.getElementById("lab").getBoundingClientRect().top + window.scrollY - hdr - tabs;
  window.scrollTo({ top: Math.max(0, y) });
}

// Xác nhận ngay tại chỗ (không dùng hộp thoại): nút đổi thành "Câu hỏi? Có · Không"
function xacNhan(nut, cauHoi, lam) {
  const span = document.createElement("span");
  span.className = "confirm-inline";
  span.innerHTML = `${escapeHtml(cauHoi)} <button type="button" class="txt-btn danger">Có</button><button type="button" class="txt-btn">Không</button>`;
  nut.replaceWith(span);
  const [co, khong] = span.querySelectorAll("button");
  co.focus();
  co.onclick = lam;
  khong.onclick = () => span.replaceWith(nut);
}

function taiFile(ten, noiDung, loai) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([noiDung], { type: loai }));
  a.download = ten;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// Khung soạn code: CodeMirror nếu tải được, không thì textarea thường
function taoEditor(el, giaTri, khiDoi) {
  if (window.CodeMirror) {
    const cm = CodeMirror(el, {
      value: giaTri, mode: "text/x-c++src", lineNumbers: true, indentUnit: 4, tabSize: 4, matchBrackets: true, autoCloseBrackets: true,
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
// Bản nháp code lưu trong sessionStorage (mất khi đóng thẻ) — bọc try/catch vì trình duyệt có thể chặn storage
const nhap = {
  doc: (id) => { try { return sessionStorage.getItem("cpp_nhap_" + id) ?? CODE_MAU; } catch { return CODE_MAU; } },
  ghi: (id, v) => { try { sessionStorage.setItem("cpp_nhap_" + id, v); } catch {} },
  xoa: (id) => { try { sessionStorage.removeItem("cpp_nhap_" + id); } catch {} },
};

// ======================================================================
// KHUNG: thông tin tài khoản + menu theo vai trò
// ======================================================================
function hashHienTai() {
  const tabs = toi ? TAB_THEO_VAI_TRO[toi.vaiTro] : [];
  const h = location.hash.slice(1);
  return tabs.some(([k]) => k === h) ? h : tabs[0]?.[0];
}

function veKhung() {
  const role = document.getElementById("role");
  const tabsEl = document.getElementById("lab-tabs");
  if (!toi) {
    role.innerHTML = "";
    tabsEl.innerHTML = `<a class="is-on">Đăng nhập</a>`;
    return veDangNhap(document.getElementById("lab"));
  }
  role.innerHTML = `
    <div class="user-chip">
      <div><b>${escapeHtml(toi.hoTen)}</b><small>${TEN_VAI_TRO[toi.vaiTro]} · ${escapeHtml(toi.maSV || toi.tenDangNhap)}</small></div>
      <button type="button" class="link-arrow" id="nut-doi-mk">Đổi mật khẩu</button>
      <button type="button" class="link-arrow" id="nut-dang-xuat">Đăng xuất</button>
    </div>
    <form class="gv-gate" id="form-doi-mk" hidden>
      <label for="mk-cu">Mật khẩu hiện tại</label><input id="mk-cu" type="password" autocomplete="current-password" required>
      <label for="mk-moi">Mật khẩu mới (ít nhất 6 ký tự)</label><input id="mk-moi" type="password" autocomplete="new-password" required>
      <div class="gv-gate-row"><button class="btn btn-ink" type="submit">Lưu</button></div>
      <p class="field-err" hidden></p>
    </form>`;
  document.getElementById("nut-dang-xuat").onclick = async () => { await goi("POST", "/api/dang-xuat").catch(() => {}); toi = null; history.replaceState(null, "", location.pathname); veKhung(); };
  const f = document.getElementById("form-doi-mk");
  document.getElementById("nut-doi-mk").onclick = () => { f.hidden = !f.hidden; if (!f.hidden) f.querySelector("input").focus(); };
  f.onsubmit = async (e) => {
    e.preventDefault();
    const err = f.querySelector(".field-err");
    try {
      await goi("POST", "/api/doi-mat-khau", { matKhauCu: f.querySelector("#mk-cu").value, matKhauMoi: f.querySelector("#mk-moi").value });
      f.hidden = true; f.reset(); bao("Đã đổi mật khẩu");
    } catch (ex) { err.textContent = ex.message; err.hidden = false; }
  };
  veView();
}

function veTabs() {
  const h = hashHienTai();
  document.getElementById("lab-tabs").innerHTML = TAB_THEO_VAI_TRO[toi.vaiTro]
    .map(([k, ten]) => `<a href="#${k}" class="${k === h ? "is-on" : ""}"${k === h ? ' aria-current="page"' : ""}>${ten}</a>`).join("");
}

function veView() {
  if (!toi) return veKhung();
  veTabs();
  const lab = document.getElementById("lab");
  const h = hashHienTai();
  if (h === "tao-bai") return veTaoBai(lab);
  if (h === "cham-diem") return veChamDiem(lab);
  if (h === "quan-tri") return veQuanTri(lab);
  if (h === "ket-qua") return veKetQuaCuaToi(lab);
  return veLamBai(lab, h === "thi" ? "thi" : "kiemtra");
}

// ======================================================================
// ĐĂNG NHẬP / ĐĂNG KÝ
// ======================================================================
function veDangNhap(lab, cheDo = "dang-nhap") {
  const dk = cheDo === "dang-ky";
  lab.innerHTML = `
    <form class="slip" id="auth" novalidate>
      <div class="auth-tabs" role="tablist">
        <button type="button" role="tab" aria-selected="${!dk}" data-che-do="dang-nhap">Đăng nhập</button>
        <button type="button" role="tab" aria-selected="${dk}" data-che-do="dang-ky">Đăng ký sinh viên</button>
      </div>
      <h2 class="display">${dk ? "Tạo tài khoản sinh viên" : "Đăng nhập"}</h2>
      <p class="slip-sub">${dk ? "Sau khi tạo, đăng nhập bằng Mã SV. Tài khoản giáo viên do quản trị viên cấp." : "Sinh viên đăng nhập bằng Mã SV; giáo viên và quản trị viên dùng tên đăng nhập được cấp."}</p>
      ${dk ? `<div class="field"><label for="ho-ten">Họ và tên</label><input id="ho-ten" autocomplete="name" required></div>` : ""}
      <div class="field"><label for="ten-dn">${dk ? "Mã sinh viên" : "Tên đăng nhập / Mã SV"}</label><input id="ten-dn" autocomplete="username" required></div>
      <div class="field"><label for="mat-khau">Mật khẩu${dk ? " (ít nhất 6 ký tự)" : ""}</label><input id="mat-khau" type="password" autocomplete="${dk ? "new-password" : "current-password"}" required></div>
      ${dk ? `<div class="field"><label for="mat-khau-2">Nhập lại mật khẩu</label><input id="mat-khau-2" type="password" autocomplete="new-password" required></div>` : ""}
      <p class="field-err" id="auth-err" hidden></p>
      <button class="btn btn-primary" type="submit">${dk ? "Tạo tài khoản" : "Đăng nhập"} ${icon("arrow-right")}</button>
    </form>`;
  lab.querySelectorAll("[data-che-do]").forEach((b) => (b.onclick = () => veDangNhap(lab, b.dataset.cheDo)));
  const f = document.getElementById("auth");
  f.querySelector("input").focus({ preventScroll: true }); // không tự cuộn làm tiêu đề bị menu che
  f.onsubmit = async (e) => {
    e.preventDefault();
    const err = document.getElementById("auth-err");
    const v = (id) => document.getElementById(id)?.value ?? "";
    try {
      if (dk) {
        if (v("mat-khau") !== v("mat-khau-2")) throw new Error("Hai lần nhập mật khẩu không khớp.");
        await goi("POST", "/api/dang-ky", { hoTen: v("ho-ten"), maSV: v("ten-dn").trim(), matKhau: v("mat-khau") });
      } else {
        await goi("POST", "/api/dang-nhap", { tenDangNhap: v("ten-dn").trim(), matKhau: v("mat-khau") });
      }
      toi = (await goi("GET", "/api/toi")).nguoiDung;
      history.replaceState(null, "", location.pathname);
      veKhung();
      bao(dk ? "Đã tạo tài khoản" : "Xin chào " + toi.hoTen);
    } catch (ex) { err.textContent = ex.message; err.hidden = false; }
  };
}

// ======================================================================
// KIỂM TRA / THI
// ======================================================================
function veLamBai(lab, phan) {
  const s = st[phan];
  lab.innerHTML = `
    <div class="sv-strip"><div><b>${escapeHtml(toi.hoTen)}</b><span class="num">${escapeHtml(toi.maSV || toi.tenDangNhap)}</span><span class="sv-phan">Phần ${TEN_PHAN[phan]}</span></div></div>
    <div id="buoc"></div>`;
  const box = document.getElementById("buoc");
  if (s.buoc === "lam" && s.chon.length) return veSoanCode(box, phan);
  if (s.buoc === "ketqua" && s.ketQua) return veKetQua(box, phan);
  return veChonBai(box, phan);
}

async function veChonBai(box, phan) {
  const s = st[phan];
  const nhieu = phan === "thi";
  dangTai(box);
  try { s.ds = await goi("GET", "/api/bai-tap?phan=" + phan); } catch (e) { return baoLoi(box, e); }
  if (!s.ds.length) { box.innerHTML = `<div class="empty"><p>Giáo viên chưa giao bài nào cho phần ${TEN_PHAN[phan]}.</p></div>`; return; }
  s.chon = s.chon.filter((id) => s.ds.some((b) => b.id === id));
  box.innerHTML = `
    <div class="pick-head"><h2 class="display">${nhieu ? `Chọn ${THI_IT_NHAT}–${THI_NHIEU_NHAT} bài thi` : "Chọn 1 bài kiểm tra"}</h2><p id="pick-count" class="num"></p></div>
    <ul class="pick-list">${s.ds.map((b) => `
      <li><label class="pick">
        <input type="${nhieu ? "checkbox" : "radio"}" name="bai" value="${b.id}"${s.chon.includes(b.id) ? " checked" : ""}>
        <span class="pick-main"><b>${escapeHtml(b.tieuDe)}</b><small>${inline(catNgan(b.deBai, 140))}</small></span>
        <span class="pick-meta">${nhanMuc(b.muc)}<small>Chương ${b.chuong}</small></span>
      </label></li>`).join("")}</ul>
    <div class="actions"><button class="btn btn-primary" type="button" id="bat-dau">Bắt đầu làm bài ${icon("arrow-right")}</button></div>`;
  const nut = document.getElementById("bat-dau");
  const capNhat = () => {
    s.chon = [...box.querySelectorAll("input[name=bai]:checked")].map((i) => Number(i.value));
    const n = s.chon.length;
    nut.disabled = !(nhieu ? n >= THI_IT_NHAT && n <= THI_NHIEU_NHAT : n === 1);
    document.getElementById("pick-count").textContent = nhieu ? `Đã chọn ${n}/${THI_NHIEU_NHAT}` : n ? "Đã chọn 1 bài" : "Chưa chọn bài";
    if (nhieu) box.querySelectorAll("input[name=bai]").forEach((i) => (i.disabled = !i.checked && n >= THI_NHIEU_NHAT));
  };
  box.querySelectorAll("input[name=bai]").forEach((i) => (i.onchange = capNhat));
  capNhat();
  nut.onclick = () => { s.buoc = "lam"; s.ketQua = null; veView(); cuonToiLab(); };
}

function veSoanCode(box, phan) {
  const s = st[phan];
  const ds = s.chon.map((id) => s.ds.find((b) => b.id === id)).filter(Boolean);
  if (!ds.length) { s.buoc = "chon"; return veView(); }
  box.innerHTML = `
    ${ds.length > 1 ? `<div class="bai-tabs" role="tablist">${ds.map((b, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}">Bài ${i + 1}</button>`).join("")}</div>` : ""}
    ${ds.map((b, i) => `
      <section class="work" data-panel="${i}"${i ? " hidden" : ""}>
        <div class="problem">
          <div class="problem-head"><h2>${ds.length > 1 ? `Bài ${i + 1}. ` : ""}${escapeHtml(b.tieuDe)}</h2>${nhanMuc(b.muc)}</div>
          <p class="problem-meta">Chương ${b.chuong} · ${b.soTest} bộ test · ${b.soTest * 2} điểm</p>
          <p>${inline(b.deBai)}</p>
          <div class="io"><div><span>Input ví dụ</span><pre>${escapeHtml(b.viDu.input)}</pre></div><div><span>Output ví dụ</span><pre>${escapeHtml(b.viDu.output)}</pre></div></div>
          <p class="problem-note">Ví dụ chính là Test 1. ${b.soTest - 1} bộ test còn lại được giữ kín trên máy chủ. Đọc dữ liệu bằng <code>cin</code>, in kết quả bằng <code>cout</code>, <code>main</code> trả về 0.</p>
        </div>
        <div class="editor"><div class="editor-bar"><b>main.cpp</b><button type="button" class="link-arrow reset-code" data-id="${b.id}">Viết lại từ đầu</button></div><div class="editor-host" data-id="${b.id}"></div></div>
      </section>`).join("")}
    <div class="submit-bar">
      <p id="submit-msg" class="submit-msg">${ds.length > 1 ? `Nộp một lần cho cả ${ds.length} bài. ` : ""}Sau khi nộp, máy chủ chạy code với các bộ test và cho điểm ngay.</p>
      <div class="submit-actions">
        <button type="button" class="link-arrow" id="doi-bai">${icon("arrow-left")} Chọn bài khác</button>
        <button type="button" class="btn btn-primary" id="nop">${phan === "thi" ? "Nộp bài thi" : "Nộp bài"} ${icon("arrow-right")}</button>
      </div>
    </div>`;
  const editors = {};
  box.querySelectorAll(".editor-host").forEach((host) => {
    const id = host.dataset.id;
    editors[id] = taoEditor(host, nhap.doc(id), (v) => nhap.ghi(id, v));
  });
  box.querySelectorAll(".reset-code").forEach((btn) => (btn.onclick = () => { nhap.xoa(btn.dataset.id); veSoanCode(box, phan); }));
  box.querySelectorAll(".bai-tabs button").forEach((tb) => (tb.onclick = () => {
    box.querySelectorAll(".bai-tabs button").forEach((x) => x.setAttribute("aria-selected", String(x === tb)));
    box.querySelectorAll(".work").forEach((p) => (p.hidden = p.dataset.panel !== tb.dataset.i));
    Object.values(editors).forEach((e) => e.lamMoi());
  }));
  document.getElementById("doi-bai").onclick = () => { s.buoc = "chon"; veView(); };
  document.getElementById("nop").onclick = () => nopBai(phan, ds, editors);
}

async function nopBai(phan, ds, editors) {
  const nut = document.getElementById("nop");
  const msg = document.getElementById("submit-msg");
  nut.disabled = true;
  document.getElementById("doi-bai").disabled = true;
  nut.innerHTML = `<span class="spinner" aria-hidden="true"></span> Đang chấm${ds.length > 1 ? ` ${ds.length} bài` : ""}…`;
  try {
    st[phan].ketQua = await goi("POST", "/api/nop-bai", { phan, bai: ds.map((b) => ({ id: b.id, code: editors[b.id].lay() })) });
    st[phan].buoc = "ketqua";
    veView();
    cuonToiLab();
  } catch (e) {
    msg.innerHTML = `<span class="err-text">${escapeHtml(e.message)}</span>`;
    nut.disabled = false;
    document.getElementById("doi-bai").disabled = false;
    nut.innerHTML = `Nộp lại ${icon("arrow-right")}`;
  }
}

function veKetQua(box, phan) {
  const { bai, diem } = st[phan].ketQua;
  box.innerHTML = `
    <div class="score-hero">
      <div><p class="score-label">${phan === "thi" ? `Điểm thi (trung bình ${bai.length} bài)` : "Điểm kiểm tra"}</p>
        <p class="score-big num">${Number.isInteger(diem) ? diem : diem.toFixed(2)}<span>/10</span></p></div>
      <div class="score-actions">
        <button class="btn btn-primary" type="button" id="lam-lai">Sửa code, nộp lại</button>
        <button class="link-arrow" type="button" id="bai-khac">Chọn bài khác ${icon("arrow-right")}</button>
      </div>
    </div>
    ${bai.map((b, i) => `
      <article class="kq-bai">
        <header class="kq-head"><h3>${bai.length > 1 ? `Bài ${i + 1}. ` : ""}${escapeHtml(b.tieuDe)}</h3>${nhanMuc(b.muc)}<b class="kq-diem num">${b.diem}<small>/${b.toiDa}</small></b></header>
        ${b.bienDich ? `<div class="kq-loi"><b>Lỗi biên dịch</b><p>Code chưa biên dịch được nên chưa chạy test nào. Sửa lỗi dưới đây rồi nộp lại.</p><pre>${escapeHtml(b.bienDich)}</pre></div>` : ""}
        ${b.loi ? `<div class="kq-loi"><b>Chưa chấm được</b><p>${escapeHtml(b.loi)}</p></div>` : ""}
        ${b.tests.length ? `<ol class="kq-tests">${b.tests.map((t, k) => `
          <li class="kq-test ${t.dung ? "pass" : "fail"}"><span class="kq-t">Test ${k + 1}</span>
            <span class="kq-s">${icon(t.dung ? "check" : "x")} ${NHAN_TT[t.trangThai] || t.trangThai}</span><span class="kq-p num">${t.dung ? "+2" : "0"}</span></li>`).join("")}</ol>` : ""}
        ${chiTietTest1(b)}
        ${b.tests.filter((t) => t.trangThai === "RTE").slice(0, 1).map((t) => `<p class="kq-rte"><b>Lỗi khi chạy:</b> <code>${escapeHtml(t.loi)}</code></p>`).join("")}
      </article>`).join("")}`;
  document.getElementById("lam-lai").onclick = () => { st[phan].buoc = "lam"; veView(); };
  document.getElementById("bai-khac").onclick = () => { st[phan].buoc = "chon"; st[phan].chon = []; veView(); };
}
// Test 1 là ví dụ công khai → nếu sai thì cho xem output để sinh viên tự so sánh
function chiTietTest1(b) {
  const t = b.tests[0];
  if (!t || t.dung || t.trangThai === "TLE") return "";
  return `<div class="kq-diff">
    <div><span>Input (Test 1)</span><pre>${escapeHtml(b.viDu.input)}</pre></div>
    <div><span>Output mong đợi</span><pre>${escapeHtml(b.viDu.output)}</pre></div>
    <div><span>Bạn in ra</span><pre>${escapeHtml(t.output || "") || "<i>(không in gì)</i>"}</pre></div>
  </div>`;
}

// ======================================================================
// KẾT QUẢ CỦA TÔI (sinh viên)
// ======================================================================
async function veKetQuaCuaToi(lab) {
  dangTai(lab);
  let ds;
  try { ds = await goi("GET", "/api/ket-qua-cua-toi"); } catch (e) { return baoLoi(lab, e); }
  lab.innerHTML = `
    <div class="part-title"><h2 class="display">Kết quả của tôi</h2><p class="num">${ds.length} lượt nộp</p></div>
    ${ds.length ? bangLuotNop(ds) : `<div class="empty"><p>Bạn chưa nộp bài nào. Vào phần Kiểm tra hoặc Thi để bắt đầu.</p></div>`}`;
  ganMoChiTiet(lab, ds);
}

// Bảng lượt nộp dùng chung: nút "Xem code" mở dòng chi tiết từng bài (kèm mã nguồn đã nộp)
function bangLuotNop(ds, { hienNguoiNop = false, choXoa = false } = {}) {
  return `<div class="tbl-wrap"><table class="score-table">
    <thead><tr><th>Thời gian</th>${hienNguoiNop ? "<th>Họ tên</th><th>Mã SV / Tài khoản</th>" : ""}<th>Phần</th><th>Bài làm</th><th class="r">Điểm</th><th></th></tr></thead>
    <tbody>${ds.map((r) => `
      <tr data-id="${r.id}">
        <td class="num">${thoiGian(r.nopLuc)}</td>
        ${hienNguoiNop ? `<td>${escapeHtml(r.taiKhoan.hoTen)}</td><td class="num">${escapeHtml(r.taiKhoan.maSV || r.taiKhoan.tenDangNhap)}</td>` : ""}
        <td>${TEN_PHAN[r.phan]}</td>
        <td>${r.bai.map((x) => `${escapeHtml(x.tieuDe)} <span class="num muted">${x.diem}/${x.toiDa}</span>`).join("<br>")}</td>
        <td class="r num"><b>${r.diem}</b></td>
        <td class="r nowrap"><button type="button" class="txt-btn" data-xem="${r.id}">Xem code</button>${choXoa ? ` <button type="button" class="txt-btn danger" data-xoa-luot="${r.id}">Xóa</button>` : ""}</td>
      </tr>`).join("")}</tbody></table></div>`;
}

// Mở / đóng dòng chi tiết. Danh sách đã có mã nguồn thì dùng luôn; không thì gọi API lấy chi tiết lượt nộp.
function ganMoChiTiet(goc, ds, layChiTiet) {
  goc.querySelectorAll("[data-xem]").forEach((nut) => (nut.onclick = async () => {
    const tr = nut.closest("tr");
    if (tr.nextElementSibling?.classList.contains("row-detail")) { tr.nextElementSibling.remove(); nut.textContent = "Xem code"; return; }
    let luot = ds.find((x) => x.id === Number(nut.dataset.xem));
    if (layChiTiet && luot.bai[0]?.maNguon === undefined) {
      try { luot = await layChiTiet(luot.id); } catch (e) { return bao(e.message); }
    }
    tr.insertAdjacentHTML("afterend", `<tr class="row-detail"><td colspan="${tr.children.length}">${luot.bai.map((b) => `
      <div class="code-view"><div class="code-view-bar"><b>${escapeHtml(b.tieuDe)}</b><span class="num">${b.diem}/${b.toiDa} điểm</span></div><pre>${escapeHtml(b.maNguon || "")}</pre></div>`).join("")}</td></tr>`);
    nut.textContent = "Ẩn code";
  }));
}

// ======================================================================
// TẠO BÀI TẬP (giáo viên: sửa / xóa bài của mình; admin: mọi bài)
// ======================================================================
async function veTaoBai(lab) {
  dangTai(lab);
  let ds;
  try { ds = await goi("GET", "/api/quan-ly/bai-tap"); } catch (e) { return baoLoi(lab, e); }
  const sua = st.dangSua ? ds.find((b) => b.id === st.dangSua && b.coTheSua) : null;
  if (!sua) st.dangSua = null;
  const b = sua || { tieuDe: "", chuong: 1, muc: "de", deBai: "", tests: Array.from({ length: SO_TEST }, () => ({ input: "", output: "" })) };
  const loc = st.locMuc;
  const hien = ds.filter((x) => loc === "all" || (loc === "cua-toi" ? x.coTheSua : x.muc === loc));

  lab.innerHTML = `
  <div class="maker">
    <form class="maker-form" id="maker" novalidate>
      <h2 class="display">${sua ? "Sửa bài tập" : "Tạo bài tập mới"}</h2>
      <div class="field"><label for="f-td">Tên bài</label><input id="f-td" name="tieuDe" value="${escapeHtml(b.tieuDe)}" required maxlength="120"></div>
      <div class="field-row">
        <div class="field"><label for="f-ch">Chương</label>
          <select id="f-ch" name="chuong">${DS_CHUONG.map((c) => `<option value="${c.so}"${c.so === b.chuong ? " selected" : ""}>${c.so}. ${escapeHtml(c.ten)}</option>`).join("")}</select></div>
        <fieldset class="field"><legend>Mức độ</legend><div class="seg">
          ${Object.entries(MUC_TH).map(([k, m]) => `<label><input type="radio" name="muc" value="${k}"${b.muc === k ? " checked" : ""}><span class="lv ${m.lop}">${m.ten}</span></label>`).join("")}
        </div></fieldset>
      </div>
      <div class="field"><label for="f-db">Đề bài</label><textarea id="f-db" name="deBai" rows="5" required>${escapeHtml(b.deBai)}</textarea>
        <p class="field-hint">Ghi rõ định dạng input và output. Viết <code>\`code\`</code> để hiện chữ dạng code.</p></div>
      <fieldset class="field tests-field"><legend>Bộ test <span class="num">(${SO_TEST} bộ × 2 điểm; Test 1 là ví dụ công khai)</span></legend>
        ${b.tests.map((t, i) => `
          <div class="test-pair"><span class="test-no num">${i + 1}</span>
            <label><span>Input</span><textarea name="in${i}" rows="2" spellcheck="false">${escapeHtml(t.input)}</textarea></label>
            <label><span>Output đúng</span><textarea name="out${i}" rows="2" spellcheck="false">${escapeHtml(t.output)}</textarea></label></div>`).join("")}
      </fieldset>
      <p class="field-err" id="maker-err" hidden></p>
      <div class="actions">
        <button class="btn btn-primary" type="submit">${sua ? "Lưu thay đổi" : "Lưu bài tập"}</button>
        ${sua ? `<button class="link-arrow" type="button" id="huy-sua">Hủy sửa</button>` : ""}
      </div>
    </form>

    <aside class="bank">
      <div class="bank-head"><h2 class="display">Ngân hàng bài tập</h2><span class="num">${ds.length} bài</span></div>
      <div class="filters" role="group" aria-label="Lọc">
        <button class="chip" type="button" data-loc="all" aria-pressed="${loc === "all"}">Tất cả</button>
        ${toi.vaiTro === "giao_vien" ? `<button class="chip" type="button" data-loc="cua-toi" aria-pressed="${loc === "cua-toi"}">Bài của tôi</button>` : ""}
        ${Object.entries(MUC_TH).map(([k, m]) => `<button class="chip" type="button" data-loc="${k}" aria-pressed="${loc === k}"><span class="lv ${m.lop}">${m.ten}</span><span class="count">${ds.filter((x) => x.muc === k).length}</span></button>`).join("")}
      </div>
      <ul class="bank-list">
        ${hien.length ? hien.map((x) => `
          <li class="bank-item${x.id === st.dangSua ? " is-editing" : ""}">
            <div><b>${escapeHtml(x.tieuDe)}</b><small>${nhanMuc(x.muc)} · Chương ${x.chuong} · ${escapeHtml(x.nguoiTao)}${x.giao.length ? " · đang giao" : ""}</small></div>
            <div class="bank-act">${x.coTheSua ? `<button type="button" class="txt-btn" data-sua="${x.id}">Sửa</button><button type="button" class="txt-btn danger" data-xoa="${x.id}">Xóa</button>` : `<small class="muted">Chỉ xem</small>`}</div>
          </li>`).join("") : `<li class="bank-empty">Không có bài nào.</li>`}
      </ul>
      <p class="bank-note">Ngân hàng bài tập lưu trong MySQL, mọi máy dùng chung. ${toi.vaiTro === "admin" ? "Quản trị viên sửa / xóa được mọi bài." : "Giáo viên chỉ sửa / xóa được bài do mình tạo."}</p>
    </aside>
  </div>`;

  const f = document.getElementById("maker");
  f.onsubmit = async (e) => {
    e.preventDefault();
    const err = document.getElementById("maker-err");
    const body = {
      tieuDe: f.tieuDe.value, chuong: Number(f.chuong.value), muc: f.muc.value, deBai: f.deBai.value,
      tests: Array.from({ length: SO_TEST }, (_, i) => ({ input: f["in" + i].value, output: f["out" + i].value })),
    };
    try {
      if (sua) await goi("PUT", "/api/quan-ly/bai-tap/" + sua.id, body); else await goi("POST", "/api/quan-ly/bai-tap", body);
      st.dangSua = null;
      bao(sua ? "Đã lưu thay đổi" : `Đã thêm "${body.tieuDe.trim()}" vào ngân hàng`);
      veTaoBai(lab);
    } catch (ex) { err.textContent = ex.message; err.hidden = false; }
  };
  document.getElementById("huy-sua")?.addEventListener("click", () => { st.dangSua = null; veTaoBai(lab); });
  lab.querySelectorAll("[data-loc]").forEach((c) => (c.onclick = () => { st.locMuc = c.dataset.loc; veTaoBai(lab); }));
  lab.querySelectorAll("[data-sua]").forEach((btn) => (btn.onclick = async () => { st.dangSua = Number(btn.dataset.sua); await veTaoBai(lab); document.getElementById("maker")?.scrollIntoView({ behavior: "smooth" }); }));
  lab.querySelectorAll("[data-xoa]").forEach((btn) => (btn.onclick = () => xacNhan(btn, "Xóa?", async () => {
    try { await goi("DELETE", "/api/quan-ly/bai-tap/" + btn.dataset.xoa); bao("Đã xóa bài tập"); } catch (e) { bao(e.message); }
    if (st.dangSua === Number(btn.dataset.xoa)) st.dangSua = null;
    veTaoBai(lab);
  })));
}

// ======================================================================
// CHẤM ĐIỂM TRỰC TIẾP: giao bài + bảng điểm (giáo viên, admin)
// ======================================================================
async function veChamDiem(lab) {
  dangTai(lab);
  let ds, g;
  try { [ds, g] = await Promise.all([goi("GET", "/api/quan-ly/bai-tap"), goi("GET", "/api/quan-ly/giao-bai")]); } catch (e) { return baoLoi(lab, e); }
  const cot = (khoa, ten, ghiChu) => `
    <section class="assign-col">
      <div class="assign-head"><h3>${ten}</h3><span class="num" data-dem="${khoa}"></span></div>
      <p class="assign-note">${ghiChu}</p>
      <ul class="assign-list">${ds.map((b) => `
        <li><label><input type="checkbox" data-phan="${khoa}" value="${b.id}"${g[khoa].includes(b.id) ? " checked" : ""}>
          <span><b>${escapeHtml(b.tieuDe)}</b><small>${nhanMuc(b.muc)} · Chương ${b.chuong}</small></span></label></li>`).join("")}
      </ul>
    </section>`;
  lab.innerHTML = `
    <div class="part-title"><h2 class="display">Giao bài</h2><p>Chọn bài từ ngân hàng cho từng phần</p></div>
    <div class="assign">
      ${cot("kiemTra", "Phần Kiểm tra", "Sinh viên chọn 1 bài trong danh sách này.")}
      ${cot("thi", "Phần Thi (đề thi)", `Sinh viên chọn ${THI_IT_NHAT}–${THI_NHIEU_NHAT} bài. Đề thi cần ít nhất ${THI_IT_NHAT} bài.`)}
    </div>
    <div class="actions"><button class="btn btn-primary" type="button" id="luu-giao">Lưu danh sách giao</button><p class="field-err" id="err-giao" hidden></p></div>

    <div class="part-title score-title"><h2 class="display">Bảng điểm</h2><p class="num" id="dem-luot"></p></div>
    <form class="score-filter" id="loc-diem">
      <select name="phan" aria-label="Lọc theo phần"><option value="">Tất cả các phần</option><option value="kiemtra">Kiểm tra</option><option value="thi">Thi</option></select>
      <input name="q" placeholder="Tìm theo họ tên hoặc mã SV" aria-label="Tìm sinh viên">
      <button class="btn btn-ink" type="submit">Lọc</button>
    </form>
    <div id="bang-diem"></div>`;

  const dem = () => ["kiemTra", "thi"].forEach((p) => (lab.querySelector(`[data-dem="${p}"]`).textContent = `${lab.querySelectorAll(`input[data-phan="${p}"]:checked`).length} bài`));
  lab.querySelectorAll("input[data-phan]").forEach((i) => (i.onchange = dem));
  dem();
  document.getElementById("luu-giao").onclick = async () => {
    const lay = (p) => [...lab.querySelectorAll(`input[data-phan="${p}"]:checked`)].map((i) => Number(i.value));
    const err = document.getElementById("err-giao");
    err.hidden = true;
    try { await goi("PUT", "/api/quan-ly/giao-bai", { kiemTra: lay("kiemTra"), thi: lay("thi") }); bao("Đã lưu danh sách giao bài"); }
    catch (e) { err.textContent = e.message; err.hidden = false; }
  };
  const fLoc = document.getElementById("loc-diem");
  fLoc.onsubmit = (e) => { e.preventDefault(); taiBangDiem(); };
  taiBangDiem();

  async function taiBangDiem() {
    const box = document.getElementById("bang-diem");
    dangTai(box);
    let luot;
    try { luot = await goi("GET", "/api/quan-ly/bang-diem?" + new URLSearchParams({ phan: fLoc.phan.value, q: fLoc.q.value.trim() })); } catch (e) { return baoLoi(box, e); }
    document.getElementById("dem-luot").textContent = `${luot.length} lượt nộp`;
    const laAdmin = toi.vaiTro === "admin";
    box.innerHTML = luot.length ? `
      ${bangLuotNop(luot, { hienNguoiNop: true, choXoa: laAdmin })}
      <div class="bank-tools"><button type="button" class="txt-btn" id="xuat-csv">Xuất CSV (Excel)</button>${laAdmin ? `<button type="button" class="txt-btn danger" id="xoa-bang">Xóa toàn bộ bảng điểm</button>` : ""}</div>`
      : `<div class="empty"><p>Chưa có lượt nộp nào${fLoc.q.value || fLoc.phan.value ? " khớp bộ lọc" : ""}.</p></div>`;
    ganMoChiTiet(box, luot, (id) => goi("GET", "/api/quan-ly/luot-nop/" + id));
    box.querySelectorAll("[data-xoa-luot]").forEach((nut) => (nut.onclick = () => xacNhan(nut, "Xóa lượt nộp?", async () => {
      try { await goi("DELETE", "/api/admin/luot-nop/" + nut.dataset.xoaLuot); bao("Đã xóa lượt nộp"); } catch (e) { bao(e.message); }
      taiBangDiem();
    })));
    document.getElementById("xuat-csv")?.addEventListener("click", () => {
      const o = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
      const dong = [["Thời gian", "Họ tên", "Mã SV / Tài khoản", "Phần", "Bài làm", "Điểm"].map(o).join(",")];
      for (const r of luot) dong.push([thoiGian(r.nopLuc), r.taiKhoan.hoTen, r.taiKhoan.maSV || r.taiKhoan.tenDangNhap, TEN_PHAN[r.phan], r.bai.map((x) => `${x.tieuDe} (${x.diem}/${x.toiDa})`).join("; "), r.diem].map(o).join(","));
      taiFile("bang-diem.csv", "﻿" + dong.join("\r\n"), "text/csv;charset=utf-8"); // ﻿ để Excel đọc đúng tiếng Việt
    });
    document.getElementById("xoa-bang")?.addEventListener("click", (e) => xacNhan(e.currentTarget, "Xóa toàn bộ bảng điểm?", async () => {
      try { await goi("DELETE", "/api/admin/luot-nop", { xacNhan: true }); bao("Đã xóa bảng điểm"); } catch (ex) { bao(ex.message); }
      taiBangDiem();
    }));
  }
}

// ======================================================================
// QUẢN TRỊ (admin): thống kê + quản lý tài khoản
// ======================================================================
async function veQuanTri(lab) {
  dangTai(lab);
  let tk;
  try { tk = await goi("GET", "/api/admin/thong-ke"); } catch (e) { return baoLoi(lab, e); }
  const so = (v) => (v == null ? "—" : String(v).replace(".", ","));
  const maxNgay = Math.max(1, ...tk.nopTheoNgay.map((d) => d.soLuot));
  lab.innerHTML = `
    <div class="part-title"><h2 class="display">Thống kê</h2><p>Số liệu toàn hệ thống</p></div>
    <dl class="stats">
      <div><dt>Sinh viên</dt><dd class="num">${tk.taiKhoan.sinhVien}</dd><small>${tk.taiKhoan.biKhoa} tài khoản bị khóa</small></div>
      <div><dt>Giáo viên</dt><dd class="num">${tk.taiKhoan.giaoVien}</dd><small>${tk.taiKhoan.admin} quản trị viên</small></div>
      <div><dt>Bài tập</dt><dd class="num">${tk.baiTap.tong}</dd><small>${tk.baiTap.de} Dễ · ${tk.baiTap.tb} TB · ${tk.baiTap.kho} Khó</small></div>
      <div><dt>Lượt nộp</dt><dd class="num">${tk.luotNop.tong}</dd><small>${tk.luotNop.homNay} hôm nay</small></div>
      <div><dt>Điểm TB Kiểm tra</dt><dd class="num">${so(tk.diemTB.kiemTra)}</dd><small>${tk.luotNop.kiemTra} lượt</small></div>
      <div><dt>Điểm TB Thi</dt><dd class="num">${so(tk.diemTB.thi)}</dd><small>${tk.luotNop.thi} lượt</small></div>
    </dl>
    <div class="stats-2">
      <section><h3>Lượt nộp 7 ngày gần nhất</h3>
        ${tk.nopTheoNgay.length ? `<ul class="bars">${tk.nopTheoNgay.map((d) => `<li><span class="num">${d.ngay.slice(8, 10)}/${d.ngay.slice(5, 7)}</span><i style="--w:${(d.soLuot / maxNgay) * 100}%"></i><b class="num">${d.soLuot}</b></li>`).join("")}</ul>` : `<p class="muted">Chưa có lượt nộp.</p>`}
      </section>
      <section><h3>Bài có điểm trung bình thấp nhất</h3>
        ${tk.baiDiemThapNhat.length ? `<table class="mini-table"><tbody>${tk.baiDiemThapNhat.map((b) => `<tr><td>${escapeHtml(b.tieuDe)}</td><td class="r num">${b.soLan} lượt</td><td class="r num"><b>${so(b.diemTB)}</b></td></tr>`).join("")}</tbody></table>` : `<p class="muted">Chưa có dữ liệu.</p>`}
      </section>
    </div>

    <div class="part-title score-title"><h2 class="display">Tài khoản</h2><p class="num" id="dem-tk"></p></div>
    <form class="account-form" id="tao-tk" novalidate>
      <h3>Tạo tài khoản</h3>
      <div class="account-grid">
        <label><span>Vai trò</span><select name="vaiTro"><option value="giao_vien">Giáo viên</option><option value="sinh_vien">Sinh viên</option><option value="admin">Quản trị viên</option></select></label>
        <label><span id="nhan-ten">Tên đăng nhập</span><input name="tenDangNhap" autocomplete="off"></label>
        <label><span>Họ và tên</span><input name="hoTen" autocomplete="off"></label>
        <label><span>Mật khẩu (ít nhất 6 ký tự)</span><input name="matKhau" type="password" autocomplete="new-password"></label>
      </div>
      <p class="field-err" hidden></p>
      <button class="btn btn-ink" type="submit">Tạo tài khoản</button>
    </form>
    <form class="score-filter" id="loc-tk">
      <select name="vaiTro" aria-label="Lọc theo vai trò"><option value="">Mọi vai trò</option><option value="admin">Quản trị viên</option><option value="giao_vien">Giáo viên</option><option value="sinh_vien">Sinh viên</option></select>
      <input name="q" placeholder="Tìm theo họ tên, tên đăng nhập, mã SV" aria-label="Tìm tài khoản">
      <button class="btn btn-ink" type="submit">Lọc</button>
    </form>
    <div id="ds-tk"></div>`;

  const fTao = document.getElementById("tao-tk");
  fTao.vaiTro.onchange = () => (document.getElementById("nhan-ten").textContent = fTao.vaiTro.value === "sinh_vien" ? "Mã sinh viên" : "Tên đăng nhập");
  fTao.onsubmit = async (e) => {
    e.preventDefault();
    const err = fTao.querySelector(".field-err");
    err.hidden = true;
    const v = fTao.vaiTro.value;
    try {
      await goi("POST", "/api/admin/tai-khoan", { vaiTro: v, tenDangNhap: fTao.tenDangNhap.value, maSV: v === "sinh_vien" ? fTao.tenDangNhap.value : undefined, hoTen: fTao.hoTen.value, matKhau: fTao.matKhau.value });
      bao("Đã tạo tài khoản " + fTao.tenDangNhap.value.trim());
      fTao.reset();
      document.getElementById("nhan-ten").textContent = "Tên đăng nhập";
      taiTaiKhoan();
    } catch (ex) { err.textContent = ex.message; err.hidden = false; }
  };
  const fLoc = document.getElementById("loc-tk");
  fLoc.onsubmit = (e) => { e.preventDefault(); taiTaiKhoan(); };
  taiTaiKhoan();

  async function taiTaiKhoan() {
    const box = document.getElementById("ds-tk");
    dangTai(box);
    let ds;
    try { ds = await goi("GET", "/api/admin/tai-khoan?" + new URLSearchParams({ vaiTro: fLoc.vaiTro.value, q: fLoc.q.value.trim() })); } catch (e) { return baoLoi(box, e); }
    document.getElementById("dem-tk").textContent = `${ds.length} tài khoản`;
    box.innerHTML = ds.length ? `<div class="tbl-wrap"><table class="score-table">
      <thead><tr><th>Họ tên</th><th>Tên đăng nhập / Mã SV</th><th>Vai trò</th><th>Trạng thái</th><th class="r">Lượt nộp</th><th>Tạo lúc</th><th></th></tr></thead>
      <tbody>${ds.map((t) => `<tr data-id="${t.id}">
        <td>${escapeHtml(t.hoTen)}${t.id === toi.id ? ' <small class="muted">(bạn)</small>' : ""}</td>
        <td class="num">${escapeHtml(t.tenDangNhap)}</td>
        <td>${TEN_VAI_TRO[t.vaiTro]}</td>
        <td>${t.biKhoa ? '<span class="tag-khoa">Đã khóa</span>' : "Hoạt động"}</td>
        <td class="r num">${t.soLuotNop}</td>
        <td class="num">${thoiGian(t.taoLuc)}</td>
        <td class="r nowrap">${t.id === toi.id ? "" : `<button type="button" class="txt-btn" data-khoa="${t.biKhoa ? 0 : 1}">${t.biKhoa ? "Mở khóa" : "Khóa"}</button>
          <button type="button" class="txt-btn" data-dat-mk>Đặt lại mật khẩu</button>
          <button type="button" class="txt-btn danger" data-xoa-tk>Xóa</button>`}</td>
      </tr>`).join("")}</tbody></table></div>` : `<div class="empty"><p>Không có tài khoản nào khớp bộ lọc.</p></div>`;

    const idCua = (el) => Number(el.closest("tr").dataset.id);
    box.querySelectorAll("[data-khoa]").forEach((nut) => (nut.onclick = async () => {
      try { await goi("PUT", "/api/admin/tai-khoan/" + idCua(nut), { biKhoa: nut.dataset.khoa === "1" }); bao(nut.dataset.khoa === "1" ? "Đã khóa tài khoản" : "Đã mở khóa"); } catch (e) { bao(e.message); }
      taiTaiKhoan();
    }));
    box.querySelectorAll("[data-dat-mk]").forEach((nut) => (nut.onclick = () => {
      const id = idCua(nut);
      const span = document.createElement("span");
      span.className = "confirm-inline";
      span.innerHTML = `<input type="password" placeholder="Mật khẩu mới" aria-label="Mật khẩu mới" autocomplete="new-password"><button type="button" class="txt-btn">Lưu</button><button type="button" class="txt-btn">Hủy</button>`;
      nut.replaceWith(span);
      const o = span.querySelector("input");
      const [luu, huy] = span.querySelectorAll("button");
      o.focus();
      huy.onclick = () => span.replaceWith(nut);
      luu.onclick = async () => {
        try { await goi("PUT", "/api/admin/tai-khoan/" + id, { matKhauMoi: o.value }); bao("Đã đặt lại mật khẩu"); span.replaceWith(nut); } catch (e) { bao(e.message); }
      };
    }));
    box.querySelectorAll("[data-xoa-tk]").forEach((nut) => {
      const id = idCua(nut);
      nut.onclick = () => xacNhan(nut, "Xóa tài khoản và bài nộp?", async () => {
        try { await goi("DELETE", "/api/admin/tai-khoan/" + id); bao("Đã xóa tài khoản"); } catch (e) { bao(e.message); }
        taiTaiKhoan();
      });
    });
  }
}

// ---------- Khởi động ----------
veHeader("thuc-hanh");
veFooter();
window.addEventListener("hashchange", () => veView());
(async () => {
  const lab = document.getElementById("lab");
  dangTai(lab);
  try { toi = (await goi("GET", "/api/toi")).nguoiDung; }
  catch (e) { document.getElementById("lab-tabs").innerHTML = ""; return baoLoi(lab, e); }
  veKhung();
})();
