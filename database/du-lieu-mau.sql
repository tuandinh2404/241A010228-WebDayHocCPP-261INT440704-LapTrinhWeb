-- du-lieu-mau.sql — dữ liệu mẫu (tự sinh từ js/data/ngan-hang.js). Chạy SAU schema.sql.
-- Dùng INSERT IGNORE nên chạy lại nhiều lần không bị trùng.
USE web_day_hoc_cpp;

-- 6 chương
INSERT IGNORE INTO chuong (so, ten) VALUES
  (1, 'Tổng quan C++ & cú pháp cơ bản'),
  (2, 'Cấu trúc điều khiển & hàm'),
  (3, 'Mảng, chuỗi & vector'),
  (4, 'Con trỏ & bộ nhớ động'),
  (5, 'Lập trình hướng đối tượng'),
  (6, 'STL & xử lý ngoại lệ');

-- Tài khoản mẫu (mật khẩu đã băm scrypt). Đổi mật khẩu sau khi đăng nhập lần đầu!
--   admin    / Admin@123     (Quản trị viên)
--   giaovien / GiaoVien@123  (Giáo viên mẫu)
INSERT IGNORE INTO tai_khoan (id, ten_dang_nhap, mat_khau, ho_ten, vai_tro) VALUES
  (1, 'admin', 'scrypt$d87b55f3dc28e38ffd329b6cf0b22e1f$4a1319c6231408ca0fff53c29905987f12028577bc77e10548837f084ca341f83ffe193a51c1bd83bc0d7215093d252e248ce655e54184ea426d773f4927f950', 'Quản trị viên', 'admin'),
  (2, 'giaovien', 'scrypt$330c6fd0096968236a4235666e17c129$620eecc804caa8f539fba93b321e931a7dae3e67a00448d48cae647301ddf3818cdacc112b7fae28db7247f3eb55ad2556b2f96c7ff2986ef61ab52861bb1eb7', 'Giáo viên mẫu', 'giao_vien');

-- 12 bài tập mẫu (người tạo: giáo viên mẫu)
INSERT IGNORE INTO bai_tap (id, tieu_de, chuong, muc, de_bai, nguoi_tao) VALUES
  (1, 'Tổng hai số', 1, 'de', 'Nhập hai số nguyên a và b (|a|, |b| ≤ 10^12) trên một dòng. In ra tổng a + b.', 2),
  (2, 'Số lớn nhất trong ba số', 2, 'de', 'Nhập ba số nguyên a, b, c trên một dòng. In ra số lớn nhất.', 2),
  (3, 'Giai thừa', 2, 'de', 'Nhập số nguyên n (0 ≤ n ≤ 20). In ra n! (quy ước 0! = 1). Gợi ý: dùng kiểu `long long`.', 2),
  (4, 'Đếm chữ số', 3, 'de', 'Nhập số nguyên n (|n| ≤ 10^18). In ra số chữ số của n (không tính dấu trừ).', 2),
  (5, 'Tổng các số nguyên tố', 2, 'tb', 'Nhập số nguyên n (1 ≤ n ≤ 100000). In ra tổng các số nguyên tố không vượt quá n.', 2),
  (6, 'Đảo ngược chuỗi', 3, 'tb', 'Nhập một dòng chữ (có thể có dấu cách). In ra dòng đó theo thứ tự ký tự ngược lại.', 2),
  (7, 'Phần tử lớn thứ hai', 6, 'tb', 'Dòng đầu là n (1 ≤ n ≤ 1000), dòng sau là n số nguyên. In ra giá trị lớn thứ hai trong các giá trị KHÁC NHAU; nếu không có, in KHONG CO.', 2),
  (8, 'Đếm từ', 3, 'tb', 'Nhập một dòng chữ. In ra số từ trong dòng (các từ cách nhau bởi một hoặc nhiều dấu cách; dòng có thể có dấu cách ở đầu và cuối).', 2),
  (9, 'Fibonacci lớn', 2, 'kho', 'Nhập n (1 ≤ n ≤ 10^6). Với F(1) = F(2) = 1 và F(k) = F(k-1) + F(k-2), in ra F(n) chia lấy dư cho 1000000007.', 2),
  (10, 'Chuỗi con đối xứng dài nhất', 3, 'kho', 'Nhập một chuỗi s gồm chữ thường, không có dấu cách (1 ≤ độ dài ≤ 1000). In ra độ dài của chuỗi con liên tiếp đối xứng dài nhất trong s.', 2),
  (11, 'Sinh viên điểm cao nhất', 5, 'kho', 'Dòng đầu là n (1 ≤ n ≤ 100). Mỗi dòng sau gồm tên (một từ, không dấu) và điểm (số thực, dùng dấu chấm). Dòng 1 in tên sinh viên có điểm cao nhất (nếu bằng nhau, lấy người nhập trước). Dòng 2 in điểm trung bình của lớp với đúng 2 chữ số thập phân.', 2),
  (12, 'Tần suất từ', 6, 'kho', 'Nhập một dòng gồm các từ viết thường cách nhau bởi dấu cách. Với mỗi từ khác nhau, in một dòng gồm từ đó và số lần xuất hiện, cách nhau một dấu cách. Sắp xếp theo số lần giảm dần; nếu bằng nhau thì theo thứ tự từ điển tăng dần.', 2);

