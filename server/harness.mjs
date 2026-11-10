// harness.mjs — lõi chấm bài C++, được server.mjs gọi mỗi khi sinh viên nộp bài.
//
// Cách làm: tạo một "gói" file trong thư mục tạm rồi chạy 2 script bằng bash:
//   main.cpp       — code của sinh viên, giữ NGUYÊN (số dòng báo lỗi khớp với code SV thấy)
//   in1 … in5      — input của từng bộ test
//   compile        — script biên dịch main.cpp MỘT lần bằng g++
//   run            — script chạy file đã biên dịch 5 lần (mỗi test là một tiến trình riêng, tối đa 2 giây),
//                    in ra các dòng "@@KQ|..." để ta đọc lại kết quả.
// Mỗi test là một tiến trình riêng → biến toàn cục / exit() / crash của test này không ảnh hưởng test khác.

export const DIEM_MOI_TEST = 2;         // đúng 1 bộ test được 2 điểm
export const GIOI_HAN_MOI_TEST_GIAY = 2; // mỗi test chạy tối đa 2 giây
const DAU = "@@KQ|";                    // dấu đầu dòng kết quả
const OUTPUT_TOI_DA = 65536;            // chỉ lấy tối đa 64 KB output mỗi test

// Script biên dịch: dùng g++ của máy, chuẩn C++17. Muốn đổi cờ biên dịch thì sửa dòng g++ dưới đây.
const SCRIPT_COMPILE = `#!/bin/bash
g++ -std=c++17 -O2 -o main main.cpp
`;

// Script chạy test. timeout trả mã 124 khi quá giờ; mã khác 0 nghĩa là lỗi khi chạy.
const SCRIPT_RUN = `#!/bin/bash
i=1
while [ -f "in$i" ]; do
  bd=$(date +%s%N)
  timeout ${GIOI_HAN_MOI_TEST_GIAY} ./main < "in$i" > "out$i" 2> "err$i"
  ma=$?
  kt=$(date +%s%N)
  if [ $ma -eq 124 ]; then tt=TLE; elif [ $ma -ne 0 ]; then tt=RTE; else tt=OK; fi
  echo "${DAU}$((i-1))|$tt|$(( (kt-bd)/1000000 ))|$ma|$(head -c ${OUTPUT_TOI_DA} "out$i" | base64 -w0)|$(head -c 400 "err$i" | base64 -w0)"
  i=$((i+1))
done
`;

// ---------- 1. Tạo gói file gửi máy chấm ----------
export function taoGoi(code, inputs) {
  const files = { "main.cpp": code, compile: SCRIPT_COMPILE, run: SCRIPT_RUN };
  inputs.forEach((inp, k) => (files["in" + (k + 1)] = inp));
  return files;
}

// ---------- 2. Đọc kết quả + so sánh ----------
// Bỏ \r, khoảng trắng cuối mỗi dòng và các dòng trống ở cuối → không bắt lỗi vì thừa dấu cách / xuống dòng.
export function chuanHoa(s) {
  const dong = String(s ?? "").replace(/\r\n?/g, "\n").split("\n").map((d) => d.replace(/\s+$/, ""));
  while (dong.length && dong[dong.length - 1] === "") dong.pop();
  return dong.join("\n");
}

// Mã thoát → lời giải thích dễ hiểu. Đã đo thật trên Windows (MinGW + Git Bash) và theo quy ước Linux (128 + số tín hiệu):
//   chia cho 0: Windows 127 / Linux 136 · con trỏ lỗi: 139 · tràn ngăn xếp: Windows 127 / Linux 139
//   ngoại lệ không bắt: Windows 3 (stderr có "terminate called") / Linux 134
function giaiThichMaThoat(ma, stderr) {
  const ngoaiLe = ma === 134 || (ma === 3 && /terminate called/.test(stderr));
  const loai = ngoaiLe ? "Ngoại lệ không được bắt nên chương trình bị dừng (abort) — thêm try/catch hoặc kiểm tra dữ liệu"
    : { 136: "Lỗi số học — thường do chia cho 0",
        139: "Truy cập bộ nhớ sai (Segmentation fault) — chỉ số mảng vượt giới hạn, con trỏ lỗi hoặc đệ quy quá sâu",
        127: "Chương trình bị hệ điều hành dừng đột ngột — thường do chia cho 0 hoặc đệ quy quá sâu" }[ma];
  const dau = loai || `Chương trình kết thúc với mã ${ma} (main nên return 0)`;
  return stderr.trim() ? `${dau}. ${stderr.trim()}` : dau;
}

