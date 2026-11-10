window.CHUONG = window.CHUONG || {};
window.CHUONG[1] = {
  so: 1,
  ten: "Tổng quan C++ & cú pháp cơ bản",
  tomTat: "Hiểu một tệp `.cpp` trở thành chương trình chạy được như thế nào, nắm cấu trúc của một chương trình C++, cách khai báo biến, hằng, ép kiểu, dùng toán tử và nhập xuất dữ liệu bằng `cin`, `cout` cùng các công cụ định dạng trong `<iomanip>`.",
  baiGiang: [
    {
      id: "c1-l1",
      tieuDe: "C++ là gì và chương trình được dịch ra sao",
      noiDung: [
        { loai: "p", text: "C++ là ngôn ngữ lập trình do Bjarne Stroustrup phát triển tại Bell Labs từ năm 1979, ban đầu có tên \"C with Classes\". C++ kế thừa gần như toàn bộ ngôn ngữ C và bổ sung thêm lập trình hướng đối tượng, khuôn mẫu (template) và một thư viện chuẩn rất mạnh. Đến nay C++ vẫn được dùng rộng rãi ở những nơi cần tốc độ cao và kiểm soát tài nguyên chặt chẽ: trò chơi điện tử, trình duyệt web, hệ điều hành, phần mềm nhúng, và đặc biệt là trong các kỳ thi lập trình thi đấu. Ngôn ngữ được chuẩn hóa qua nhiều phiên bản như C++98, C++11, C++14, **C++17**, C++20; trong môn học này chúng ta dùng chuẩn C++17." },
        { loai: "p", text: "C++ là ngôn ngữ **biên dịch**: mã nguồn bạn viết (tệp `.cpp`) không chạy trực tiếp, mà phải được một chương trình gọi là trình biên dịch (compiler) dịch ra mã máy. Trình biên dịch phổ biến nhất là `g++` thuộc bộ GCC. Khi bạn gõ một lệnh `g++`, thực ra có nhiều giai đoạn diễn ra liên tiếp, và hiểu các giai đoạn này giúp bạn đọc được thông báo lỗi chính xác hơn." },
        { loai: "table", head: ["Giai đoạn", "Đầu vào → đầu ra", "Việc chính"], rows: [
          ["Tiền xử lý (preprocessing)", "`main.cpp` → mã nguồn đã mở rộng", "Xử lý các dòng bắt đầu bằng `#`: chép nội dung tệp tiêu đề vào chỗ `#include`, thay thế macro, bỏ chú thích."],
          ["Biên dịch (compiling)", "mã đã mở rộng → tệp đối tượng `main.o`", "Kiểm tra cú pháp, kiểu dữ liệu rồi dịch sang mã máy. Phần lớn lỗi bạn gặp xuất hiện ở đây."],
          ["Liên kết (linking)", "`main.o` + thư viện → `main.exe`", "Ghép các tệp đối tượng với mã của thư viện chuẩn (ví dụ phần cài đặt của `cout`) thành một tệp chạy hoàn chỉnh."]
        ] },
        { loai: "p", text: "Sau khi liên kết xong, hệ điều hành có thể nạp tệp chạy vào bộ nhớ và thực thi. Vì kết quả là mã máy của một hệ điều hành cụ thể, tệp `main.exe` dịch trên Windows sẽ không chạy được trên Linux; muốn chạy ở Linux bạn phải dịch lại mã nguồn ở đó. Đổi lại, chương trình C++ chạy rất nhanh vì không cần máy ảo trung gian. Dưới đây là chương trình đầu tiên và lệnh để dịch, chạy nó trong cửa sổ dòng lệnh." },
        { loai: "code", text: `// hello.cpp - chương trình C++ đầu tiên
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;   // In ra: Hello, C++!
    return 0;
}` },
        { loai: "code", text: `g++ -std=c++17 -Wall hello.cpp -o hello
./hello` },
        { loai: "list", items: [
          "`-std=c++17`: yêu cầu trình biên dịch dùng chuẩn C++17.",
          "`-Wall`: bật các cảnh báo thường gặp, giúp phát hiện lỗi tiềm ẩn sớm.",
          "`-o hello`: đặt tên cho tệp chạy được tạo ra (trên Windows sẽ là `hello.exe`)."
        ] },
        { loai: "note", text: "Hãy phân biệt ba loại lỗi: **lỗi biên dịch** (sai cú pháp, sai kiểu, chương trình không được tạo ra), **lỗi liên kết** (gọi một hàm có khai báo nhưng không có định nghĩa) và **lỗi khi chạy** (chương trình dịch được nhưng chạy sai hoặc bị dừng đột ngột)." }
      ]
    },
    {
      id: "c1-l2",
      tieuDe: "Cấu trúc một chương trình C++",
      noiDung: [
        { loai: "p", text: "Mọi chương trình C++ bạn viết trong môn học đều có chung một bộ khung. Hãy xem chương trình nhỏ dưới đây, nó tính và in ra tổng của hai số, rồi chúng ta sẽ đi qua từng dòng." },
        { loai: "code", text: `#include <iostream>      // nạp thư viện nhập xuất
using namespace std;     // dùng tên trong không gian tên std

// Hàm main: nơi chương trình bắt đầu chạy
int main() {
    int a = 7;
    int b = 5;
    int tong = a + b;
    cout << "Tong = " << tong << endl;   // In ra: Tong = 12
    return 0;                            // báo cho hệ điều hành: chạy thành công
}` },
        { loai: "list", items: [
          "`#include <iostream>` là một **chỉ thị tiền xử lý**. Nó yêu cầu chép phần khai báo của thư viện `iostream` vào chương trình để ta dùng được `cin` và `cout`. Mỗi nhóm chức năng nằm trong một tệp tiêu đề riêng: `<cmath>` cho hàm toán học, `<string>` cho chuỗi, `<iomanip>` cho định dạng.",
          "`using namespace std;` cho phép viết `cout` thay vì tên đầy đủ `std::cout`. Mọi thứ trong thư viện chuẩn đều nằm trong không gian tên `std`.",
          "`int main()` là **hàm chính**. Chương trình luôn bắt đầu chạy từ dòng đầu tiên trong cặp ngoặc nhọn của `main` và kết thúc khi `main` kết thúc. Mỗi chương trình có đúng một hàm `main`.",
          "`return 0;` trả giá trị 0 cho hệ điều hành, theo quy ước nghĩa là chương trình kết thúc bình thường. Giá trị khác 0 thường báo có lỗi.",
          "Chú thích một dòng bắt đầu bằng `//`, chú thích nhiều dòng đặt giữa `/*` và `*/`. Trình biên dịch bỏ qua chú thích."
        ] },
        { loai: "p", text: "Mỗi **câu lệnh** trong C++ kết thúc bằng dấu chấm phẩy `;`. Các câu lệnh được gom thành **khối** bằng cặp ngoặc nhọn `{ }`. C++ không quan tâm đến việc xuống dòng hay thụt lề, nhưng bạn vẫn nên thụt lề 4 khoảng trắng cho mỗi cấp khối để chương trình dễ đọc. C++ cũng **phân biệt chữ hoa chữ thường**: `Main`, `MAIN` và `main` là ba tên khác nhau, và chỉ `main` mới là hàm chính." },
        { loai: "p", text: "Một thói quen tốt ngay từ đầu là đặt tên biến có nghĩa (`tong`, `diemTB`, `soLuong`) thay vì `x1`, `x2`. Tên biến chỉ gồm chữ cái tiếng Anh, chữ số và dấu gạch dưới, không được bắt đầu bằng chữ số và không được trùng với từ khóa như `int`, `return`, `if`." },
        { loai: "note", text: "Lỗi hay gặp nhất của người mới là quên dấu `;` ở cuối câu lệnh. Trình biên dịch thường báo lỗi ở **dòng ngay sau** chỗ bị thiếu, vì vậy khi thấy lỗi khó hiểu hãy nhìn lên dòng phía trên." }
      ]
    },
    {
      id: "c1-l3",
      tieuDe: "Biến và các kiểu dữ liệu cơ bản",
      noiDung: [
        { loai: "p", text: "**Biến** là một vùng nhớ có tên, dùng để lưu giá trị trong lúc chương trình chạy. Trong C++, mọi biến phải được **khai báo kiểu** trước khi dùng, theo dạng `kiểu tên = giá_trị_ban_đầu;`. Kiểu dữ liệu quyết định biến chiếm bao nhiêu byte bộ nhớ, lưu được giá trị trong khoảng nào và những phép toán nào được phép thực hiện trên nó." },
        { loai: "table", head: ["Kiểu", "Kích thước thường gặp", "Ý nghĩa", "Ví dụ"], rows: [
          ["`int`", "4 byte", "Số nguyên, khoảng từ -2 147 483 648 đến 2 147 483 647 (cỡ 2·10^9)", "`int tuoi = 19;`"],
          ["`long long`", "8 byte", "Số nguyên lớn, cỡ ±9·10^18", "`long long dan = 8000000000LL;`"],
          ["`double`", "8 byte", "Số thực, khoảng 15 chữ số có nghĩa", "`double diem = 8.75;`"],
          ["`char`", "1 byte", "Một ký tự, viết trong nháy đơn", "`char xepLoai = 'A';`"],
          ["`bool`", "1 byte", "Giá trị logic `true` hoặc `false`", "`bool daQua = true;`"]
        ] },
        { loai: "p", text: "Toán tử `sizeof` cho biết số byte mà một kiểu hoặc một biến chiếm trong bộ nhớ. Kích thước của một số kiểu có thể khác nhau giữa các máy, nhưng với trình biên dịch `g++` trên máy tính 64 bit hiện nay, bạn sẽ thấy đúng các con số trong bảng trên." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    int soLuong = 25;
    long long danSo = 8000000000LL;   // 8 tỉ: vượt quá giới hạn của int
    double chieuCao = 1.72;
    char kyTu = 'C';
    bool laSinhVien = true;

    cout << soLuong << " " << danSo << " " << chieuCao << endl;  // 25 8000000000 1.72
    cout << kyTu << " " << laSinhVien << endl;                    // C 1   (true in ra là 1)
    cout << sizeof(int) << " " << sizeof(long long) << " "
         << sizeof(double) << " " << sizeof(char) << " "
         << sizeof(bool) << endl;                                  // 4 8 8 1 1
    return 0;
}` },
        { loai: "p", text: "Một điểm quan trọng: kiểu `char` thực chất lưu một **số nguyên nhỏ** là mã ASCII của ký tự. Chữ `'A'` có mã 65, `'a'` có mã 97, chữ số `'0'` có mã 48. Nhờ vậy ta có thể làm phép toán trên ký tự, ví dụ `'7' - '0'` cho ra số 7. Còn `bool` khi in bằng `cout` sẽ hiện `1` (đúng) hoặc `0` (sai)." },
        { loai: "p", text: "Mỗi kiểu số nguyên có giới hạn. Nếu kết quả phép tính vượt quá giới hạn, ta bị **tràn số** (overflow): giá trị thu được sai hoàn toàn mà chương trình không hề báo lỗi. Ví dụ `int x = 2000000000; x = x + x;` không cho ra 4 tỉ. Khi đề bài nói các số có thể lên đến 10^9 và cần cộng hay nhân chúng, hãy dùng `long long` ngay từ đầu." },
        { loai: "note", text: "Biến cục bộ khai báo mà chưa gán giá trị (`int x;`) sẽ chứa một giá trị rác không xác định. Hãy luôn khởi tạo biến khi khai báo, ví dụ `int tong = 0;`." }
      ]
    },
    {
      id: "c1-l4",
      tieuDe: "Hằng số và ép kiểu",
      noiDung: [
        { loai: "p", text: "Có những giá trị không bao giờ thay đổi trong suốt chương trình: số pi, số ngày trong tuần, mức lương cơ bản... Thay vì viết trực tiếp con số ở nhiều chỗ, ta khai báo chúng thành **hằng** bằng từ khóa `const`. Hằng phải được gán giá trị ngay khi khai báo, và mọi lệnh cố gắng thay đổi nó sẽ bị trình biên dịch báo lỗi. Dùng hằng giúp chương trình dễ đọc hơn (`SO_NGAY_TUAN` rõ nghĩa hơn số `7`) và dễ sửa hơn (chỉ đổi ở một chỗ). Theo thói quen, tên hằng thường viết in hoa." },
        { loai: "code", text: `const double PI = 3.14159265358979;
const int SO_NGAY_TUAN = 7;
// PI = 3.14;   // LỖI biên dịch: không được gán lại hằng` },
        { loai: "p", text: "**Ép kiểu** là chuyển một giá trị từ kiểu này sang kiểu khác. C++ tự động chuyển kiểu (ép kiểu ngầm) trong nhiều trường hợp: khi một biểu thức có cả `int` và `double`, số `int` được nâng lên `double` trước khi tính. Ngược lại, khi gán một số thực vào biến nguyên, phần thập phân bị **cắt bỏ** (không làm tròn): `int n = 3.99;` cho `n` bằng 3." },
        { loai: "p", text: "Khi muốn chủ động đổi kiểu, ta dùng `static_cast<kiểu_mới>(biểu_thức)`. Đây là cách ép kiểu được khuyến khích trong C++ vì nó rõ ràng và dễ tìm trong mã nguồn. Trường hợp dùng nhiều nhất là khi chia hai số nguyên mà muốn kết quả thực, ví dụ tính điểm trung bình. Bạn cũng có thể gặp cách viết kiểu C cũ là `(double)a`; nó vẫn chạy nhưng không nên dùng trong mã mới." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    const int SO_MON = 3;
    int tongDiem = 26;

    double sai = tongDiem / SO_MON;                        // chia nguyên trước rồi mới gán: 8
    double dung = static_cast<double>(tongDiem) / SO_MON;  // chia thực: 8.66667

    cout << sai << endl;    // 8
    cout << dung << endl;   // 8.66667

    double x = 7.8;
    int phanNguyen = static_cast<int>(x);   // cắt bỏ phần thập phân
    cout << phanNguyen << endl;             // 7

    char c = 'A';
    cout << static_cast<int>(c) << endl;        // 65 (mã ASCII của 'A')
    cout << static_cast<char>(c + 2) << endl;   // C
    return 0;
}` },
        { loai: "p", text: "Hãy để ý dòng tính biến `sai`. Dù biến nhận kết quả có kiểu `double`, phép chia `tongDiem / SO_MON` vẫn là chia hai số nguyên nên ra 8, rồi 8 mới được chuyển thành 8.0. Kiểu của biến bên trái dấu `=` không ảnh hưởng đến cách tính biểu thức bên phải." },
        { loai: "note", text: "Ép kiểu phải đặt vào **một toán hạng trước khi chia**: `static_cast<double>(a) / b` đúng, còn `static_cast<double>(a / b)` vẫn sai vì phép chia nguyên đã xảy ra bên trong ngoặc." }
      ]
    },
    {
      id: "c1-l5",
      tieuDe: "Toán tử",
      noiDung: [
        { loai: "p", text: "Toán tử là các ký hiệu dùng để tính toán trên giá trị. C++ có nhiều nhóm toán tử; bảng dưới đây tóm tắt những nhóm bạn sẽ dùng hằng ngày." },
        { loai: "table", head: ["Nhóm", "Toán tử", "Ví dụ (a = 17, b = 5)"], rows: [
          ["Số học", "`+  -  *  /  %`", "`a / b` là 3, `a % b` là 2"],
          ["Gán kết hợp", "`+=  -=  *=  /=  %=`", "`a += 3` tương đương `a = a + 3`"],
          ["So sánh", "`==  !=  <  >  <=  >=`", "`a > b` là `true`"],
          ["Logic", "`&&` (và), `||` (hoặc), `!` (phủ định)", "`a > 0 && b > 0` là `true`"],
          ["Tăng, giảm", "`++  --`", "`a++` làm `a` thành 18"]
        ] },
        { loai: "p", text: "Phép chia `/` cần đặc biệt chú ý: nếu **cả hai** toán hạng là số nguyên thì đó là **chia nguyên**, phần dư bị bỏ đi: `17 / 5` bằng 3. Chỉ cần một toán hạng là số thực thì phép chia là chia thực: `17.0 / 5` bằng 3.4. Toán tử `%` cho **phần dư** của phép chia nguyên và chỉ dùng với số nguyên: `17 % 5` bằng 2. Phép `%` rất hữu ích: `n % 2 == 0` kiểm tra số chẵn, `n % 10` lấy chữ số hàng đơn vị, `n / 10` bỏ đi chữ số cuối." },
        { loai: "p", text: "Toán tử so sánh trả về giá trị `bool`. Chú ý so sánh bằng là `==` (hai dấu bằng), còn `=` là phép gán. Toán tử logic `&&` chỉ đúng khi cả hai vế đúng, `||` đúng khi ít nhất một vế đúng. C++ tính theo kiểu **đoản mạch**: với `&&`, nếu vế trái đã sai thì vế phải không được tính nữa; với `||`, nếu vế trái đã đúng thì bỏ qua vế phải." },
        { loai: "p", text: "Toán tử `++` và `--` có hai dạng. Dạng **tiền tố** `++x` tăng `x` rồi mới dùng giá trị mới; dạng **hậu tố** `x++` dùng giá trị cũ rồi mới tăng. Khi đứng riêng một câu lệnh thì hai dạng như nhau, nhưng khi nằm trong biểu thức thì kết quả khác nhau. Về thứ tự ưu tiên: `* / %` được tính trước `+ -`, các phép so sánh tính sau phép số học, rồi đến `&&`, cuối cùng là `||`. Khi không chắc, hãy dùng ngoặc tròn." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    int a = 17, b = 5;
    cout << a / b << " " << a % b << endl;   // 3 2
    cout << 17.0 / 5 << endl;                // 3.4
    cout << -17 / 5 << " " << -17 % 5 << endl;   // -3 -2 (chia nguyên cắt về phía 0)

    int x = 10;
    int y = x++;   // y nhận 10, sau đó x thành 11
    int z = ++x;   // x thành 12, sau đó z nhận 12
    cout << x << " " << y << " " << z << endl;   // 12 10 12

    bool chan = (a % 2 == 0);
    bool trongKhoang = (a >= 10 && a <= 20);
    cout << chan << " " << trongKhoang << " " << !chan << endl;   // 0 1 1

    a += 3;   // a = 20
    a %= 7;   // a = 6
    cout << a << " " << 2 + 3 * 4 << " " << (2 + 3) * 4 << endl;   // 6 14 20
    return 0;
}` },
        { loai: "note", text: "Viết `if (x = 5)` thay cho `if (x == 5)` là lỗi kinh điển: biểu thức gán luôn cho giá trị 5 (khác 0, tức là đúng). Biên dịch với `-Wall` để trình biên dịch cảnh báo cho bạn." }
      ]
    },
    {
      id: "c1-l6",
      tieuDe: "Nhập xuất với cin và cout",
      noiDung: [
        { loai: "p", text: "Thư viện `<iostream>` cung cấp hai đối tượng chính: `cout` để in ra màn hình (luồng xuất chuẩn) và `cin` để đọc từ bàn phím (luồng nhập chuẩn). Toán tử `<<` đẩy dữ liệu **vào** `cout`, còn `>>` lấy dữ liệu **từ** `cin` ra biến. Bạn có thể nối nhiều toán tử liên tiếp trên một dòng: `cout << a << \" \" << b;` hay `cin >> a >> b;`." },
        { loai: "p", text: "Để xuống dòng, ta có hai cách: in `endl` hoặc in ký tự `'\\n'`. Cả hai đều xuống dòng, nhưng `endl` còn ép đẩy toàn bộ dữ liệu đang chờ ra màn hình ngay, nên chậm hơn khi in rất nhiều dòng. Với bài tập thông thường bạn dùng cách nào cũng được; khi in hàng trăm nghìn dòng, hãy dùng `'\\n'`." },
        { loai: "p", text: "Khi đọc bằng `cin >>`, chương trình tự động **bỏ qua các khoảng trắng** (dấu cách, tab, xuống dòng) đứng trước giá trị và dừng đọc khi gặp khoảng trắng tiếp theo. Vì thế dữ liệu `3 5` trên một dòng hay `3` và `5` trên hai dòng đều được đọc như nhau bởi `cin >> a >> b;`. Đây cũng là lý do `cin >>` chỉ đọc được **một từ** khi đọc chuỗi; cách đọc cả dòng có khoảng trắng bằng `getline` sẽ được học ở Chương 3." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    // Nhập: 2006 3.5 K
    int namSinh;
    double gioHoc;
    char lop;
    cin >> namSinh >> gioHoc >> lop;

    int tuoi = 2026 - namSinh;
    cout << "Tuoi: " << tuoi << '\\n';                   // Tuoi: 20
    cout << "Gio hoc moi tuan: " << gioHoc * 7 << '\\n'; // Gio hoc moi tuan: 24.5
    cout << "Lop: " << lop << endl;                     // Lop: K
    return 0;
}` },
        { loai: "p", text: "Trong các bài tập có chấm tự động, chương trình được chấm bằng cách so sánh **chính xác** phần in ra với đáp án. Vì vậy đừng in thêm lời nhắc như \"Moi ban nhap so:\" nếu đề không yêu cầu, và hãy in đúng định dạng: đúng số khoảng trắng giữa các giá trị, đúng số dòng. Một lời nhắc thừa cũng đủ làm bài bị chấm sai." },
        { loai: "list", items: [
          "`cin >> x` đọc một giá trị và bỏ qua khoảng trắng phía trước.",
          "`cout << x` in giá trị; `cout << x << \" \" << y` in hai giá trị cách nhau một dấu cách.",
          "Số thực in bằng `cout` mặc định hiển thị tối đa 6 chữ số có nghĩa: `8.666666...` hiện thành `8.66667`. Muốn in đúng số chữ số sau dấu chấm, xem phần tiếp theo."
        ] },
        { loai: "note", text: "Nếu bạn nhập một chữ vào biến `int`, `cin` rơi vào trạng thái lỗi và các lệnh đọc sau đó đều bị bỏ qua. Với bài tập chấm tự động, dữ liệu luôn đúng định dạng nên bạn không cần lo trường hợp này." }
      ]
    },
    {
      id: "c1-l7",
      tieuDe: "Định dạng đầu ra với <iomanip>",
      noiDung: [
        { loai: "p", text: "Rất nhiều bài tập yêu cầu in số thực với một số chữ số thập phân cố định, hoặc in bảng có các cột thẳng hàng. Thư viện `<iomanip>` cung cấp các **bộ điều khiển** (manipulator) để làm việc này. Bạn đặt chúng vào luồng `cout` giống như một giá trị bình thường." },
        { loai: "table", head: ["Bộ điều khiển", "Tác dụng", "Phạm vi"], rows: [
          ["`fixed`", "In số thực dạng thập phân thông thường (không dùng dạng `1e+06`)", "Giữ cho mọi lần in sau"],
          ["`setprecision(n)`", "Khi đi cùng `fixed`: in đúng `n` chữ số sau dấu chấm, có làm tròn", "Giữ cho mọi lần in sau"],
          ["`setw(n)`", "Dành `n` ô cho giá trị **kế tiếp**, mặc định căn phải", "Chỉ một giá trị"],
          ["`setfill(c)`", "Dùng ký tự `c` để lấp ô trống thay cho dấu cách", "Giữ cho mọi lần in sau"],
          ["`left`, `right`", "Căn trái hoặc căn phải trong ô của `setw`", "Giữ cho mọi lần in sau"]
        ] },
        { loai: "p", text: "Cặp `fixed` và `setprecision` đi với nhau gần như mọi lúc. Nếu chỉ dùng `setprecision(3)` mà không có `fixed`, con số 3 sẽ được hiểu là **tổng số chữ số có nghĩa** chứ không phải số chữ số sau dấu chấm, nên `12.3456` sẽ thành `12.3`. Một khi đã đặt `fixed << setprecision(2)`, mọi số thực in sau đó đều có 2 chữ số thập phân cho đến khi bạn đổi lại. Lưu ý số nguyên kiểu `int` không bị ảnh hưởng bởi `setprecision`." },
        { loai: "p", text: "Khác với các bộ điều khiển còn lại, `setw` chỉ có tác dụng với **đúng một** giá trị in ngay sau nó, nên khi in bảng bạn phải đặt `setw` trước mỗi cột. Kết hợp `setw(2)` với `setfill('0')` là cách quen thuộc để in giờ phút dạng `09:05`." },
        { loai: "code", text: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double x = 12.3456;
    cout << setprecision(3) << x << endl;           // 12.3   (3 chữ số có nghĩa)
    cout << fixed << setprecision(2) << x << endl;  // 12.35  (2 chữ số sau dấu chấm)
    cout << 5.0 << " " << 7 << endl;                // 5.00 7 (int không bị ảnh hưởng)

    // In bảng thẳng cột: tên rộng 8 ô căn trái, điểm rộng 6 ô căn phải
    cout << left << setw(8) << "An" << right << setw(6) << 8.5 << endl;    // An        8.50
    cout << left << setw(8) << "Binh" << right << setw(6) << 10.0 << endl; // Binh     10.00

    // In giờ dạng HH:MM
    int gio = 9, phut = 5;
    cout << setfill('0') << setw(2) << gio << ":" << setw(2) << phut << endl;  // 09:05
    return 0;
}` },
        { loai: "note", text: "Máy tính lưu số thực ở hệ nhị phân nên một số giá trị như `2.675` thực ra được lưu là `2.67499999...` và in với 2 chữ số sẽ ra `2.67`. Đây không phải lỗi của chương trình, mà là bản chất của số thực dấu phẩy động." }
      ]
    }
  ],
  baiTap: [
    {
      id: "c1-bt1",
      muc: 1,
      tieuDe: "Tổng hai số lớn",
      deBai: "Nhập hai số nguyên `a` và `b` (|a|, |b| ≤ 2·10^9) trên một dòng, cách nhau một dấu cách. In ra tổng `a + b`.",
      viDu: { input: "2000000000 2000000000", output: "4000000000" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    long long a, b;   // dùng long long vì tổng có thể vượt giới hạn int
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
      giaiThich: "Tổng hai số có thể lên đến 4·10^9, vượt quá giới hạn khoảng 2,1·10^9 của `int`, nên phải khai báo biến kiểu `long long` để không bị tràn số."
    },
    {
      id: "c1-bt2",
      muc: 1,
      tieuDe: "Chu vi và diện tích hình chữ nhật",
      deBai: "Nhập chiều dài `a` và chiều rộng `b` của một hình chữ nhật (số nguyên dương, không quá 10^4). In ra chu vi và diện tích trên cùng một dòng, cách nhau một dấu cách.",
      viDu: { input: "3 5", output: "16 15" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    int chuVi = 2 * (a + b);
    int dienTich = a * b;
    cout << chuVi << " " << dienTich << endl;
    return 0;
}`,
      giaiThich: "Áp dụng công thức chu vi `2 * (a + b)` và diện tích `a * b`. Chú ý ngoặc tròn để phép cộng được thực hiện trước phép nhân."
    },
    {
      id: "c1-bt3",
      muc: 2,
      tieuDe: "Chia nguyên và chia thực",
      deBai: "Nhập hai số nguyên dương `a` và `b`. Dòng thứ nhất in thương nguyên và số dư của phép chia `a` cho `b`, cách nhau một dấu cách. Dòng thứ hai in kết quả chia thực `a / b` với đúng 3 chữ số sau dấu chấm.",
      viDu: { input: "7 3", output: "2 1\n2.333" },
      loiGiai: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a / b << " " << a % b << endl;
    double thuong = static_cast<double>(a) / b;   // ép kiểu trước khi chia
    cout << fixed << setprecision(3) << thuong << endl;
    return 0;
}`,
      giaiThich: "Với hai số nguyên, `/` cho thương nguyên và `%` cho số dư. Để chia thực, ta ép `a` sang `double` bằng `static_cast` trước khi chia rồi in bằng `fixed << setprecision(3)`."
    },
    {
      id: "c1-bt4",
      muc: 2,
      tieuDe: "Điểm trung bình môn",
      deBai: "Nhập ba số thực là điểm chuyên cần, giữa kỳ và cuối kỳ của một sinh viên. In ra điểm trung bình cộng của ba điểm với đúng 2 chữ số sau dấu chấm.",
      viDu: { input: "7.5 8 9", output: "8.17" },
      loiGiai: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double cc, gk, ck;
    cin >> cc >> gk >> ck;
    double tb = (cc + gk + ck) / 3;
    cout << fixed << setprecision(2) << tb << endl;
    return 0;
}`,
      giaiThich: "Tổng ba điểm là 24.5, chia 3 được 8.1666..., làm tròn đến 2 chữ số là 8.17. Vì các biến là `double` nên phép chia cho 3 là chia thực."
    },
    {
      id: "c1-bt5",
      muc: 3,
      tieuDe: "Đảo ngược số có ba chữ số",
      deBai: "Nhập một số nguyên `n` có đúng ba chữ số (100 ≤ n ≤ 999). In ra số nhận được khi viết các chữ số của `n` theo thứ tự ngược lại. Nếu số đảo có chữ số 0 ở đầu thì in như một số bình thường (ví dụ 120 đảo thành 21).",
      viDu: { input: "472", output: "274" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int donVi = n % 10;        // chữ số hàng đơn vị
    int chuc = n / 10 % 10;    // chữ số hàng chục
    int tram = n / 100;        // chữ số hàng trăm
    int dao = donVi * 100 + chuc * 10 + tram;
    cout << dao << endl;
    return 0;
}`,
      giaiThich: "Tách từng chữ số bằng `%` và `/`: `n % 10` là hàng đơn vị, `n / 10 % 10` là hàng chục, `n / 100` là hàng trăm. Sau đó ghép lại theo thứ tự ngược bằng cách nhân với 100, 10 và 1; vì kết quả là một số nên chữ số 0 ở đầu tự biến mất."
    },
    {
      id: "c1-bt6",
      muc: 3,
      tieuDe: "Chia kẹo",
      deBai: "Có `n` viên kẹo chia đều cho `k` bạn (1 ≤ n ≤ 10^18, 1 ≤ k ≤ 10^9), mỗi bạn nhận số kẹo như nhau và nhiều nhất có thể. In ra số kẹo mỗi bạn nhận được và số kẹo còn dư, cách nhau một dấu cách.",
      viDu: { input: "1000000000000 7", output: "142857142857 1" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    long long n, k;
    cin >> n >> k;
    cout << n / k << " " << n % k << endl;
    return 0;
}`,
      giaiThich: "Số kẹo mỗi bạn là thương nguyên `n / k`, số dư là `n % k`. Vì `n` có thể lên đến 10^18, bắt buộc dùng `long long`; dùng `int` sẽ đọc sai ngay từ đầu."
    },
    {
      id: "c1-bt7",
      muc: 4,
      tieuDe: "Năm nhuận",
      deBai: "Một năm là năm nhuận nếu nó chia hết cho 400, hoặc chia hết cho 4 nhưng không chia hết cho 100. Nhập một năm `y` (1 ≤ y ≤ 10^9). In ra `1` nếu `y` là năm nhuận, ngược lại in `0`. Chỉ dùng toán tử, chưa dùng câu lệnh `if`.",
      viDu: { input: "2024", output: "1" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    int y;
    cin >> y;
    bool nhuan = (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
    cout << nhuan << endl;   // bool in ra 1 hoặc 0
    return 0;
}`,
      giaiThich: "Điều kiện được viết trực tiếp thành biểu thức logic kết hợp `||` và `&&`. Biến `bool` khi in bằng `cout` hiện `1` cho đúng và `0` cho sai, nên không cần câu lệnh rẽ nhánh. Ví dụ 1900 chia hết cho 100 nhưng không chia hết cho 400 nên không nhuận."
    },
    {
      id: "c1-bt8",
      muc: 4,
      tieuDe: "Đồng hồ sau t giây",
      deBai: "Dòng thứ nhất chứa ba số nguyên `h m s` là thời điểm hiện tại trên đồng hồ 24 giờ (0 ≤ h ≤ 23, 0 ≤ m, s ≤ 59). Dòng thứ hai chứa số nguyên `t` (0 ≤ t ≤ 10^12). In ra thời điểm đồng hồ chỉ sau `t` giây nữa theo dạng `HH:MM:SS`, mỗi phần đúng 2 chữ số.",
      viDu: { input: "23 59 30\n45", output: "00:00:15" },
      loiGiai: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    long long h, m, s, t;
    cin >> h >> m >> s >> t;
    const long long GIAY_MOT_NGAY = 24 * 60 * 60;   // 86400

    long long tong = (h * 3600 + m * 60 + s + t) % GIAY_MOT_NGAY;
    long long gio = tong / 3600;
    long long phut = tong % 3600 / 60;
    long long giay = tong % 60;

    cout << setfill('0') << setw(2) << gio << ":"
         << setw(2) << phut << ":" << setw(2) << giay << endl;
    return 0;
}`,
      giaiThich: "Đổi thời điểm hiện tại ra số giây tính từ nửa đêm, cộng thêm `t` rồi lấy dư cho 86400 để quay vòng qua ngày mới. Sau đó tách lại giờ, phút, giây bằng `/` và `%`, và in mỗi phần với `setw(2)` cùng `setfill('0')`. Vì `t` rất lớn nên mọi biến dùng `long long`."
    }
  ]
};