-- Bộ test (5 bộ mỗi bài)
INSERT IGNORE INTO bo_test (bai_tap_id, thu_tu, input, output) VALUES
  (1, 1, '3 5', '8'),
  (1, 2, '-7 2', '-5'),
  (1, 3, '0 0', '0'),
  (1, 4, '1000000000000 1000000000000', '2000000000000'),
  (1, 5, '-15 -20', '-35'),
  (2, 1, '1 2 3', '3'),
  (2, 2, '9 4 7', '9'),
  (2, 3, '-5 -2 -9', '-2'),
  (2, 4, '6 6 1', '6'),
  (2, 5, '0 -1 0', '0'),
  (3, 1, '5', '120'),
  (3, 2, '0', '1'),
  (3, 3, '1', '1'),
  (3, 4, '10', '3628800'),
  (3, 5, '20', '2432902008176640000'),
  (4, 1, '12345', '5'),
  (4, 2, '0', '1'),
  (4, 3, '-907', '3'),
  (4, 4, '1000000000000000000', '19'),
  (4, 5, '7', '1'),
  (5, 1, '10', '17'),
  (5, 2, '1', '0'),
  (5, 3, '2', '2'),
  (5, 4, '100', '1060'),
  (5, 5, '100000', '454396537'),
  (6, 1, 'hello', 'olleh'),
  (6, 2, 'Cpp la so 1', '1 os al ppC'),
  (6, 3, 'a', 'a'),
  (6, 4, 'racecar', 'racecar'),
  (6, 5, '12 34 56', '65 43 21'),
  (7, 1, '5\n3 9 1 9 7', '7'),
  (7, 2, '1\n4', 'KHONG CO'),
  (7, 3, '3\n5 5 5', 'KHONG CO'),
  (7, 4, '4\n-1 -8 -3 -2', '-2'),
  (7, 5, '6\n10 20 30 40 50 60', '50'),
  (8, 1, 'Hoc lap trinh C++', '4'),
  (8, 2, '  nhieu   dau   cach  ', '3'),
  (8, 3, 'mot', '1'),
  (8, 4, 'a b c d e f g', '7'),
  (8, 5, 'Xin chao cac ban', '4'),
  (9, 1, '1', '1'),
  (9, 2, '2', '1'),
  (9, 3, '10', '55'),
  (9, 4, '90', '210345902'),
  (9, 5, '1000000', '918091266'),
  (10, 1, 'babad', '3'),
  (10, 2, 'cbbd', '2'),
  (10, 3, 'a', '1'),
  (10, 4, 'abacdfgdcaba', '3'),
  (10, 5, 'aaaaaaaaaa', '10'),
  (11, 1, '3\nAn 7.5\nBinh 9\nChi 8.25', 'Binh\n8.25'),
  (11, 2, '1\nDung 10', 'Dung\n10.00'),
  (11, 3, '4\nHa 6\nKhoa 8\nLan 8\nMinh 5.6', 'Khoa\n6.90'),
  (11, 4, '2\nNam 0\nOanh 0', 'Nam\n0.00'),
  (11, 5, '5\nP 9.9\nQ 9.95\nR 9.95\nS 3\nT 4.1', 'Q\n7.38'),
  (12, 1, 'cpp la cpp', 'cpp 2\nla 1'),
  (12, 2, 'b a c', 'a 1\nb 1\nc 1'),
  (12, 3, 'mot hai ba hai ba ba', 'ba 3\nhai 2\nmot 1'),
  (12, 4, 'x', 'x 1'),
  (12, 5, 'the cat and the hat and the bat', 'the 3\nand 2\nbat 1\ncat 1\nhat 1');

-- Bài giao sẵn cho 2 phần
INSERT IGNORE INTO giao_bai (bai_tap_id, phan) VALUES
  (1, 'kiemtra'),
  (2, 'kiemtra'),
  (3, 'kiemtra'),
  (4, 'kiemtra'),
  (5, 'kiemtra'),
  (6, 'kiemtra'),
  (7, 'kiemtra'),
  (8, 'kiemtra'),
  (5, 'thi'),
  (6, 'thi'),
  (7, 'thi'),
  (8, 'thi'),
  (9, 'thi'),
  (10, 'thi'),
  (11, 'thi'),
  (12, 'thi');
