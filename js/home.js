// home.js — vẽ trang chủ: header, mục lục chương và hiệu ứng chấm điểm trên bìa.

veHeader("home");
veFooter();

// Thay các <span data-icon="..."> bằng icon SVG thật
document.querySelectorAll("[data-icon]").forEach((el) => (el.outerHTML = icon(el.dataset.icon)));

// Tô màu code trên bìa
if (window.hljs) document.querySelectorAll("pre code").forEach((el) => hljs.highlightElement(el));

// ---------- Mục lục ----------
document.getElementById("toc-list").innerHTML = DS_CHUONG.map(
  (c) => `<li class="toc-row"><a href="chuong.html?c=${c.so}">
    <span class="toc-num">${pad2(c.so)}</span>
    <span><h3 class="toc-title">${escapeHtml(c.ten)}</h3><p class="toc-topics">${escapeHtml(c.chuDe)}</p></span>
    <span class="toc-go">${icon("arrow-right")}</span></a></li>`
).join("");

// Chú thích 4 mức (dùng ở mục lục và ở bước "Làm")
const nhanMuc = Object.values(MUC).map((m) => `<span class="lv ${m.lop}">${m.ten}</span>`);
document.getElementById("legend").innerHTML = nhanMuc.join("");
document.getElementById("step-levels").innerHTML = nhanMuc.map((x) => `<li>${x}</li>`).join("");

// ---------- Hiệu ứng trên bìa: 5 test lần lượt đạt, điểm đếm lên 10 ----------
const khungTest = document.getElementById("demo-tests");
const oDiem = document.getElementById("demo-score");
khungTest.insertAdjacentHTML(
  "afterbegin",
  [1, 2, 3, 4, 5]
    .map((i) => `<div class="test-cell" data-i="${i}"><span class="label">Test ${i}</span><span class="state">${icon("check")}<span>#${i}</span></span><span class="pts">+2</span></div>`)
    .join("")
);
const giamChuyenDong = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const BAT_DAU_MS = 1100; // chờ bìa hiện xong rồi mới chấm
const MOI_TEST_MS = 380; // khoảng cách giữa 2 test
khungTest.querySelectorAll(".test-cell").forEach((cell, k) => {
  const xong = () => {
    cell.classList.add("pass");
    oDiem.textContent = String((k + 1) * 2);
  };
  if (giamChuyenDong) xong();
  else setTimeout(xong, BAT_DAU_MS + k * MOI_TEST_MS);
});
