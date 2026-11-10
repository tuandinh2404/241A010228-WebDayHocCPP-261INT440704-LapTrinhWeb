// ngan-hang.js — ngân hàng bài tập MẪU của phòng thực hành (mức Dễ / Trung bình / Khó, mỗi bài 5 bộ test).
// Giáo viên thêm / sửa / xóa bài ở mục "Tạo bài tập"; thay đổi được lưu trong localStorage của trình duyệt.
// File này chỉ là dữ liệu ban đầu (và dùng lại khi bấm "Khôi phục bài mẫu").
// Output của mọi test được sinh bằng cách chạy lời giải mẫu C++ qua chính bộ chấm; lời giải mẫu không đưa lên web.

window.NGAN_HANG_MAU = [
  {
    "id": "nh-01",
    "chuong": 1,
    "muc": "de",
    "tieuDe": "Tổng hai số",
    "deBai": "Nhập hai số nguyên a và b (|a|, |b| ≤ 10^12) trên một dòng. In ra tổng a + b.",
    "tests": [
      {
        "input": "3 5",
        "output": "8"
      },
      {
        "input": "-7 2",
        "output": "-5"
      },
      {
        "input": "0 0",
        "output": "0"
      },
      {
        "input": "1000000000000 1000000000000",
        "output": "2000000000000"
      },
      {
        "input": "-15 -20",
        "output": "-35"
      }
    ]
  },
  {
    "id": "nh-02",
    "chuong": 2,
    "muc": "de",
    "tieuDe": "Số lớn nhất trong ba số",
    "deBai": "Nhập ba số nguyên a, b, c trên một dòng. In ra số lớn nhất.",
    "tests": [
      {
        "input": "1 2 3",
        "output": "3"
      },
      {
        "input": "9 4 7",
        "output": "9"
      },
      {
        "input": "-5 -2 -9",
        "output": "-2"
      },
      {
        "input": "6 6 1",
        "output": "6"
      },
      {
        "input": "0 -1 0",
        "output": "0"
      }
    ]
  },
  {
    "id": "nh-03",
    "chuong": 2,
    "muc": "de",
    "tieuDe": "Giai thừa",
    "deBai": "Nhập số nguyên n (0 ≤ n ≤ 20). In ra n! (quy ước 0! = 1). Gợi ý: dùng kiểu `long long`.",
    "tests": [
      {
        "input": "5",
        "output": "120"
      },
      {
        "input": "0",
        "output": "1"
      },
      {
        "input": "1",
        "output": "1"
      },
      {
        "input": "10",
        "output": "3628800"
      },
      {
        "input": "20",
        "output": "2432902008176640000"
      }
    ]
  },
  {
    "id": "nh-04",
    "chuong": 3,
    "muc": "de",
    "tieuDe": "Đếm chữ số",
    "deBai": "Nhập số nguyên n (|n| ≤ 10^18). In ra số chữ số của n (không tính dấu trừ).",
    "tests": [
      {
        "input": "12345",
        "output": "5"
      },
      {
        "input": "0",
        "output": "1"
      },
      {
        "input": "-907",
        "output": "3"
      },
      {
        "input": "1000000000000000000",
        "output": "19"
      },
      {
        "input": "7",
        "output": "1"
      }
    ]
  },
  {
    "id": "nh-05",
    "chuong": 2,
    "muc": "tb",
    "tieuDe": "Tổng các số nguyên tố",
    "deBai": "Nhập số nguyên n (1 ≤ n ≤ 100000). In ra tổng các số nguyên tố không vượt quá n.",
    "tests": [
      {
        "input": "10",
        "output": "17"
      },
      {
        "input": "1",
        "output": "0"
      },
      {
        "input": "2",
        "output": "2"
      },
      {
        "input": "100",
        "output": "1060"
      },
      {
        "input": "100000",
        "output": "454396537"
      }
    ]
  },
  {
    "id": "nh-06",
    "chuong": 3,
    "muc": "tb",
    "tieuDe": "Đảo ngược chuỗi",
    "deBai": "Nhập một dòng chữ (có thể có dấu cách). In ra dòng đó theo thứ tự ký tự ngược lại.",
    "tests": [
      {
        "input": "hello",
        "output": "olleh"
      },
      {
        "input": "Cpp la so 1",
        "output": "1 os al ppC"
      },
      {
        "input": "a",
        "output": "a"
      },
      {
        "input": "racecar",
        "output": "racecar"
      },
      {
        "input": "12 34 56",
        "output": "65 43 21"
      }
    ]
  },
  {
    "id": "nh-07",
    "chuong": 6,
    "muc": "tb",
    "tieuDe": "Phần tử lớn thứ hai",
    "deBai": "Dòng đầu là n (1 ≤ n ≤ 1000), dòng sau là n số nguyên. In ra giá trị lớn thứ hai trong các giá trị KHÁC NHAU; nếu không có, in KHONG CO.",
    "tests": [
      {
        "input": "5\n3 9 1 9 7",
        "output": "7"
      },
      {
        "input": "1\n4",
        "output": "KHONG CO"
      },
      {
        "input": "3\n5 5 5",
        "output": "KHONG CO"
      },
      {
        "input": "4\n-1 -8 -3 -2",
        "output": "-2"
      },
      {
        "input": "6\n10 20 30 40 50 60",
        "output": "50"
      }
    ]
  },
  {
    "id": "nh-08",
    "chuong": 3,
    "muc": "tb",
    "tieuDe": "Đếm từ",
    "deBai": "Nhập một dòng chữ. In ra số từ trong dòng (các từ cách nhau bởi một hoặc nhiều dấu cách; dòng có thể có dấu cách ở đầu và cuối).",
    "tests": [
      {
        "input": "Hoc lap trinh C++",
        "output": "4"
      },
      {
        "input": "  nhieu   dau   cach  ",
        "output": "3"
      },
      {
        "input": "mot",
        "output": "1"
      },
      {
        "input": "a b c d e f g",
        "output": "7"
      },
      {
        "input": "Xin chao cac ban",
        "output": "4"
      }
    ]
  },
  {
    "id": "nh-09",
    "chuong": 2,
    "muc": "kho",
    "tieuDe": "Fibonacci lớn",
    "deBai": "Nhập n (1 ≤ n ≤ 10^6). Với F(1) = F(2) = 1 và F(k) = F(k-1) + F(k-2), in ra F(n) chia lấy dư cho 1000000007.",
    "tests": [
      {
        "input": "1",
        "output": "1"
      },
      {
        "input": "2",
        "output": "1"
      },
      {
        "input": "10",
        "output": "55"
      },
      {
        "input": "90",
        "output": "210345902"
      },
      {
        "input": "1000000",
        "output": "918091266"
      }
    ]
  },
  {
    "id": "nh-10",
    "chuong": 3,
    "muc": "kho",
    "tieuDe": "Chuỗi con đối xứng dài nhất",
    "deBai": "Nhập một chuỗi s gồm chữ thường, không có dấu cách (1 ≤ độ dài ≤ 1000). In ra độ dài của chuỗi con liên tiếp đối xứng dài nhất trong s.",
    "tests": [
      {
        "input": "babad",
        "output": "3"
      },
      {
        "input": "cbbd",
        "output": "2"
      },
      {
        "input": "a",
        "output": "1"
      },
      {
        "input": "abacdfgdcaba",
        "output": "3"
      },
      {
        "input": "aaaaaaaaaa",
        "output": "10"
      }
    ]
  },
  {
    "id": "nh-11",
    "chuong": 5,
    "muc": "kho",
    "tieuDe": "Sinh viên điểm cao nhất",
    "deBai": "Dòng đầu là n (1 ≤ n ≤ 100). Mỗi dòng sau gồm tên (một từ, không dấu) và điểm (số thực, dùng dấu chấm). Dòng 1 in tên sinh viên có điểm cao nhất (nếu bằng nhau, lấy người nhập trước). Dòng 2 in điểm trung bình của lớp với đúng 2 chữ số thập phân.",
    "tests": [
      {
        "input": "3\nAn 7.5\nBinh 9\nChi 8.25",
        "output": "Binh\n8.25"
      },
      {
        "input": "1\nDung 10",
        "output": "Dung\n10.00"
      },
      {
        "input": "4\nHa 6\nKhoa 8\nLan 8\nMinh 5.6",
        "output": "Khoa\n6.90"
      },
      {
        "input": "2\nNam 0\nOanh 0",
        "output": "Nam\n0.00"
      },
      {
        "input": "5\nP 9.9\nQ 9.95\nR 9.95\nS 3\nT 4.1",
        "output": "Q\n7.38"
      }
    ]
  },
  {
    "id": "nh-12",
    "chuong": 6,
    "muc": "kho",
    "tieuDe": "Tần suất từ",
    "deBai": "Nhập một dòng gồm các từ viết thường cách nhau bởi dấu cách. Với mỗi từ khác nhau, in một dòng gồm từ đó và số lần xuất hiện, cách nhau một dấu cách. Sắp xếp theo số lần giảm dần; nếu bằng nhau thì theo thứ tự từ điển tăng dần.",
    "tests": [
      {
        "input": "cpp la cpp",
        "output": "cpp 2\nla 1"
      },
      {
        "input": "b a c",
        "output": "a 1\nb 1\nc 1"
      },
      {
        "input": "mot hai ba hai ba ba",
        "output": "ba 3\nhai 2\nmot 1"
      },
      {
        "input": "x",
        "output": "x 1"
      },
      {
        "input": "the cat and the hat and the bat",
        "output": "the 3\nand 2\nbat 1\ncat 1\nhat 1"
      }
    ]
  }
];

// Bài giáo viên giao sẵn cho 2 phần (id trong ngân hàng ở trên)
window.GIAO_MAU = {
  kiemTra: ["nh-01","nh-02","nh-03","nh-04","nh-05","nh-06","nh-07","nh-08"],
  thi: ["nh-05","nh-06","nh-07","nh-08","nh-09","nh-10","nh-11","nh-12"],
};
