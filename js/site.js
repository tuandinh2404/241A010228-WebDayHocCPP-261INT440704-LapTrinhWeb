// site.js — phần dùng chung cho mọi trang: danh sách chương, icon, header, menu chương, footer.
// Mỗi trang HTML chỉ cần <div id="site-header"></div> và <div id="site-footer"></div>,
// file này sẽ tự vẽ vào đó để mọi trang giống hệt nhau.

// Danh sách chương (tên phải khớp với js/data/chuong-N.js).
// "chuDe" là dòng mô tả ngắn hiện ở mục lục và menu.
const DS_CHUONG = [
  { so: 1, ten: "Tổng quan C++ & cú pháp cơ bản", ngan: "Cú pháp", chuDe: "Biên dịch, biến, kiểu dữ liệu, toán tử, cin/cout" },
  { so: 2, ten: "Cấu trúc điều khiển & hàm", ngan: "Điều khiển & hàm", chuDe: "if, switch, vòng lặp, hàm, tham chiếu, đệ quy" },
  { so: 3, ten: "Mảng, chuỗi & vector", ngan: "Mảng & chuỗi", chuDe: "Mảng 1–2 chiều, string, vector, sort" },
  { so: 4, ten: "Con trỏ & bộ nhớ động", ngan: "Con trỏ", chuDe: "Địa chỉ, con trỏ, new/delete, struct" },
  { so: 5, ten: "Lập trình hướng đối tượng", ngan: "Hướng đối tượng", chuDe: "class, constructor, nạp chồng toán tử, kế thừa, virtual" },
  { so: 6, ten: "STL & xử lý ngoại lệ", ngan: "STL & ngoại lệ", chuDe: "vector, map, set, algorithm, lambda, try/catch" },
];

// 4 mức bài tập ở phần Lý thuyết. Màu lấy từ biến CSS --lv1..--lv4 trong style.css.
const MUC = {
  1: { ten: "Dễ", lop: "lv1" },
  2: { ten: "Trung bình", lop: "lv2" },
  3: { ten: "Khá", lop: "lv3" },
  4: { ten: "Khó", lop: "lv4" },
};

// Icon vẽ bằng SVG (nét 2px, cùng một kiểu), không dùng emoji.
const ICON_PATH = {
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  "arrow-left": '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
};
function icon(ten, lop = "") {
  return `<svg class="ic ${lop}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATH[ten] || ""}</svg>`;
}

// Chống chèn HTML: mọi chữ lấy từ dữ liệu đều đi qua hàm này trước khi đưa vào trang.
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
// Định dạng chữ trong bài giảng: `code` → <code>, **đậm** → <strong>. Chỉ hai kiểu này.
function inline(s) {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
const pad2 = (n) => String(n).padStart(2, "0");

// ---------- Header + menu chương ----------
// trang: "home" | "chuong" | "thuc-hanh"; soChuong: chương đang mở (để tô đậm trong menu)
function veHeader(trang, soChuong) {
  const el = document.getElementById("site-header");
  if (!el) return;
  const rail = DS_CHUONG.map(
    (c) => `<a class="rail-item${c.so === soChuong ? " is-on" : ""}" href="chuong.html?c=${c.so}"${c.so === soChuong ? ' aria-current="page"' : ""}>
      <span class="rail-num">${pad2(c.so)}</span><span class="rail-name">${escapeHtml(c.ngan)}</span></a>`
  ).join("");
  el.innerHTML = `
  <header class="masthead">
    <div class="masthead-in">
      <a class="brand" href="index.html" aria-label="Trang chủ">
        <span class="brand-mark">C++</span><span class="brand-sub">Lập trình<br>học phần</span>
      </a>
      <nav class="topnav" aria-label="Chính">
        <a href="index.html"${trang === "home" ? ' aria-current="page"' : ""}>Trang chủ</a>
        <a href="index.html#muc-luc">Mục lục</a>
        <a href="thuc-hanh.html"${trang === "thuc-hanh" ? ' aria-current="page"' : ""}>Thực hành</a>
      </nav>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav">${icon("menu")}<span>Menu</span></button>
    </div>
    <nav class="rail" aria-label="Các chương"><div class="rail-in">${rail}</div></nav>
    <nav class="mobile-nav" id="mobile-nav" hidden>
      <a href="index.html">Trang chủ</a><a href="index.html#muc-luc">Mục lục</a>
      <a href="thuc-hanh.html">Thực hành</a>
    </nav>
  </header>`;
  // Đo chiều cao header (máy tính và điện thoại khác nhau) rồi ghi vào biến CSS --hdr,
  // để thanh tab của chương và vị trí cuộn tới mục luôn nằm ngay dưới header.
  const doHeader = () => document.documentElement.style.setProperty("--hdr", el.offsetHeight + "px");
  new ResizeObserver(doHeader).observe(el);

  const btn = el.querySelector(".menu-btn");
  const mnav = el.querySelector("#mobile-nav");
  btn.addEventListener("click", () => {
    const mo = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!mo));
    mnav.hidden = mo;
  });
}

function veFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
  <footer class="footer">
    <div class="footer-in">
      <div class="footer-brand"><span class="brand-mark">C++</span>
        <p>Web dạy học C++: bài giảng, bài tập và chấm điểm trực tiếp.</p>
      </div>
      <ul class="footer-links">
        ${DS_CHUONG.map((c) => `<li><a href="chuong.html?c=${c.so}"><span class="num">${pad2(c.so)}</span> ${escapeHtml(c.ten)}</a></li>`).join("")}
        <li><a href="thuc-hanh.html">Phòng thực hành</a></li>
      </ul>
    </div>
  </footer>`;
}
