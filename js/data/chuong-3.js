window.CHUONG = window.CHUONG || {};
window.CHUONG[3] = {
  so: 3,
  ten: "Mảng, chuỗi & vector",
  tomTat: "Lưu và xử lý nhiều giá trị cùng lúc bằng mảng tĩnh một chiều, hai chiều và truyền mảng vào hàm; làm việc với văn bản qua `std::string`; dùng mảng động `std::vector` và các hàm `sort`, `reverse` của thư viện `<algorithm>`.",
  baiGiang: [
    {
      id: "c3-l1",
      tieuDe: "Mảng một chiều",
      noiDung: [
        { loai: "p", text: "Giả sử cần lưu điểm của 50 sinh viên. Khai báo 50 biến `diem1`, `diem2`, ... là bất khả thi, và càng không thể duyệt chúng bằng vòng lặp. **Mảng** giải quyết vấn đề này: đó là một dãy các phần tử **cùng kiểu**, nằm **liên tiếp** trong bộ nhớ, dùng chung một tên và được phân biệt bằng **chỉ số** (index). Khai báo `int a[50];` tạo ra 50 biến nguyên `a[0]`, `a[1]`, ..., `a[49]`." },
        { loai: "p", text: "Điều quan trọng nhất cần nhớ: chỉ số trong C++ **bắt đầu từ 0**, nên mảng có `n` phần tử dùng chỉ số từ `0` đến `n - 1`. Kích thước của mảng tĩnh phải là một **hằng số** biết trước lúc biên dịch. Khi đề bài cho \"n không quá 1000\", cách làm quen thuộc là khai báo mảng đủ lớn theo giới hạn đó, rồi chỉ dùng `n` phần tử đầu." },
        { loai: "list", items: [
          "`int a[5] = {3, 8, 1, 9, 4};` khai báo và khởi tạo đủ 5 phần tử.",
          "`int b[5] = {1, 2};` các phần tử còn thiếu được gán 0, tức `b` là `1 2 0 0 0`.",
          "`int c[100] = {};` gán toàn bộ 100 phần tử bằng 0. Cách viết này rất hay dùng cho mảng đếm.",
          "`int d[] = {5, 6, 7};` trình biên dịch tự tính kích thước là 3."
        ] },
        { loai: "code", text: `#include <iostream>
using namespace std;

const int MAX = 1000;

int main() {
    // Nhập: 5\\n3 8 1 9 4
    int n;
    int a[MAX];
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int tong = 0, lonNhat = a[0], viTriMax = 0;
    for (int i = 0; i < n; i++) {
        tong += a[i];
        if (a[i] > lonNhat) {
            lonNhat = a[i];
            viTriMax = i;
        }
    }
    cout << "Tong = " << tong << endl;                               // Tong = 25
    cout << "Max = " << lonNhat << " tai chi so " << viTriMax << endl; // Max = 9 tai chi so 3

    // In mảng theo thứ tự ngược
    for (int i = n - 1; i >= 0; i--) {
        cout << a[i] << " ";
    }
    cout << endl;                                                    // 4 9 1 8 3
    return 0;
}` },
        { loai: "p", text: "Vòng lặp `for (int i = 0; i < n; i++)` là cách duyệt mảng chuẩn mực; hãy để ý điều kiện là `i < n` chứ không phải `i <= n`. Mảng không thể gán cả khối cho nhau (`a = b;` là lỗi) và không thể in cả mảng bằng một lệnh `cout`, ta luôn phải xử lý từng phần tử. Nếu cần biết số phần tử của một mảng khai báo trong cùng hàm, có thể dùng `sizeof(a) / sizeof(a[0])`." },
        { loai: "note", text: "C++ **không kiểm tra** chỉ số mảng. Truy cập `a[n]` hay `a[-1]` vẫn biên dịch được, nhưng sẽ đọc hoặc ghi vào vùng nhớ không thuộc mảng, gây kết quả sai hoặc làm chương trình dừng đột ngột. Đây là một trong những lỗi khó tìm nhất." }
      ]
    },
    {
      id: "c3-l2",
      tieuDe: "Mảng hai chiều",
      noiDung: [
        { loai: "p", text: "Nhiều dữ liệu có dạng bảng: bảng điểm (mỗi dòng một sinh viên, mỗi cột một môn), bàn cờ, ảnh số, ma trận trong toán học. Để lưu chúng, ta dùng **mảng hai chiều**. Khai báo `int a[3][4];` tạo một bảng 3 dòng, 4 cột. Phần tử ở dòng `i`, cột `j` được viết là `a[i][j]`, với `i` từ 0 đến 2 và `j` từ 0 đến 3." },
        { loai: "p", text: "Có thể khởi tạo mảng hai chiều bằng các cặp ngoặc nhọn lồng nhau, mỗi cặp bên trong là một dòng: `int a[2][3] = {{1, 2, 3}, {4, 5, 6}};`. Thực chất mảng hai chiều là \"mảng của các mảng\": `a` gồm 2 phần tử, mỗi phần tử là một mảng 3 số nguyên. Trong bộ nhớ, các dòng được xếp nối tiếp nhau: toàn bộ dòng 0, rồi đến toàn bộ dòng 1." },
        { loai: "p", text: "Để duyệt mảng hai chiều ta dùng **hai vòng lặp lồng nhau**: vòng ngoài chạy theo dòng, vòng trong chạy theo cột. Khi đổi vai trò (vòng ngoài theo cột, vòng trong theo dòng) ta có thể tính tổng từng cột. Ví dụ dưới đây đọc một ma trận, in ra dạng bảng thẳng cột và tính tổng từng cột cùng tổng đường chéo chính của một ma trận vuông." },
        { loai: "code", text: `#include <iostream>
#include <iomanip>
using namespace std;

const int MAX = 100;

int main() {
    // Nhập: 3 3\\n1 2 3\\n4 5 6\\n7 8 9
    int m, n;               // m dòng, n cột
    int a[MAX][MAX];
    cin >> m >> n;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    // In ma trận, mỗi số rộng 4 ô
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cout << setw(4) << a[i][j];
        }
        cout << endl;
    }
    //    1   2   3
    //    4   5   6
    //    7   8   9

    // Tổng từng cột: vòng ngoài theo cột
    for (int j = 0; j < n; j++) {
        int tongCot = 0;
        for (int i = 0; i < m; i++) tongCot += a[i][j];
        cout << tongCot << " ";
    }
    cout << endl;                       // 12 15 18

    // Đường chéo chính: các phần tử a[i][i]
    int cheo = 0;
    for (int i = 0; i < m; i++) cheo += a[i][i];
    cout << "Duong cheo: " << cheo << endl;   // Duong cheo: 15
    return 0;
}` },
        { loai: "p", text: "Mảng hai chiều kích thước `[MAX][MAX]` chiếm khá nhiều bộ nhớ: với `MAX = 1000` và kiểu `int` là 4 triệu byte. Khai báo một mảng lớn như vậy **bên trong** hàm `main` có thể làm tràn ngăn xếp; trong trường hợp đó hãy khai báo nó **bên ngoài mọi hàm** (biến toàn cục), nơi mảng được cấp ở vùng nhớ riêng và tự khởi tạo bằng 0." },
        { loai: "note", text: "Viết `a[i, j]` thay cho `a[i][j]` là lỗi thường gặp của người quen Pascal hay Python NumPy. Trong C++, mỗi chiều phải có cặp ngoặc vuông riêng." }
      ]
    },
    {
      id: "c3-l3",
      tieuDe: "Truyền mảng vào hàm",
      noiDung: [
        { loai: "p", text: "Ở Chương 2, ta biết tham số kiểu `int` được truyền tham trị: hàm nhận một bản sao. Mảng thì khác. Khi truyền mảng vào hàm, C++ **không sao chép** cả mảng mà chỉ truyền **địa chỉ phần tử đầu tiên**. Vì vậy hàm làm việc trực tiếp trên mảng gốc: mọi thay đổi bên trong hàm đều ảnh hưởng đến mảng bên ngoài, giống như truyền tham chiếu, mà không cần dấu `&`." },
        { loai: "p", text: "Tham số mảng được viết `int a[]` (không cần ghi kích thước). Vì hàm chỉ nhận được địa chỉ, nó **không biết mảng có bao nhiêu phần tử**, nên ta luôn truyền thêm một tham số `n` cho biết số phần tử cần xử lý. Nếu hàm chỉ đọc mà không sửa mảng, hãy khai báo `const int a[]`; khi đó trình biên dịch sẽ báo lỗi nếu lỡ tay gán giá trị vào phần tử của mảng." },
        { loai: "p", text: "Với mảng hai chiều, hàm cần biết số cột để tính vị trí của `a[i][j]` trong bộ nhớ, nên tham số phải ghi rõ kích thước **chiều thứ hai**: `void inMaTran(int a[][MAX], int m, int n)`. Chỉ chiều đầu tiên được phép để trống." },
        { loai: "code", text: `#include <iostream>
using namespace std;

const int MAX = 100;

void nhapMang(int a[], int n) {
    for (int i = 0; i < n; i++) cin >> a[i];
}

void inMang(const int a[], int n) {   // const: chỉ đọc
    for (int i = 0; i < n; i++) cout << a[i] << " ";
    cout << endl;
}

void nhanDoi(int a[], int n) {        // sửa trực tiếp mảng gốc
    for (int i = 0; i < n; i++) a[i] *= 2;
}

// Tìm kiếm tuần tự: trả về chỉ số đầu tiên bằng x, không có thì trả về -1
int timViTri(const int a[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (a[i] == x) return i;
    }
    return -1;
}

int tongMaTran(int b[][MAX], int m, int n) {
    int tong = 0;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            tong += b[i][j];
    return tong;
}

int main() {
    // Nhập: 4\\n5 2 7 2
    int n;
    int a[MAX];
    cin >> n;
    nhapMang(a, n);
    cout << timViTri(a, n, 2) << " " << timViTri(a, n, 9) << endl;   // 1 -1
    nhanDoi(a, n);
    inMang(a, n);                                                  // 10 4 14 4

    int b[MAX][MAX] = {{1, 2}, {3, 4}};
    cout << tongMaTran(b, 2, 2) << endl;                           // 10
    return 0;
}` },
        { loai: "p", text: "Lưu ý lời gọi hàm chỉ ghi tên mảng `a`, không có ngoặc vuông: `nhapMang(a, n)`. Viết `nhapMang(a[], n)` hay `nhapMang(a[n], n)` đều sai; cách sau còn truyền một phần tử nằm ngoài mảng. Hàm cũng không thể trả về một mảng tĩnh; muốn \"trả về\" kết quả là một dãy, ta truyền thêm một mảng kết quả làm tham số, hoặc dùng `vector` sẽ học ở phần sau." },
        { loai: "note", text: "Bên trong hàm, `sizeof(a)` với `a` là tham số mảng chỉ cho kích thước của một địa chỉ (8 byte trên máy 64 bit), không phải kích thước mảng. Vì thế bắt buộc phải truyền `n` riêng." }
      ]
    },
    {
      id: "c3-l4",
      tieuDe: "Chuỗi std::string",
      noiDung: [
        { loai: "p", text: "Văn bản trong C++ hiện đại được lưu bằng kiểu `string` của thư viện chuẩn (cần `#include <string>`). Khác với mảng ký tự kiểu C, một `string` **tự quản lý bộ nhớ**: nó tự dài ra khi ta nối thêm ký tự, biết chính xác độ dài của mình và hỗ trợ sẵn các phép gán, nối, so sánh bằng toán tử quen thuộc. Mỗi ký tự trong chuỗi có kiểu `char` và được truy cập bằng chỉ số giống mảng: `s[0]` là ký tự đầu tiên, `s[s.length() - 1]` là ký tự cuối." },
        { loai: "table", head: ["Thao tác", "Cú pháp", "Ví dụ với `s = \"Hello\"`"], rows: [
          ["Độ dài", "`s.length()` hoặc `s.size()`", "5"],
          ["Truy cập ký tự", "`s[i]`", "`s[1]` là `'e'`"],
          ["Nối chuỗi", "`s + t`, `s += t`, `s += 'c'`", "`s + \" C++\"` là `\"Hello C++\"`"],
          ["So sánh", "`==  !=  <  >`", "`s == \"Hello\"` là `true`"],
          ["Chuỗi rỗng?", "`s.empty()`", "`false`"]
        ] },
        { loai: "p", text: "Các toán tử so sánh `<`, `>` so sánh chuỗi theo **thứ tự từ điển**, dựa trên mã ASCII của từng ký tự từ trái sang phải: `\"apple\" < \"banana\"`, `\"an\" < \"anh\"`. Vì mã của chữ hoa (65 đến 90) nhỏ hơn chữ thường (97 đến 122), nên `\"Zoo\" < \"apple\"` là đúng; muốn so sánh không phân biệt hoa thường thì phải đổi cả hai chuỗi về cùng một dạng trước." },
        { loai: "p", text: "Có hai cách đọc chuỗi. `cin >> s` đọc **một từ**: bỏ qua khoảng trắng đầu và dừng ở khoảng trắng tiếp theo. `getline(cin, s)` đọc **cả dòng** kể cả dấu cách, đến khi gặp ký tự xuống dòng. Khi dùng `cin >> n` rồi mới `getline`, có một cái bẫy: `cin >> n` để lại ký tự xuống dòng trong luồng nhập, và `getline` ngay sau đó đọc phải dòng rỗng này. Cách khắc phục là gọi `cin.ignore()` để bỏ ký tự xuống dòng đó trước khi `getline`." },
        { loai: "code", text: `#include <iostream>
#include <string>
using namespace std;

int main() {
    // Nhập: 19\\nNguyen Van An
    int tuoi;
    string hoTen;
    cin >> tuoi;
    cin.ignore();              // bỏ ký tự xuống dòng còn sót sau số 19
    getline(cin, hoTen);       // đọc cả dòng có dấu cách

    cout << hoTen << " (" << tuoi << ")" << endl;   // Nguyen Van An (19)
    cout << hoTen.length() << endl;                 // 13
    cout << hoTen[0] << hoTen[hoTen.length() - 1] << endl;   // Nn

    string loiChao = "Xin chao, ";
    loiChao += hoTen;          // nối chuỗi
    loiChao += '!';            // nối một ký tự
    cout << loiChao << endl;   // Xin chao, Nguyen Van An!

    string a = "an", b = "anh", c = "Zoo";
    cout << (a < b) << " " << (c < a) << " " << (a == "an") << endl;   // 1 1 1
    return 0;
}` },
        { loai: "note", text: "Nếu thiếu `cin.ignore()` trong ví dụ trên, `hoTen` sẽ là chuỗi rỗng và chương trình không chờ bạn nhập tên. Đây là lỗi mà hầu như sinh viên nào cũng gặp ít nhất một lần." }
      ]
    },
    {
      id: "c3-l5",
      tieuDe: "Xử lý chuỗi: substr, find và duyệt ký tự",
      noiDung: [
        { loai: "p", text: "Ngoài các toán tử, `string` có nhiều hàm thành viên để cắt, tìm kiếm và sửa chuỗi. Hai hàm dùng nhiều nhất là `substr` và `find`. `s.substr(pos, len)` trả về chuỗi con bắt đầu tại vị trí `pos` và dài `len` ký tự; nếu bỏ `len` thì lấy đến hết chuỗi. `s.find(x)` tìm lần xuất hiện **đầu tiên** của `x` (một ký tự hoặc một chuỗi) và trả về vị trí của nó; nếu không tìm thấy, hàm trả về một giá trị đặc biệt là `string::npos`. Có thể truyền thêm vị trí bắt đầu tìm: `s.find(x, tu)`." },
        { loai: "p", text: "Để xử lý từng ký tự, ta duyệt chuỗi giống duyệt mảng, hoặc dùng **vòng lặp for theo phạm vi** (range-based for): `for (char c : s)` lần lượt gán từng ký tự của `s` cho `c`. Nếu muốn sửa ký tự ngay trong chuỗi, viết `for (char &c : s)` để `c` là tham chiếu đến ký tự gốc. Thư viện `<cctype>` cung cấp các hàm kiểm tra và đổi ký tự rất tiện: `isdigit(c)` (chữ số), `isalpha(c)` (chữ cái), `isupper(c)`, `islower(c)`, `isspace(c)` và `toupper(c)`, `tolower(c)`." },
        { loai: "code", text: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string email = "sinhvien@uni.edu.vn";
    size_t viTri = email.find('@');               // vị trí của '@'
    cout << viTri << endl;                        // 8
    cout << email.substr(0, viTri) << endl;       // sinhvien
    cout << email.substr(viTri + 1) << endl;      // uni.edu.vn

    if (email.find("gmail") == string::npos) {
        cout << "Khong phai gmail" << endl;       // Khong phai gmail
    }

    // Đếm chữ số và chữ cái
    string maSV = "SV2026-K68";
    int soChuSo = 0, soChuCai = 0;
    for (char c : maSV) {
        if (isdigit(c)) soChuSo++;
        else if (isalpha(c)) soChuCai++;
    }
    cout << soChuSo << " " << soChuCai << endl;   // 6 3

    // Đổi cả chuỗi sang chữ hoa: dùng tham chiếu để sửa ký tự gốc
    string ten = "lap trinh c++";
    for (char &c : ten) c = toupper(c);
    cout << ten << endl;                          // LAP TRINH C++

    // Đếm số lần xuất hiện của "an" bằng find lặp lại
    string cau = "an nam an ngon";
    int dem = 0;
    size_t pos = cau.find("an");
    while (pos != string::npos) {
        dem++;
        pos = cau.find("an", pos + 1);
    }
    cout << dem << endl;                          // 2
    return 0;
}` },
        { loai: "list", items: [
          "`s.insert(pos, t)`: chèn chuỗi `t` vào vị trí `pos`.",
          "`s.erase(pos, len)`: xóa `len` ký tự bắt đầu từ `pos`.",
          "`to_string(123)` đổi số thành chuỗi `\"123\"`; `stoi(\"45\")` đổi chuỗi thành số nguyên 45.",
          "Đổi chữ số sang giá trị số: `c - '0'`, ví dụ `'7' - '0'` bằng 7."
        ] },
        { loai: "note", text: "Hàm `find` trả về kiểu `size_t` (số không dấu). Hãy lưu kết quả vào biến `size_t` và so sánh với `string::npos`, đừng so sánh với `-1` hay lưu vào `int`, vì dễ gây lỗi và cảnh báo khi biên dịch." }
      ]
    },
    {
      id: "c3-l6",
      tieuDe: "Mảng động std::vector",
      noiDung: [
        { loai: "p", text: "Mảng tĩnh có kích thước cố định lúc biên dịch, không biết số phần tử của chính nó và không thể trả về từ hàm. `vector` trong thư viện `<vector>` khắc phục tất cả những hạn chế đó. Một `vector<int>` là một dãy số nguyên có thể **tự lớn lên** khi thêm phần tử, luôn biết kích thước của mình qua `size()`, có thể gán, so sánh, truyền vào và trả về từ hàm như một biến bình thường. Trong C++ hiện đại, `vector` là lựa chọn mặc định mỗi khi cần một dãy phần tử." },
        { loai: "table", head: ["Thao tác", "Cú pháp", "Ghi chú"], rows: [
          ["Tạo rỗng", "`vector<int> v;`", "Chưa có phần tử nào"],
          ["Tạo n phần tử", "`vector<int> v(n);` / `vector<int> v(n, 7);`", "Mặc định bằng 0, hoặc bằng 7"],
          ["Thêm vào cuối", "`v.push_back(x);`", "Kích thước tăng thêm 1"],
          ["Xóa phần tử cuối", "`v.pop_back();`", "Không được gọi khi `v` rỗng"],
          ["Kích thước", "`v.size()`, `v.empty()`", "`size()` trả về số không dấu"],
          ["Truy cập", "`v[i]`, `v.at(i)`, `v.front()`, `v.back()`", "`at` có kiểm tra chỉ số"]
        ] },
        { loai: "p", text: "Phần tử của vector được truy cập bằng `v[i]` giống mảng, cũng không kiểm tra chỉ số. Nếu muốn an toàn, dùng `v.at(i)`: khi chỉ số sai, chương trình dừng với thông báo lỗi rõ ràng thay vì âm thầm đọc vùng nhớ rác. Để duyệt vector, cách gọn nhất là vòng lặp for theo phạm vi `for (int x : v)`; nếu muốn sửa phần tử, dùng `for (int &x : v)`. Khi truyền vector vào hàm, vector được truyền tham trị (sao chép toàn bộ) như mọi biến khác, nên ta thường truyền **tham chiếu** `vector<int> &v` để sửa được, hoặc **tham chiếu hằng** `const vector<int> &v` để chỉ đọc mà không tốn chi phí sao chép." },
        { loai: "code", text: `#include <iostream>
#include <vector>
using namespace std;

// Trả về vector chứa các số chẵn của v
vector<int> locSoChan(const vector<int> &v) {
    vector<int> kq;
    for (int x : v) {
        if (x % 2 == 0) kq.push_back(x);
    }
    return kq;
}

void tangMot(vector<int> &v) {
    for (int &x : v) x++;      // tham chiếu: sửa trực tiếp phần tử
}

int main() {
    // Nhập: 6\\n4 7 10 3 8 1
    int n;
    cin >> n;
    vector<int> v;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        v.push_back(x);
    }
    cout << v.size() << " " << v.front() << " " << v.back() << endl;  // 6 4 1

    vector<int> chan = locSoChan(v);
    for (int x : chan) cout << x << " ";
    cout << endl;                                  // 4 10 8

    tangMot(v);
    for (size_t i = 0; i < v.size(); i++) cout << v[i] << " ";
    cout << endl;                                  // 5 8 11 4 9 2

    v.pop_back();
    cout << v.size() << endl;                      // 5

    // Vector hai chiều: 2 dòng, 3 cột, khởi tạo bằng 0
    vector<vector<int>> bang(2, vector<int>(3, 0));
    bang[1][2] = 9;
    cout << bang[1][2] << " " << bang.size() << " " << bang[0].size() << endl;  // 9 2 3
    return 0;
}` },
        { loai: "note", text: "Vì `v.size()` trả về số **không dấu**, viết `for (int i = 0; i < v.size(); i++)` sẽ bị cảnh báo khi biên dịch với `-Wall`. Hãy dùng `size_t i`, hoặc vòng for theo phạm vi. Cẩn thận hơn nữa với `v.size() - 1` khi `v` rỗng: kết quả không phải -1 mà là một số dương khổng lồ." }
      ]
    },
    {
      id: "c3-l7",
      tieuDe: "Sắp xếp và đảo ngược với <algorithm>",
      noiDung: [
        { loai: "p", text: "Sắp xếp là một trong những thao tác dùng nhiều nhất khi xử lý dữ liệu. Bạn có thể tự viết thuật toán sắp xếp nổi bọt hay chọn, nhưng chúng mất khoảng `n * n` bước, quá chậm khi `n` lên đến hàng trăm nghìn. Thư viện `<algorithm>` có sẵn hàm `sort` chạy trong khoảng `n log n` bước, nhanh và đã được kiểm chứng kỹ. Với `n = 10^6`, `sort` chỉ mất một phần nhỏ của giây." },
        { loai: "p", text: "Các hàm trong `<algorithm>` làm việc trên một **đoạn** được xác định bởi hai vị trí: vị trí đầu và vị trí **ngay sau** phần tử cuối. Với vector và string, hai vị trí đó là `v.begin()` và `v.end()`. Với mảng tĩnh `a` có `n` phần tử, ta viết `a` và `a + n`. Mặc định `sort` sắp **tăng dần**; muốn giảm dần, truyền thêm tham số thứ ba là `greater<int>()` (trong `<functional>`). Hàm `reverse` đảo ngược thứ tự các phần tử trong đoạn, rất tiện để đảo chuỗi hay kiểm tra chuỗi đối xứng." },
        { loai: "code", text: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <functional>
using namespace std;

int main() {
    vector<int> v = {5, 2, 9, 1, 7};
    sort(v.begin(), v.end());                       // tăng dần
    for (int x : v) cout << x << " ";
    cout << endl;                                   // 1 2 5 7 9

    sort(v.begin(), v.end(), greater<int>());       // giảm dần
    for (int x : v) cout << x << " ";
    cout << endl;                                   // 9 7 5 2 1

    int a[6] = {40, 10, 30, 60, 20, 50};
    sort(a, a + 3);                                 // chỉ sắp 3 phần tử đầu
    for (int i = 0; i < 6; i++) cout << a[i] << " ";
    cout << endl;                                   // 10 30 40 60 20 50

    string s = "algorithm";
    reverse(s.begin(), s.end());
    cout << s << endl;                              // mhtirogla
    sort(s.begin(), s.end());                       // sắp các ký tự
    cout << s << endl;                              // aghilmort

    vector<string> ten = {"Minh", "An", "Lan", "Binh"};
    sort(ten.begin(), ten.end());                   // thứ tự từ điển
    for (const string &t : ten) cout << t << " ";
    cout << endl;                                   // An Binh Lan Minh

    vector<int> w = {3, 8, 1, 6};
    cout << *max_element(w.begin(), w.end()) << " "
         << *min_element(w.begin(), w.end()) << endl;   // 8 1
    return 0;
}` },
        { loai: "p", text: "Hai hàm `max_element` và `min_element` trả về **vị trí** của phần tử lớn nhất và nhỏ nhất, nên cần thêm dấu `*` phía trước để lấy giá trị. Sau khi sắp xếp, nhiều bài toán trở nên đơn giản: các phần tử bằng nhau đứng cạnh nhau nên dễ đếm số lần xuất hiện hoặc loại bỏ trùng lặp; phần tử nhỏ thứ `k` chính là `v[k - 1]`; trung vị nằm ở giữa dãy." },
        { loai: "note", text: "Đoạn `[v.begin(), v.end())` là **nửa mở**: bao gồm vị trí đầu nhưng không bao gồm vị trí cuối. Vì thế muốn sắp `n` phần tử đầu của mảng phải viết `sort(a, a + n)`, không phải `sort(a, a + n - 1)`." }
      ]
    }
  ],
  baiTap: [
    {
      id: "c3-bt1",
      muc: 1,
      tieuDe: "Tổng và giá trị lớn nhất của dãy",
      deBai: "Dòng đầu chứa số nguyên `n` (1 ≤ n ≤ 1000). Dòng thứ hai chứa `n` số nguyên `a[i]` (|a[i]| ≤ 10^9). In ra tổng các phần tử và giá trị lớn nhất của dãy, cách nhau một dấu cách.",
      viDu: { input: "5\n3 -1 7 2 4", output: "15 7" },
      loiGiai: `#include <iostream>
using namespace std;

const int MAX = 1000;

int main() {
    int n;
    long long a[MAX];
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];

    long long tong = 0, lonNhat = a[0];
    for (int i = 0; i < n; i++) {
        tong += a[i];
        if (a[i] > lonNhat) lonNhat = a[i];
    }
    cout << tong << " " << lonNhat << endl;
    return 0;
}`,
      giaiThich: "Đọc dãy vào mảng, sau đó duyệt một lượt để cộng dồn tổng và cập nhật giá trị lớn nhất. Giá trị lớn nhất được khởi tạo bằng `a[0]` chứ không phải 0, vì dãy có thể toàn số âm; tổng dùng `long long` vì có thể lên đến 10^12."
    },
    {
      id: "c3-bt2",
      muc: 1,
      tieuDe: "Đếm nguyên âm",
      deBai: "Nhập một dòng văn bản (có thể chứa dấu cách, độ dài không quá 1000 ký tự, chỉ gồm ký tự ASCII). In ra số nguyên âm trong dòng đó, tính cả chữ hoa và chữ thường. Các nguyên âm là `a, e, i, o, u`.",
      viDu: { input: "Hello World", output: "3" },
      loiGiai: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string s;
    getline(cin, s);          // đọc cả dòng, kể cả dấu cách
    int dem = 0;
    for (char c : s) {
        char t = tolower(c);  // đưa về chữ thường để so sánh một lần
        if (t == 'a' || t == 'e' || t == 'i' || t == 'o' || t == 'u') dem++;
    }
    cout << dem << endl;
    return 0;
}`,
      giaiThich: "Dùng `getline` vì dòng văn bản có dấu cách. Mỗi ký tự được đổi về chữ thường bằng `tolower` rồi so sánh với năm nguyên âm, nhờ vậy không phải viết thêm năm phép so sánh cho chữ hoa."
    },
    {
      id: "c3-bt3",
      muc: 2,
      tieuDe: "Chuỗi đối xứng",
      deBai: "Nhập một từ `s` gồm các chữ cái thường, không có dấu cách (độ dài không quá 1000). In ra `YES` nếu `s` đọc xuôi và đọc ngược giống nhau, ngược lại in `NO`.",
      viDu: { input: "level", output: "YES" },
      loiGiai: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s;
    cin >> s;
    string dao = s;                     // tạo bản sao
    reverse(dao.begin(), dao.end());    // đảo ngược bản sao
    cout << (s == dao ? "YES" : "NO") << endl;
    return 0;
}`,
      giaiThich: "Tạo một bản sao của chuỗi, đảo ngược bản sao bằng `reverse` rồi so sánh với chuỗi gốc bằng `==`. Một cách khác không tốn bộ nhớ thêm là so sánh `s[i]` với `s[n - 1 - i]` cho `i` chạy đến giữa chuỗi."
    },
    {
      id: "c3-bt4",
      muc: 2,
      tieuDe: "Tổng từng dòng của ma trận",
      deBai: "Dòng đầu chứa hai số nguyên `m` và `n` (1 ≤ m, n ≤ 100) là số dòng và số cột. `m` dòng tiếp theo, mỗi dòng chứa `n` số nguyên có giá trị tuyệt đối không quá 10^6. In ra `m` dòng, dòng thứ `i` là tổng các phần tử của dòng thứ `i` trong ma trận.",
      viDu: { input: "2 3\n1 2 3\n4 5 6", output: "6\n15" },
      loiGiai: `#include <iostream>
using namespace std;

const int MAX = 100;

int tongDong(int a[][MAX], int dong, int n) {
    int tong = 0;
    for (int j = 0; j < n; j++) tong += a[dong][j];
    return tong;
}

int main() {
    int m, n;
    int a[MAX][MAX];
    cin >> m >> n;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    for (int i = 0; i < m; i++) {
        cout << tongDong(a, i, n) << endl;
    }
    return 0;
}`,
      giaiThich: "Đọc ma trận bằng hai vòng lặp lồng nhau. Hàm `tongDong` nhận mảng hai chiều (bắt buộc ghi kích thước cột `MAX`) và chỉ số dòng, cộng các phần tử trên dòng đó. Tổng lớn nhất là 100·10^6 = 10^8 nên kiểu `int` vẫn đủ."
    },
    {
      id: "c3-bt5",
      muc: 3,
      tieuDe: "Sắp xếp và loại bỏ trùng lặp",
      deBai: "Dòng đầu chứa số nguyên `n` (1 ≤ n ≤ 10^5). Dòng thứ hai chứa `n` số nguyên. In ra các giá trị khác nhau của dãy theo thứ tự tăng dần, trên một dòng, cách nhau một dấu cách.",
      viDu: { input: "7\n5 3 5 1 3 9 1", output: "1 3 5 9" },
      loiGiai: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int &x : v) cin >> x;     // đọc thẳng vào từng phần tử

    sort(v.begin(), v.end());       // các số bằng nhau sẽ đứng cạnh nhau

    vector<int> kq;
    for (int x : v) {
        if (kq.empty() || kq.back() != x) kq.push_back(x);
    }
    for (size_t i = 0; i < kq.size(); i++) {
        if (i > 0) cout << " ";
        cout << kq[i];
    }
    cout << endl;
    return 0;
}`,
      giaiThich: "Sau khi `sort`, các giá trị trùng nhau nằm liền kề, nên chỉ cần thêm một số vào kết quả khi nó khác số cuối cùng đã thêm. Độ phức tạp là `n log n` cho bước sắp xếp, đủ nhanh với `n = 10^5`."
    },
    {
      id: "c3-bt6",
      muc: 3,
      tieuDe: "Chuẩn hóa họ tên",
      deBai: "Nhập một dòng là họ tên viết không dấu, có thể chứa nhiều dấu cách thừa ở đầu, cuối và giữa các từ, chữ hoa chữ thường lộn xộn. In ra họ tên đã chuẩn hóa: các từ cách nhau đúng một dấu cách, không có dấu cách ở đầu và cuối, mỗi từ viết hoa chữ cái đầu và viết thường các chữ còn lại.",
      viDu: { input: "  nGUYEN   van   an ", output: "Nguyen Van An" },
      loiGiai: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

// Viết hoa chữ đầu, viết thường các chữ còn lại của một từ
string chuanHoaTu(string tu) {
    for (size_t i = 0; i < tu.length(); i++) {
        if (i == 0) tu[i] = toupper(tu[i]);
        else tu[i] = tolower(tu[i]);
    }
    return tu;
}

int main() {
    string tu, ketQua;
    // cin >> tu tự bỏ qua mọi dấu cách, mỗi lần đọc đúng một từ
    while (cin >> tu) {
        if (!ketQua.empty()) ketQua += ' ';
        ketQua += chuanHoaTu(tu);
    }
    cout << ketQua << endl;
    return 0;
}`,
      giaiThich: "Thay vì tự xử lý từng dấu cách, ta tận dụng việc `cin >> tu` bỏ qua mọi khoảng trắng và đọc từng từ một; vòng lặp `while (cin >> tu)` dừng khi hết dữ liệu. Mỗi từ được chuẩn hóa bằng `toupper` và `tolower` rồi nối vào kết quả, chỉ thêm dấu cách giữa các từ."
    },
    {
      id: "c3-bt7",
      muc: 4,
      tieuDe: "Tần suất các từ",
      deBai: "Nhập một dòng gồm các từ viết thường, cách nhau bởi một hoặc nhiều dấu cách (tổng độ dài không quá 10^5). Với mỗi từ khác nhau, in ra một dòng gồm từ đó và số lần xuất hiện, cách nhau một dấu cách. Các dòng được sắp xếp theo thứ tự từ điển của từ.",
      viDu: { input: "the cat and the dog and the bird", output: "and 2\nbird 1\ncat 1\ndog 1\nthe 3" },
      loiGiai: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<string> ds;
    string tu;
    while (cin >> tu) ds.push_back(tu);

    sort(ds.begin(), ds.end());        // các từ giống nhau đứng cạnh nhau

    size_t i = 0;
    while (i < ds.size()) {
        size_t j = i;
        while (j < ds.size() && ds[j] == ds[i]) j++;   // tìm hết nhóm từ giống ds[i]
        cout << ds[i] << " " << j - i << "\\n";
        i = j;                                         // nhảy sang nhóm kế tiếp
    }
    return 0;
}`,
      giaiThich: "Đọc tất cả các từ vào một `vector<string>` rồi sắp xếp theo thứ tự từ điển, khi đó mỗi từ tạo thành một nhóm liền nhau. Dùng hai chỉ số: `i` đánh dấu đầu nhóm, `j` chạy đến hết nhóm, số lần xuất hiện là `j - i`. Cách này chạy trong `n log n` thay vì đếm lại cho từng từ."
    },
    {
      id: "c3-bt8",
      muc: 4,
      tieuDe: "Đoạn con có tổng lớn nhất",
      deBai: "Dòng đầu chứa số nguyên `n` (1 ≤ n ≤ 10^5). Dòng thứ hai chứa `n` số nguyên `a[i]` (|a[i]| ≤ 10^9). Tìm một đoạn gồm các phần tử liên tiếp (ít nhất một phần tử) có tổng lớn nhất và in ra tổng đó. Chương trình cần chạy nhanh với `n = 10^5`.",
      viDu: { input: "8\n-2 1 -3 4 -1 2 1 -5", output: "6" },
      loiGiai: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    for (long long &x : a) cin >> x;

    long long tongHienTai = a[0];   // tổng lớn nhất của đoạn kết thúc tại vị trí đang xét
    long long totNhat = a[0];
    for (int i = 1; i < n; i++) {
        // hoặc nối a[i] vào đoạn trước, hoặc bắt đầu đoạn mới từ a[i]
        tongHienTai = max(tongHienTai + a[i], a[i]);
        totNhat = max(totNhat, tongHienTai);
    }
    cout << totNhat << endl;
    return 0;
}`,
      giaiThich: "Thử mọi đoạn mất khoảng `n * n / 2` phép tính, quá chậm với `n = 10^5`. Thuật toán Kadane duyệt một lượt: tại mỗi vị trí, đoạn tốt nhất kết thúc ở đó hoặc nối tiếp đoạn tốt nhất trước đó, hoặc bắt đầu lại từ chính phần tử này nếu phần trước có tổng âm. Kết quả là giá trị lớn nhất trong các tổng đó; với ví dụ, đoạn tốt nhất là `4 -1 2 1`."
    }
  ]
};
