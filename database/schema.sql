-- schema.sql — Cấu trúc cơ sở dữ liệu của "Web dạy học C++" (MySQL / MariaDB của XAMPP).
-- Chạy được nhiều lần: dùng IF NOT EXISTS nên không xóa dữ liệu đã có.
-- Nạp bằng phpMyAdmin (tab Import) hoặc lệnh: npm run khoi-tao

CREATE DATABASE IF NOT EXISTS web_day_hoc_cpp
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;  -- utf8mb4: lưu đúng tiếng Việt có dấu
USE web_day_hoc_cpp;

-- Tài khoản của cả 3 vai trò. Sinh viên đăng nhập bằng MSSV (ten_dang_nhap = ma_sv).
CREATE TABLE IF NOT EXISTS tai_khoan (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  ten_dang_nhap  VARCHAR(50)  NOT NULL UNIQUE,
  mat_khau       VARCHAR(255) NOT NULL,               -- KHÔNG lưu mật khẩu gốc: "scrypt$muối$băm"
  ho_ten         VARCHAR(100) NOT NULL,
  vai_tro        ENUM('admin', 'giao_vien', 'sinh_vien') NOT NULL,
  ma_sv          VARCHAR(20)  NULL UNIQUE,            -- chỉ sinh viên có
  bi_khoa        TINYINT(1)   NOT NULL DEFAULT 0,     -- 1 = Admin đã khóa, không đăng nhập được
  tao_luc        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Phiên đăng nhập: trình duyệt giữ token trong cookie, máy chủ tra bảng này để biết ai đang gọi.
CREATE TABLE IF NOT EXISTS phien_dang_nhap (
  token          CHAR(64) PRIMARY KEY,                -- 32 byte ngẫu nhiên, viết dạng hex
  tai_khoan_id   INT      NOT NULL,
  het_han        DATETIME NOT NULL,
  FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6 chương của học phần (nội dung bài giảng vẫn nằm trong js/data/chuong-N.js).
CREATE TABLE IF NOT EXISTS chuong (
  so             TINYINT PRIMARY KEY,
  ten            VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Bài tập của phòng thực hành.
CREATE TABLE IF NOT EXISTS bai_tap (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  tieu_de        VARCHAR(120) NOT NULL,
  chuong         TINYINT      NOT NULL,
  muc            ENUM('de', 'tb', 'kho') NOT NULL,     -- Dễ / Trung bình / Khó
  de_bai         TEXT         NOT NULL,
  nguoi_tao      INT          NULL,                    -- giáo viên tạo bài (NULL nếu tài khoản đã bị xóa)
  tao_luc        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cap_nhat_luc   DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chuong)    REFERENCES chuong(so),
  FOREIGN KEY (nguoi_tao) REFERENCES tai_khoan(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Bộ test của từng bài (thường 5 bộ, mỗi bộ đúng = 2 điểm). Test thứ 1 là ví dụ công khai, còn lại ẩn.
CREATE TABLE IF NOT EXISTS bo_test (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  bai_tap_id     INT     NOT NULL,
  thu_tu         TINYINT NOT NULL,
  input          TEXT    NOT NULL,
  output         TEXT    NOT NULL,
  UNIQUE (bai_tap_id, thu_tu),
  FOREIGN KEY (bai_tap_id) REFERENCES bai_tap(id) ON DELETE CASCADE   -- xóa bài thì xóa luôn bộ test
) ENGINE=InnoDB;

-- Bài được giao cho phần Kiểm tra / Thi (một bài có thể nằm ở cả hai phần → quan hệ nhiều – nhiều).
CREATE TABLE IF NOT EXISTS giao_bai (
  bai_tap_id     INT NOT NULL,
  phan           ENUM('kiemtra', 'thi') NOT NULL,
  PRIMARY KEY (bai_tap_id, phan),
  FOREIGN KEY (bai_tap_id) REFERENCES bai_tap(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Mỗi lần sinh viên bấm Nộp bài là một lượt nộp. Điểm: Kiểm tra = điểm bài; Thi = trung bình các bài (thang 10).
CREATE TABLE IF NOT EXISTS luot_nop (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  tai_khoan_id   INT          NOT NULL,
  phan           ENUM('kiemtra', 'thi') NOT NULL,
  diem           DECIMAL(4,2) NOT NULL,
  nop_luc        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (nop_luc),
  FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Kết quả từng bài trong một lượt nộp (Thi có 2–3 bài). Lưu cả tên bài và mã nguồn để xem lại về sau.
CREATE TABLE IF NOT EXISTS ket_qua_bai (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  luot_nop_id    INT          NOT NULL,
  bai_tap_id     INT          NULL,                    -- NULL nếu bài đã bị xóa, bảng điểm vẫn còn tên bài
  tieu_de        VARCHAR(120) NOT NULL,
  diem           TINYINT      NOT NULL,                -- 2 × số test đúng
  toi_da         TINYINT      NOT NULL,                -- 2 × số test
  ma_nguon       MEDIUMTEXT   NOT NULL,
  FOREIGN KEY (luot_nop_id) REFERENCES luot_nop(id) ON DELETE CASCADE,
  FOREIGN KEY (bai_tap_id)  REFERENCES bai_tap(id)  ON DELETE SET NULL
) ENGINE=InnoDB;