function docKetQua(stdout) {
  const kq = {};
  const giai = (x) => Buffer.from(x || "", "base64").toString("utf8");
  for (const dong of String(stdout || "").split(/\r?\n/)) {
    if (!dong.startsWith(DAU)) continue;
    const [i, tt, ms, ma, out, err] = dong.slice(DAU.length).split("|");
    kq[Number(i)] = { trangThai: tt, ms: Number(ms), output: giai(out), loi: tt === "RTE" ? giaiThichMaThoat(Number(ma), giai(err)) : "" };
  }
  return kq;
}

const cat = (s, n = 2000) => (s.length > n ? s.slice(0, n) + "\n…" : s);

// ---------- 3. Chấm một bài ----------
// runner(files) → { trangThai: "ok" | "bienDich" | "quaGio" | "loi", stdout, bienDich, thongBao }
// Trả về { diem, toiDa, soDung, tests: [{ dung, trangThai, output, loi, ms }], bienDich?, loi? }
export async function chamBai(code, tests, runner) {
  const toiDa = tests.length * DIEM_MOI_TEST;
  if (!/\bmain\s*\(/.test(code)) return { diem: 0, toiDa, soDung: 0, loi: "Không tìm thấy hàm main. Hãy viết: int main() { ... return 0; }", tests: [] };

  const chay = await runner(taoGoi(code, tests.map((t) => t.input)));
  if (chay.trangThai === "bienDich") return { diem: 0, toiDa, soDung: 0, bienDich: cat(String(chay.bienDich || "").trim(), 4000), tests: [] };
  if (chay.trangThai === "loi" && !chay.stdout) return { diem: 0, toiDa, soDung: 0, loi: chay.thongBao || "Máy chấm gặp lỗi.", tests: [] };

  const doc = docKetQua(chay.stdout);
  const kq = tests.map((t, i) => {
    const r = doc[i];
    // Không có dòng kết quả cho test này → cả gói bị dừng vì quá thời gian chung
    if (!r) return { dung: false, trangThai: "TLE", output: "", loi: "", ms: 0 };
    const dung = r.trangThai === "OK" && chuanHoa(r.output) === chuanHoa(t.output);
    return { dung, trangThai: r.trangThai === "OK" && !dung ? "WA" : r.trangThai, output: cat(r.output), loi: cat(r.loi, 600), ms: r.ms };
  });
  const soDung = kq.filter((x) => x.dung).length;
  return { diem: soDung * DIEM_MOI_TEST, toiDa, soDung, tests: kq };
}

// ---------- 4. Kiểm tra dữ liệu gửi lên ----------
export function kiemTraYeuCau(b) {
  if (!b || typeof b.code !== "string" || !Array.isArray(b.tests)) return "Thiếu code hoặc bộ test.";
  if (b.code.length > 20000) return "Code quá dài (tối đa 20.000 ký tự).";
  if (b.tests.length < 1 || b.tests.length > 10) return "Mỗi bài có từ 1 đến 10 bộ test.";
  for (const t of b.tests) {
    if (typeof t?.input !== "string" || typeof t?.output !== "string") return "Bộ test không hợp lệ.";
    if (t.input.length > 10000 || t.output.length > 10000) return "Bộ test quá dài.";
  }
  return null;
}
