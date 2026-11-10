// chuong.js — vẽ trang một chương: bìa chương, Lý thuyết (bài giảng + bài tập 4 mức có lời giải), Thực hành.
// Địa chỉ dạng chuong.html?c=3 → nạp js/data/chuong-3.js rồi vẽ.

const so = (() => {
  const c = Number(new URLSearchParams(location.search).get("c"));
  return DS_CHUONG.some((x) => x.so === c) ? c : 1; // số sai → về Chương 1
})();
const meta = DS_CHUONG.find((x) => x.so === so);
document.title = `Chương ${so}: ${meta.ten} · Lập trình C++`;
veHeader("chuong", so);
veFooter();

// Nạp file dữ liệu của chương bằng cách chèn thẻ <script>
const tag = document.createElement("script");
tag.src = `js/data/chuong-${so}.js`;
tag.onload = () => ve(window.CHUONG && window.CHUONG[so]);
tag.onerror = () => ve(null);
document.body.appendChild(tag);

// Khối code có nút "Chép"
function khoiCode(code) {
  return `<div class="code"><button class="copy-btn" type="button">${icon("copy")}<span>Chép</span></button><pre><code class="language-cpp">${escapeHtml(code)}</code></pre></div>`;
}

// Vẽ một phần tử nội dung bài giảng theo "loai"
function veNoiDung(n) {
  switch (n.loai) {
    case "p": return `<p>${inline(n.text)}</p>`;
    case "code": return khoiCode(n.text);
    case "list": return `<ul>${n.items.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>`;
    case "note": return `<div class="note"><b>Lưu ý</b><div>${inline(n.text)}</div></div>`;
    case "table":
      return `<div class="tbl-wrap"><table><thead><tr>${n.head.map((h) => `<th>${inline(h)}</th>`).join("")}</tr></thead>
        <tbody>${n.rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    default: return "";
  }
}

function ve(ch) {
  const main = document.getElementById("chuong");
  const truoc = DS_CHUONG.find((x) => x.so === so - 1);
  const sau = DS_CHUONG.find((x) => x.so === so + 1);

  const bia = `
  <section class="ch-cover">
    <div class="ch-cover-in">
      <p class="ch-big rise" aria-hidden="true">${pad2(so)}</p>
      <div class="ch-cover-text rise" style="--d:.1s">
        <a class="crumb" href="index.html#muc-luc">${icon("arrow-left")} Mục lục</a>
        <h1 class="display ch-title"><span class="sr-only">Chương ${so}: </span>${escapeHtml(meta.ten)}</h1>
        ${ch ? `<p class="ch-sum">${inline(ch.tomTat)}</p>` : ""}
      </div>
    </div>
  </section>`;

  if (!ch) {
    main.innerHTML = bia + `<div class="wrap empty"><p>Nội dung chương này đang được cập nhật.</p></div>`;
    return;
  }

  // ----- Bài giảng -----
  const baiGiang = ch.baiGiang.map((l, i) => `
    <article class="lesson" id="${l.id}">
      <h3><span class="sec">${so}.${i + 1}</span>${escapeHtml(l.tieuDe)}</h3>
      ${l.noiDung.map(veNoiDung).join("")}
    </article>`).join("");

  // ----- Bài tập (xếp theo mức từ dễ đến khó) -----
  const dsBT = [...ch.baiTap].sort((a, b) => a.muc - b.muc);
  const demMuc = (m) => dsBT.filter((b) => b.muc === m).length;
  const locMuc = `<div class="filters" role="group" aria-label="Lọc theo mức">
    <button class="chip" type="button" data-muc="0" aria-pressed="true">Tất cả <span class="count">${dsBT.length}</span></button>
    ${Object.entries(MUC).map(([k, m]) => `<button class="chip" type="button" data-muc="${k}" aria-pressed="false"><span class="lv ${m.lop}">${m.ten}</span><span class="count">${demMuc(+k)}</span></button>`).join("")}
  </div>`;
  const baiTap = dsBT.map((b, i) => `
    <li class="ex ${MUC[b.muc].lop}" data-muc="${b.muc}" id="${b.id}">
      <div class="ex-no num">${i + 1}</div>
      <div class="ex-body">
        <div class="ex-head"><h3>${escapeHtml(b.tieuDe)}</h3><span class="lv ${MUC[b.muc].lop}">${MUC[b.muc].ten}</span></div>
        <p>${inline(b.deBai)}</p>
        ${b.viDu ? `<div class="io"><div><span>Input</span><pre>${escapeHtml(b.viDu.input)}</pre></div><div><span>Output</span><pre>${escapeHtml(b.viDu.output)}</pre></div></div>` : ""}
        <details class="solution">
          <summary>Xem lời giải ${icon("chevron-down")}</summary>
          <div class="solution-in">${b.giaiThich ? `<p>${inline(b.giaiThich)}</p>` : ""}${khoiCode(b.loiGiai)}</div>
        </details>
      </div>
    </li>`).join("");

  // ----- Mục lục bên trái -----
  const side = `<aside class="ch-side" aria-label="Trong chương">
    <h2>Trong chương</h2>
    <ol>${ch.baiGiang.map((l, i) => `<li><a href="#${l.id}">${so}.${i + 1} ${escapeHtml(l.tieuDe)}</a></li>`).join("")}
      <li><a href="#bai-tap">Bài tập (${dsBT.length})</a></li>
      <li><a href="#thuc-hanh">Thực hành</a></li></ol>
  </aside>`;

  main.innerHTML = bia + `
  <nav class="ch-tabs" aria-label="Các phần của chương"><div class="ch-tabs-in">
    <a href="#ly-thuyet" data-tab="ly-thuyet">Lý thuyết</a>
    <a href="#bai-tap" data-tab="bai-tap">Bài tập &amp; lời giải<span class="count">${dsBT.length}</span></a>
    <a href="#thuc-hanh" data-tab="thuc-hanh">Thực hành</a>
  </div></nav>
  <div class="wrap ch-body">
    ${side}
    <div>
      <section class="part" id="ly-thuyet" aria-labelledby="t-lt">
        <div class="part-title"><h2 class="display" id="t-lt">Lý thuyết</h2><p>${ch.baiGiang.length} mục bài giảng</p></div>
        ${baiGiang}
      </section>
      <section class="part" id="bai-tap" aria-labelledby="t-bt">
        <div class="part-title"><h2 class="display" id="t-bt">Bài tập</h2><p>${dsBT.length} bài · 4 mức, từ dễ đến khó</p></div>
        ${locMuc}
        <ol class="ex-list">${baiTap}</ol>
      </section>
      <section class="part" id="thuc-hanh" aria-labelledby="t-th">
        <div class="part-title"><h2 class="display" id="t-th">Thực hành</h2><p>Kiểm tra · Thi · Chấm điểm trực tiếp</p></div>
        <div class="practice-box">
          <div><h3>Viết code, nộp bài, có điểm ngay.</h3>
            <p>Phòng thực hành dùng bài tập do giáo viên chuẩn bị. Phần Kiểm tra chọn 1 bài, phần Thi chọn 2 đến 3 bài. Mỗi bài chạy với 5 bộ test, đúng mỗi bộ được 2 điểm.</p></div>
          <a class="btn btn-primary" href="thuc-hanh.html">Vào phòng thực hành ${icon("arrow-right")}</a>
        </div>
      </section>
      <nav class="ch-pager" aria-label="Chương trước, chương sau">
        ${truoc ? `<a href="chuong.html?c=${truoc.so}"><small>${icon("arrow-left")} Chương ${truoc.so}</small><b>${escapeHtml(truoc.ten)}</b></a>` : `<span class="spacer"></span>`}
        ${sau ? `<a href="chuong.html?c=${sau.so}"><small>Chương ${sau.so} ${icon("arrow-right")}</small><b>${escapeHtml(sau.ten)}</b></a>` : ""}
      </nav>
    </div>
  </div>`;

  if (window.hljs) main.querySelectorAll("pre code").forEach((el) => hljs.highlightElement(el));
  ganSuKien(main);
}

function ganSuKien(main) {
  // Nút "Chép" code
  main.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const code = btn.parentElement.querySelector("code").innerText;
    try {
      await navigator.clipboard.writeText(code);
      btn.querySelector("span").textContent = "Đã chép";
    } catch {
      btn.querySelector("span").textContent = "Không chép được";
    }
    setTimeout(() => (btn.querySelector("span").textContent = "Chép"), 1600);
  });

  // Lọc bài tập theo mức
  const chips = main.querySelectorAll(".chip");
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      const m = chip.dataset.muc;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      main.querySelectorAll(".ex").forEach((ex) => (ex.hidden = m !== "0" && ex.dataset.muc !== m));
    })
  );

  // Tô sáng mục đang đọc (mục lục trái + thanh tab) khi cuộn trang
  const sideLinks = [...main.querySelectorAll(".ch-side a")];
  const tabs = [...main.querySelectorAll(".ch-tabs a")];
  const theoDoi = [...main.querySelectorAll(".lesson, #bai-tap, #thuc-hanh")];
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        sideLinks.forEach((a) => a.classList.toggle("is-on", a.getAttribute("href") === "#" + id));
        const phan = en.target.closest(".part").id;
        tabs.forEach((a) => a.classList.toggle("is-on", a.dataset.tab === phan));
      });
    },
    { rootMargin: "-30% 0px -60% 0px" } // "đang đọc" = phần nằm ở khoảng 30–40% chiều cao màn hình
  );
  theoDoi.forEach((el) => obs.observe(el));
}
