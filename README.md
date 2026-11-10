# Web dạy học C++

Website dạy các bài học và thực hành bài tập lập trình C++ — đồ án học phần Lập trình Web, Khoa Công nghệ Thông tin, Trường Đại học Văn Hiến.

- **Sinh viên thực hiện:** Nguyễn Đình Tuấn — MSSV 241A010228
- **Lớp học phần:** 261INT440704
- **Giảng viên:** Nguyễn Quang Tấn

## Chức năng

**Dạy các bài học** (không cần đăng nhập)
- 6 chương: Cú pháp cơ bản · Điều khiển & hàm · Mảng, chuỗi & vector · Con trỏ & bộ nhớ động · Lập trình hướng đối tượng · STL & ngoại lệ.
- Mỗi chương có bài giảng (giải thích, ví dụ code tô màu, lưu ý) và 8 bài tập theo 4 mức Dễ – Trung bình – Khá – Khó, kèm lời giải.

**Phòng thực hành** (`thuc-hanh.html`, phải đăng nhập) — ba vai trò:

| Vai trò | Chức năng |
|---|---|
| Sinh viên | Tự đăng ký bằng Mã SV; làm **Kiểm tra** (chọn 1 bài) hoặc **Thi** (chọn 2–3 bài); viết code C++ trên trình duyệt, nộp và nhận điểm ngay; xem **Kết quả của tôi** (kèm code đã nộp); đổi mật khẩu |
| Giáo viên | **Tạo / sửa / xóa bài tập** của mình (đề + 5 bộ test, mức Dễ/TB/Khó); **giao bài** cho Kiểm tra / Thi; xem **bảng điểm** (lọc, xem code sinh viên nộp, xuất CSV) |
| Quản trị viên (Admin) | Mọi quyền của giáo viên, sửa / xóa mọi bài tập; **quản lý tài khoản** (tạo, khóa / mở khóa, đặt lại mật khẩu, xóa); **quản lý bảng điểm** (xóa lượt nộp); **thống kê** (số tài khoản, bài tập, lượt nộp, điểm trung bình, bài có điểm thấp nhất, lượt nộp 7 ngày) |

**Chấm điểm:** máy chủ biên dịch bằng g++ (C++17) **một lần**, chạy **5 bộ test**, mỗi test một tiến trình riêng, tối đa 2 giây; đúng mỗi test được **2 điểm**. Test 1 là ví dụ công khai, 4 test còn lại chỉ nằm trong CSDL trên máy chủ.

## Cài đặt và chạy

Yêu cầu trên máy:
- [XAMPP](https://www.apachefriends.org) (chỉ dùng **MySQL**)
- [Node.js](https://nodejs.org) 18 trở lên
- **g++** (Windows: MinGW-w64, thêm vào PATH) và **bash** (Windows: Git Bash đi kèm Git for Windows)

Các bước:

1. Mở **XAMPP Control Panel**, bấm **Start** ở dòng **MySQL** (không cần Apache).
2. Mở terminal trong thư mục `ma-nguon`:

   ```bash
   npm install          # lần đầu: cài thư viện mysql2
   npm run khoi-tao     # lần đầu: tạo CSDL web_day_hoc_cpp + dữ liệu mẫu
   node server.mjs      # chạy website
   ```

3. Mở trình duyệt tại <http://localhost:8080>.

Tài khoản có sẵn sau khi khởi tạo (nên đổi mật khẩu sau lần đăng nhập đầu):

| Vai trò | Tên đăng nhập | Mật khẩu |
|---|---|---|
| Quản trị viên | `admin` | `Admin@123` |
| Giáo viên | `giaovien` | `GiaoVien@123` |

Sinh viên tự tạo tài khoản ở thẻ *Đăng ký sinh viên*.

**Cấu hình** (biến môi trường, đều có giá trị mặc định khớp XAMPP):

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `PORT` | `8080` | Cổng website |
| `DB_HOST` / `DB_PORT` | `127.0.0.1` / `3306` | Địa chỉ MySQL |
| `DB_USER` / `DB_PASS` | `root` / *(trống)* | Tài khoản MySQL |
| `DB_NAME` | `web_day_hoc_cpp` | Tên CSDL |
| `CHAM_CUNG_LUC` | `4` | Số bài được chấm cùng lúc |

Ví dụ PowerShell: `$env:PORT=3000; node server.mjs`.

Có thể xem dữ liệu bằng phpMyAdmin của XAMPP (cần Start thêm Apache): <http://localhost/phpmyadmin> → CSDL `web_day_hoc_cpp`.

Trong phòng máy, các máy cùng mạng LAN truy cập `http://<IP máy chủ>:8080` (cho phép Node.js qua tường lửa).

## Cấu trúc thư mục

```
server.mjs                Máy chủ Node.js: phục vụ trang web, chuyển /api/... cho server/api.mjs
server/api.mjs            Các API: đăng nhập, làm bài, nộp bài, quản lý bài tập, bảng điểm, quản trị
server/db.mjs             Kết nối MySQL (pool mysql2), hàm truy vấn và giao dịch
server/phien.mjs          Phiên đăng nhập (cookie HttpOnly, lưu trong bảng phien_dang_nhap)
server/mat-khau.mjs       Băm mật khẩu bằng scrypt
server/harness.mjs        Lõi chấm: tạo gói (main.cpp, in1..in5, script compile/run), so khớp output, tính điểm
server/chay-tren-may.mjs  Chạy gói chấm bằng g++ + bash, hàng đợi giới hạn số bài chấm cùng lúc
server/khoi-tao.mjs       Lệnh npm run khoi-tao: chạy database/*.sql
database/schema.sql       Tạo CSDL và 8 bảng
database/du-lieu-mau.sql  6 chương, 2 tài khoản mẫu, 12 bài tập (60 bộ test), danh sách giao bài
index.html                Trang chủ
chuong.html               Trang chương (nội dung vẽ từ js/data/chuong-N.js theo ?c=N)
thuc-hanh.html            Phòng thực hành
css/style.css             Giao diện
js/site.js                Phần dùng chung: danh sách chương, header, menu, footer
js/home.js                Trang chủ
js/chuong.js              Trang chương
js/thuc-hanh.js           Phòng thực hành: đăng nhập, làm bài, kết quả, tạo bài, chấm điểm, quản trị
js/data/chuong-1..6.js    Bài giảng và 48 bài tập có lời giải
```

## Lưu ý

- Mật khẩu được băm (scrypt), truy vấn dùng tham số (chống SQL injection), mỗi API kiểm tra vai trò trên máy chủ.
- Trình duyệt không tải được mã nguồn máy chủ, file `.sql` và `node_modules` (máy chủ trả 403).
- Mã nguồn sinh viên được biên dịch và chạy trực tiếp trên máy chủ (chưa cách ly) — chỉ nên dùng trong môi trường tin cậy như phòng máy, lớp học.
