# Web dạy học C++

Website dạy các bài học và thực hành bài tập lập trình C++ — đồ án học phần, Khoa Công nghệ Thông tin, Trường Đại học Văn Hiến.

- **Sinh viên thực hiện:** Nguyễn Đình Tuấn — MSSV 241A010228
- **Lớp học phần:** 261INT440704
- **Giảng viên hướng dẫn:** Nguyễn Quang Tấn

## Chức năng

**Dạy các bài học**
- 6 chương: Cú pháp cơ bản · Điều khiển & hàm · Mảng, chuỗi & vector · Con trỏ & bộ nhớ động · Lập trình hướng đối tượng · STL & ngoại lệ.
- Mỗi chương có bài giảng (giải thích, ví dụ code tô màu, lưu ý) và 8 bài tập theo 4 mức Dễ – Trung bình – Khá – Khó, kèm lời giải.

**Thực hành bài tập** (`thuc-hanh.html`)
- Hai vai trò: **Sinh viên** và **Giáo viên** (mã giáo viên mặc định `GV2026`, đổi trong `js/thuc-hanh.js`).
- Sinh viên: nhập Họ tên, Mã SV, chọn phần **Kiểm tra** (1 bài) hoặc **Thi** (2–3 bài), viết code C++ trên trình duyệt, nộp và nhận điểm ngay.
- Giáo viên: **Tạo bài tập** (đề + 5 bộ test, mức Dễ/TB/Khó), **giao bài** cho Kiểm tra / Thi, xem và xuất **bảng điểm** (CSV).
- Chấm điểm: biên dịch bằng g++ (C++17) **một lần**, chạy **5 bộ test**, mỗi test một tiến trình riêng, tối đa 2 giây; đúng mỗi test được **2 điểm**.

## Cài đặt và chạy

Yêu cầu: [Node.js](https://nodejs.org) 18+, trình biên dịch **g++** (Windows: MinGW-w64, thêm vào PATH) và **bash** (Windows: Git Bash đi kèm Git for Windows).

```bash
cd ma-nguon
node server.mjs
```

Mở trình duyệt tại <http://localhost:8080>. Đổi cổng: `PORT=3000 node server.mjs` (PowerShell: `$env:PORT=3000; node server.mjs`).

Trong phòng máy, các máy cùng mạng LAN truy cập `http://<IP máy chủ>:8080` (cho phép Node.js qua tường lửa).

## Cấu trúc thư mục

```
server.mjs              Máy chủ Node.js: phục vụ trang web + API POST /api/judge
server/harness.mjs      Lõi chấm: tạo gói (main.cpp, in1..in5, script compile/run), so khớp output, tính điểm
index.html              Trang chủ
chuong.html             Trang chương (nội dung vẽ từ js/data/chuong-N.js theo ?c=N)
thuc-hanh.html          Phòng thực hành
css/style.css           Giao diện
js/site.js              Phần dùng chung: danh sách chương, header, menu, footer
js/home.js              Trang chủ
js/chuong.js            Trang chương
js/thuc-hanh.js         Phòng thực hành: vai trò, làm bài, nộp bài, tạo bài, giao bài, bảng điểm
js/data/chuong-1..6.js  Bài giảng và 48 bài tập có lời giải
js/data/ngan-hang.js    12 bài tập mẫu của phòng thực hành (mỗi bài 5 bộ test)
```

## Lưu ý

- Ngân hàng bài tập, danh sách giao bài và bảng điểm lưu trong **localStorage** của trình duyệt (mỗi máy một bản); dùng *Xuất / Nhập JSON* để chuyển ngân hàng bài sang máy khác.
- Mã nguồn sinh viên được biên dịch và chạy trực tiếp trên máy chủ (chưa cách ly) — chỉ nên dùng trong môi trường tin cậy như phòng máy, lớp học.
