window.CHUONG = window.CHUONG || {};
window.CHUONG[2] = {
  so: 2,
  ten: "Cấu trúc điều khiển & hàm",
  tomTat: "Điều khiển luồng chạy của chương trình bằng `if`, `switch`, toán tử ba ngôi và các vòng lặp `for`, `while`, `do-while`; sau đó chia chương trình thành các hàm, phân biệt truyền tham trị với tham chiếu, dùng tham số mặc định, nạp chồng hàm và viết hàm đệ quy.",
  baiGiang: [
    {
      id: "c2-l1",
      tieuDe: "Câu lệnh rẽ nhánh if / else",
      noiDung: [
        { loai: "p", text: "Đến giờ các chương trình của chúng ta chạy thẳng từ trên xuống dưới, mọi câu lệnh đều được thực hiện. Trong thực tế, chương trình thường phải **ra quyết định**: nếu điểm đủ thì đậu, ngược lại thì rớt; nếu mật khẩu đúng thì cho đăng nhập. Câu lệnh `if` cho phép chỉ chạy một đoạn mã khi một điều kiện đúng." },
        { loai: "p", text: "Cú pháp cơ bản là `if (điều_kiện) { ... } else { ... }`. Điều kiện đặt trong ngoặc tròn là một biểu thức cho giá trị `bool`, thường được tạo từ các phép so sánh và phép logic đã học ở Chương 1. Nếu điều kiện đúng, khối sau `if` được chạy; nếu sai, khối sau `else` được chạy. Phần `else` có thể bỏ đi nếu không cần làm gì khi điều kiện sai." },
        { loai: "p", text: "Khi có nhiều hơn hai trường hợp, ta nối các nhánh bằng `else if`. Chương trình kiểm tra các điều kiện **lần lượt từ trên xuống** và chỉ chạy nhánh đầu tiên có điều kiện đúng; các nhánh phía sau bị bỏ qua dù điều kiện của chúng cũng đúng. Vì vậy thứ tự các nhánh rất quan trọng: trong ví dụ xếp loại dưới đây, nếu đặt `diem >= 5.0` lên đầu thì mọi sinh viên từ 5 điểm trở lên đều bị xếp loại trung bình." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    // Nhập: 7.5
    double diem;
    cin >> diem;

    if (diem >= 8.5) {
        cout << "Gioi" << endl;
    } else if (diem >= 7.0) {
        cout << "Kha" << endl;          // 7.5 rơi vào nhánh này: In ra Kha
    } else if (diem >= 5.0) {
        cout << "Trung binh" << endl;
    } else {
        cout << "Yeu" << endl;
    }

    // if lồng nhau: tìm số lớn nhất trong ba số
    int a = 4, b = 9, c = 6;
    int lonNhat;
    if (a >= b) {
        if (a >= c) lonNhat = a;
        else lonNhat = c;
    } else {
        if (b >= c) lonNhat = b;
        else lonNhat = c;
    }
    cout << "Max = " << lonNhat << endl;   // Max = 9
    return 0;
}` },
        { loai: "p", text: "Nếu một nhánh chỉ có **một câu lệnh**, bạn có thể bỏ cặp ngoặc nhọn như trong phần tìm số lớn nhất. Tuy nhiên người mới nên luôn viết ngoặc nhọn, vì rất dễ thêm câu lệnh thứ hai vào sau mà quên rằng chỉ câu lệnh đầu tiên thuộc về `if`. Các câu lệnh `if` cũng có thể **lồng nhau** (một `if` nằm trong khối của `if` khác), nhưng lồng quá sâu làm mã khó đọc; khi đó hãy cân nhắc kết hợp điều kiện bằng `&&`, `||`." },
        { loai: "list", items: [
          "So sánh bằng dùng `==`, không phải `=`.",
          "Không đặt dấu `;` ngay sau `if (...)`: viết `if (x > 0);` sẽ tạo một câu lệnh rỗng, và khối phía sau luôn được chạy.",
          "Không so sánh số thực bằng `==` khi giá trị là kết quả tính toán, vì sai số làm tròn; hãy so sánh độ chênh lệch với một số rất nhỏ."
        ] },
        { loai: "note", text: "Kiểm tra khoảng giá trị phải viết `x >= 1 && x <= 10`. Cách viết kiểu toán học `1 <= x <= 10` vẫn biên dịch được nhưng cho kết quả sai: `1 <= x` được tính trước thành 0 hoặc 1, rồi mới so sánh với 10, nên luôn đúng." }
      ]
    },
    {
      id: "c2-l2",
      tieuDe: "switch và toán tử ba ngôi",
      noiDung: [
        { loai: "p", text: "Khi cần so sánh **một biến** với nhiều giá trị cụ thể, chuỗi `else if` trở nên dài dòng. Câu lệnh `switch` giải quyết tình huống này gọn hơn: nó tính giá trị của biểu thức trong ngoặc rồi nhảy thẳng đến nhãn `case` có giá trị bằng nó. Nếu không có nhãn nào khớp, chương trình nhảy đến nhãn `default` (nếu có)." },
        { loai: "p", text: "Điểm cần nhớ nhất của `switch` là lệnh `break`. Sau khi nhảy vào một `case`, chương trình chạy **tiếp xuống các case bên dưới** cho đến khi gặp `break` hoặc hết khối `switch`. Hiện tượng này gọi là \"rơi xuyên\" (fall-through). Thông thường ta đặt `break` ở cuối mỗi `case`; nhưng đôi khi ta cố ý bỏ `break` để nhiều giá trị dùng chung một đoạn mã, như các tháng có 31 ngày trong ví dụ dưới." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    int thang = 4;
    int soNgay;
    switch (thang) {
        case 1: case 3: case 5: case 7:
        case 8: case 10: case 12:
            soNgay = 31;     // nhiều case dùng chung một đoạn mã
            break;
        case 4: case 6: case 9: case 11:
            soNgay = 30;
            break;
        case 2:
            soNgay = 28;
            break;
        default:
            soNgay = -1;     // tháng không hợp lệ
    }
    cout << soNgay << endl;  // 30

    char phepToan = '*';
    int a = 6, b = 3;
    switch (phepToan) {
        case '+': cout << a + b << endl; break;
        case '-': cout << a - b << endl; break;
        case '*': cout << a * b << endl; break;   // In ra 18
        case '/': cout << a / b << endl; break;
        default:  cout << "Sai phep toan" << endl;
    }

    // Toán tử ba ngôi
    int n = 7;
    cout << (n % 2 == 0 ? "CHAN" : "LE") << endl;   // LE
    int lonHon = (a > b) ? a : b;
    cout << lonHon << endl;                          // 6
    return 0;
}` },
        { loai: "list", items: [
          "Biểu thức của `switch` phải có kiểu **số nguyên hoặc ký tự** (`int`, `char`, `long long`...). Không dùng được với `double` hay `string`.",
          "Giá trị sau `case` phải là **hằng** biết trước lúc biên dịch, không được là biến.",
          "`default` không bắt buộc, nhưng nên có để xử lý trường hợp không mong đợi."
        ] },
        { loai: "p", text: "**Toán tử ba ngôi** `điều_kiện ? giá_trị_1 : giá_trị_2` là cách viết rút gọn của một `if/else` đơn giản để **chọn một giá trị**. Nếu điều kiện đúng, cả biểu thức nhận `giá_trị_1`, ngược lại nhận `giá_trị_2`. Nó rất tiện khi gán hoặc in một trong hai giá trị, ví dụ `int m = (a > b) ? a : b;`. Khi đặt trong `cout`, hãy bọc toàn bộ biểu thức ba ngôi trong ngoặc tròn, vì toán tử `<<` có độ ưu tiên cao hơn `?:`." },
        { loai: "note", text: "Quên `break` là lỗi rất phổ biến khi dùng `switch`: chương trình sẽ chạy luôn cả các case phía dưới. Trình biên dịch `g++` với cờ `-Wextra` sẽ cảnh báo những chỗ rơi xuyên không chủ ý." }
      ]
    },
    {
      id: "c2-l3",
      tieuDe: "Vòng lặp for, while và do-while",
      noiDung: [
        { loai: "p", text: "Vòng lặp cho phép lặp lại một khối lệnh nhiều lần. Thay vì viết 100 câu lệnh in, ta viết một câu lệnh và cho nó lặp 100 lần. C++ có ba loại vòng lặp, mỗi loại hợp với một tình huống khác nhau." },
        { loai: "p", text: "Vòng lặp **for** dùng khi biết trước số lần lặp. Cú pháp `for (khởi_tạo; điều_kiện; cập_nhật)` gồm ba phần: phần khởi tạo chạy một lần duy nhất lúc bắt đầu; trước mỗi lần lặp, điều kiện được kiểm tra, nếu sai thì vòng lặp dừng; sau mỗi lần lặp, phần cập nhật được chạy. Biến đếm khai báo trong `for` (như `int i`) chỉ tồn tại bên trong vòng lặp." },
        { loai: "p", text: "Vòng lặp **while** dùng khi không biết trước số lần lặp mà chỉ biết điều kiện để tiếp tục, ví dụ \"còn chữ số thì còn tách\". Điều kiện được kiểm tra **trước** mỗi lần lặp, nên nếu ngay từ đầu điều kiện đã sai, thân vòng lặp không chạy lần nào. Vòng lặp **do-while** thì kiểm tra điều kiện **sau** mỗi lần lặp, vì vậy thân vòng lặp luôn chạy ít nhất một lần. Nó hợp với việc như hiển thị menu rồi hỏi người dùng có muốn tiếp tục không, hoặc đếm chữ số mà muốn số 0 cũng được tính là có một chữ số." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    // for: tổng 1 + 2 + ... + 100
    int tong = 0;
    for (int i = 1; i <= 100; i++) {
        tong += i;
    }
    cout << tong << endl;   // 5050

    // for với bước nhảy khác 1: in các số lẻ từ 9 về 1
    for (int i = 9; i >= 1; i -= 2) {
        cout << i << " ";
    }
    cout << endl;           // 9 7 5 3 1

    // while: đếm số chữ số của n
    long long n = 20260;
    int dem = 0;
    while (n > 0) {
        n /= 10;            // bỏ chữ số cuối
        dem++;
    }
    cout << dem << endl;    // 5

    // do-while: thân lặp chạy ít nhất một lần, nên số 0 vẫn có 1 chữ số
    int m = 0, demM = 0;
    do {
        m /= 10;
        demM++;
    } while (m > 0);
    cout << demM << endl;   // 1
    return 0;
}` },
        { loai: "table", head: ["Vòng lặp", "Kiểm tra điều kiện", "Số lần chạy tối thiểu", "Khi nào dùng"], rows: [
          ["`for`", "Trước mỗi lần lặp", "0", "Biết trước số lần lặp, duyệt dãy số"],
          ["`while`", "Trước mỗi lần lặp", "0", "Lặp đến khi một điều kiện thay đổi"],
          ["`do-while`", "Sau mỗi lần lặp", "1", "Cần chạy ít nhất một lần"]
        ] },
        { loai: "note", text: "Nếu điều kiện lặp không bao giờ sai, ta có **vòng lặp vô hạn** và chương trình bị treo. Hãy chắc chắn rằng biến trong điều kiện được thay đổi bên trong thân vòng lặp, và nhớ dấu `;` sau `while (...)` của vòng `do-while`." }
      ]
    },
    {
      id: "c2-l4",
      tieuDe: "break, continue và vòng lặp lồng nhau",
      noiDung: [
        { loai: "p", text: "Đôi khi ta cần thay đổi luồng chạy của vòng lặp ngay giữa chừng. C++ cung cấp hai câu lệnh cho việc này. Lệnh `break` **thoát ngay** khỏi vòng lặp chứa nó, các lần lặp còn lại bị bỏ qua. Lệnh `continue` **bỏ qua phần còn lại của lần lặp hiện tại** và chuyển sang lần lặp kế tiếp (với `for`, phần cập nhật vẫn được chạy trước khi kiểm tra điều kiện)." },
        { loai: "p", text: "Một ứng dụng kinh điển của `break` là kiểm tra số nguyên tố: ta thử chia `n` cho các số từ 2 trở đi, chỉ cần gặp một ước là đủ kết luận `n` không nguyên tố và không cần thử tiếp. Ta cũng chỉ cần thử đến căn bậc hai của `n`, vì nếu `n = a * b` với `a ≤ b` thì `a * a ≤ n`. Điều kiện `i * i <= n` diễn đạt đúng ý này mà không cần dùng hàm `sqrt`." },
        { loai: "p", text: "Vòng lặp có thể nằm bên trong vòng lặp khác, gọi là **vòng lặp lồng nhau**. Với mỗi lần lặp của vòng ngoài, vòng trong chạy trọn vẹn từ đầu đến cuối. Nếu vòng ngoài lặp `n` lần và vòng trong lặp `m` lần, thân vòng trong được chạy `n * m` lần. Vòng lồng nhau thường dùng để in hình, duyệt bảng hai chiều hoặc thử mọi cặp giá trị. Lưu ý `break` và `continue` chỉ tác động lên **vòng lặp gần nhất** chứa chúng, không thoát được cả vòng ngoài." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    // break: kiểm tra 91 có phải số nguyên tố không
    int n = 91;
    bool laNguyenTo = (n >= 2);
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            laNguyenTo = false;
            cout << "Uoc nho nhat: " << i << endl;   // Uoc nho nhat: 7
            break;                                    // không cần thử tiếp
        }
    }
    cout << (laNguyenTo ? "YES" : "NO") << endl;      // NO

    // continue: in các số từ 1 đến 10, bỏ qua bội của 3
    for (int i = 1; i <= 10; i++) {
        if (i % 3 == 0) continue;
        cout << i << " ";
    }
    cout << endl;                                     // 1 2 4 5 7 8 10

    // Vòng lặp lồng nhau: in tam giác sao 4 dòng
    for (int dong = 1; dong <= 4; dong++) {
        for (int k = 1; k <= dong; k++) {
            cout << "*";
        }
        cout << endl;
    }
    // *
    // **
    // ***
    // ****
    return 0;
}` },
        { loai: "p", text: "Khi viết vòng lặp lồng nhau, hãy đặt tên biến đếm khác nhau cho từng vòng (`dong` và `k` ở trên, hay `i` và `j`). Dùng chung một biến cho cả hai vòng là lỗi rất khó phát hiện, vì vòng trong sẽ làm thay đổi biến đếm của vòng ngoài." },
        { loai: "note", text: "Vòng lặp lồng nhau tốn thời gian rất nhanh: hai vòng lồng nhau, mỗi vòng 100 000 lần, là 10 tỉ lần lặp và sẽ chạy nhiều giây. Trước khi viết, hãy ước lượng tổng số lần lặp." }
      ]
    },
    {
      id: "c2-l5",
      tieuDe: "Hàm: khai báo, định nghĩa và giá trị trả về",
      noiDung: [
        { loai: "p", text: "Khi chương trình dài ra, viết mọi thứ trong `main` khiến mã rối và lặp lại. **Hàm** là một khối lệnh có tên, nhận dữ liệu đầu vào qua **tham số**, thực hiện một công việc cụ thể và có thể **trả về** một kết quả. Chia chương trình thành các hàm giúp mỗi phần ngắn gọn, dễ kiểm tra, và một đoạn mã viết một lần có thể gọi lại nhiều lần." },
        { loai: "p", text: "Một hàm được định nghĩa theo dạng `kiểu_trả_về tên_hàm(danh_sách_tham_số) { thân hàm }`. Câu lệnh `return giá_trị;` kết thúc hàm ngay lập tức và gửi giá trị về nơi gọi. Nếu hàm không trả về gì, kiểu trả về là `void`, và có thể dùng `return;` không kèm giá trị để thoát sớm. Hàm có kiểu trả về khác `void` thì **mọi đường chạy** đều phải gặp một lệnh `return`." },
        { loai: "p", text: "C++ đọc mã nguồn từ trên xuống, nên một hàm phải được **khai báo trước khi gọi**. Có hai cách: đặt toàn bộ định nghĩa hàm phía trên `main`, hoặc chỉ viết **nguyên mẫu hàm** (prototype) phía trên `main` rồi đặt định nghĩa đầy đủ phía dưới. Nguyên mẫu là dòng đầu của hàm kết thúc bằng dấu `;`, cho trình biên dịch biết tên, kiểu trả về và kiểu các tham số. Cách thứ hai giúp `main` nằm ở đầu tệp, đọc vào là thấy ngay chương trình làm gì." },
        { loai: "code", text: `#include <iostream>
using namespace std;

// Nguyên mẫu hàm (khai báo)
int binhPhuong(int x);
bool laSoChan(int n);
int tongChuSo(long long n);
void inDuong(int doDai);

int main() {
    cout << binhPhuong(7) << endl;           // 49
    cout << laSoChan(10) << endl;            // 1
    cout << tongChuSo(2026) << endl;         // 10
    inDuong(5);                              // -----
    int a = binhPhuong(3) + binhPhuong(4);   // gọi hàm trong biểu thức
    cout << a << endl;                       // 25
    return 0;
}

// Định nghĩa hàm
int binhPhuong(int x) {
    return x * x;
}

bool laSoChan(int n) {
    return n % 2 == 0;
}

int tongChuSo(long long n) {
    int tong = 0;
    while (n > 0) {
        tong += n % 10;
        n /= 10;
    }
    return tong;
}

void inDuong(int doDai) {
    for (int i = 0; i < doDai; i++) cout << "-";
    cout << endl;
}` },
        { loai: "p", text: "Biến khai báo bên trong một hàm (kể cả tham số) là **biến cục bộ**: nó chỉ tồn tại trong lúc hàm đang chạy và chỉ nhìn thấy được bên trong hàm đó. Vì vậy biến `tong` trong `tongChuSo` hoàn toàn độc lập với một biến `tong` nào đó trong `main`. Khi gọi hàm, các **đối số** (giá trị truyền vào như `7`, `2026`) được gán lần lượt cho các **tham số** theo đúng thứ tự." },
        { loai: "note", text: "Nếu bạn khai báo nguyên mẫu mà quên viết định nghĩa, chương trình vẫn biên dịch được nhưng sẽ báo lỗi ở giai đoạn **liên kết** (undefined reference). Đây chính là loại lỗi liên kết đã nhắc ở Chương 1." }
      ]
    },
    {
      id: "c2-l6",
      tieuDe: "Tham trị, tham chiếu, tham số mặc định và nạp chồng hàm",
      noiDung: [
        { loai: "p", text: "Mặc định, C++ **truyền tham trị** (pass by value): tham số là một **bản sao** của đối số. Hàm thay đổi tham số bao nhiêu cũng không ảnh hưởng đến biến bên ngoài. Điều này an toàn, nhưng đôi khi ta lại muốn hàm sửa được biến của nơi gọi, ví dụ hàm hoán đổi hai số, hoặc hàm cần trả về nhiều hơn một kết quả. Khi đó ta dùng **truyền tham chiếu** (pass by reference) bằng cách thêm dấu `&` sau kiểu của tham số: `void hoanDoi(int &a, int &b)`. Lúc này tham số chỉ là **một tên khác** của chính biến được truyền vào, mọi thay đổi trên tham số chính là thay đổi trên biến gốc." },
        { loai: "p", text: "Truyền tham chiếu còn giúp tránh sao chép dữ liệu lớn (như chuỗi dài hay danh sách nhiều phần tử). Nếu chỉ muốn đọc mà không cho sửa, ta dùng **tham chiếu hằng** `const string &s`. Lưu ý: đối số truyền vào tham số tham chiếu phải là một biến, không thể là hằng số hay biểu thức như `hoanDoi(3, 5)`." },
        { loai: "p", text: "**Tham số mặc định** cho phép bỏ qua một số đối số khi gọi hàm; khi đó tham số nhận giá trị mặc định đã ghi trong khai báo. Các tham số có giá trị mặc định phải nằm **ở cuối** danh sách tham số, và giá trị mặc định chỉ ghi một lần (thường ở nguyên mẫu). **Nạp chồng hàm** (overloading) là việc định nghĩa nhiều hàm **cùng tên** nhưng khác nhau về số lượng hoặc kiểu tham số. Trình biên dịch dựa vào các đối số lúc gọi để chọn đúng phiên bản. Hai hàm chỉ khác nhau về kiểu trả về thì không được coi là nạp chồng hợp lệ." },
        { loai: "code", text: `#include <iostream>
using namespace std;

void tangThamTri(int x)     { x++; }   // x là bản sao
void tangThamChieu(int &x)  { x++; }   // x là tên khác của biến gốc

void hoanDoi(int &a, int &b) {
    int tam = a;
    a = b;
    b = tam;
}

// Trả về hai kết quả qua tham chiếu
void chiaLayDu(int a, int b, int &thuong, int &du) {
    thuong = a / b;
    du = a % b;
}

// Tham số mặc định phải nằm ở cuối
int tinhTien(int donGia, int soLuong = 1, int giamGia = 0) {
    return donGia * soLuong - giamGia;
}

// Nạp chồng: cùng tên, khác tham số
int lonNhat(int a, int b)           { return a > b ? a : b; }
int lonNhat(int a, int b, int c)    { return lonNhat(lonNhat(a, b), c); }
double lonNhat(double a, double b)  { return a > b ? a : b; }

int main() {
    int n = 5;
    tangThamTri(n);
    cout << n << endl;          // 5  (không đổi)
    tangThamChieu(n);
    cout << n << endl;          // 6

    int p = 1, q = 2;
    hoanDoi(p, q);
    cout << p << " " << q << endl;   // 2 1

    int th, du;
    chiaLayDu(17, 5, th, du);
    cout << th << " " << du << endl; // 3 2

    cout << tinhTien(50000) << endl;           // 50000
    cout << tinhTien(50000, 3) << endl;        // 150000
    cout << tinhTien(50000, 3, 20000) << endl; // 130000

    cout << lonNhat(3, 8) << " " << lonNhat(3, 8, 5) << " "
         << lonNhat(2.5, 1.5) << endl;         // 8 8 2.5
    return 0;
}` },
        { loai: "table", head: ["Cách truyền", "Khai báo", "Hàm sửa được biến gốc?", "Có sao chép?"], rows: [
          ["Tham trị", "`void f(int x)`", "Không", "Có"],
          ["Tham chiếu", "`void f(int &x)`", "Có", "Không"],
          ["Tham chiếu hằng", "`void f(const string &s)`", "Không (bị cấm)", "Không"]
        ] },
        { loai: "note", text: "Gọi `lonNhat(3, 2.5)` sẽ gây lỗi biên dịch \"ambiguous\" (mơ hồ), vì một đối số là `int`, một là `double` và trình biên dịch không biết nên chọn phiên bản nào. Hãy truyền đối số cùng kiểu, ví dụ `lonNhat(3.0, 2.5)`." }
      ]
    },
    {
      id: "c2-l7",
      tieuDe: "Đệ quy",
      noiDung: [
        { loai: "p", text: "**Đệ quy** là kỹ thuật trong đó một hàm **gọi lại chính nó** để giải một bài toán nhỏ hơn cùng dạng. Rất nhiều khái niệm trong toán học được định nghĩa đệ quy một cách tự nhiên: giai thừa `n! = n * (n-1)!`, dãy Fibonacci `F(n) = F(n-1) + F(n-2)`. Viết hàm đệ quy thực chất là chép lại định nghĩa đó sang C++." },
        { loai: "p", text: "Mỗi hàm đệ quy đúng đắn đều có hai phần. **Trường hợp cơ sở** (điểm dừng) là trường hợp đủ nhỏ để trả lời trực tiếp mà không cần gọi đệ quy, ví dụ `0! = 1`. **Bước đệ quy** đưa bài toán về một hoặc vài bài toán nhỏ hơn và gọi lại hàm cho chúng. Mỗi lần gọi đệ quy, dữ liệu phải tiến gần hơn về trường hợp cơ sở; nếu không, hàm sẽ gọi mãi không dừng." },
        { loai: "p", text: "Mỗi lần gọi hàm, máy tính cấp một vùng nhớ trên **ngăn xếp lời gọi** (call stack) để lưu tham số và biến cục bộ của lần gọi đó. Khi tính `giaiThua(4)`, ngăn xếp lần lượt chứa `giaiThua(4)`, `giaiThua(3)`, `giaiThua(2)`, `giaiThua(1)`, `giaiThua(0)`; lần gọi cuối trả về 1, rồi các lần gọi trước lần lượt nhân kết quả và trả về: 1, 2, 6, 24. Nếu đệ quy quá sâu (hàng trăm nghìn tầng) hoặc thiếu điểm dừng, ngăn xếp bị đầy và chương trình dừng đột ngột với lỗi **tràn ngăn xếp** (stack overflow)." },
        { loai: "code", text: `#include <iostream>
using namespace std;

long long giaiThua(int n) {
    if (n == 0) return 1;            // trường hợp cơ sở
    return n * giaiThua(n - 1);      // bước đệ quy
}

long long fibo(int n) {
    if (n <= 1) return n;            // F(0) = 0, F(1) = 1
    return fibo(n - 1) + fibo(n - 2);
}

int tongChuSo(int n) {
    if (n < 10) return n;
    return n % 10 + tongChuSo(n / 10);
}

// Ước chung lớn nhất theo thuật toán Euclid
int ucln(int a, int b) {
    if (b == 0) return a;
    return ucln(b, a % b);
}

int main() {
    cout << giaiThua(4) << " " << giaiThua(20) << endl;  // 24 2432902008176640000
    cout << fibo(10) << endl;                             // 55
    cout << tongChuSo(98765) << endl;                     // 35
    cout << ucln(84, 36) << endl;                         // 12
    return 0;
}` },
        { loai: "p", text: "Đệ quy giúp lời giải ngắn gọn và gần với cách suy nghĩ toán học, nhưng không phải lúc nào cũng hiệu quả. Hàm `fibo` ở trên gọi lại cùng một giá trị rất nhiều lần: để tính `fibo(40)` nó gọi hàm hơn 300 triệu lần. Với những bài như vậy, một vòng lặp đơn giản lưu hai số liền trước sẽ nhanh hơn rất nhiều. Ngược lại, có những bài toán mà lời giải đệ quy tự nhiên hơn hẳn vòng lặp, như bài Tháp Hà Nội trong phần bài tập." },
        { loai: "note", text: "Khi viết hàm đệ quy, hãy viết **trường hợp cơ sở trước**, sau đó tự hỏi: \"mỗi lần gọi, tham số có nhỏ dần về trường hợp cơ sở không?\". Thiếu một trong hai điều này là nguyên nhân phổ biến nhất của đệ quy vô hạn." }
      ]
    }
  ],
  baiTap: [
    {
      id: "c2-bt1",
      muc: 1,
      tieuDe: "Chẵn hay lẻ",
      deBai: "Nhập một số nguyên `n` (|n| ≤ 10^9, có thể âm). In ra `CHAN` nếu `n` là số chẵn, ngược lại in `LE`.",
      viDu: { input: "-7", output: "LE" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n % 2 == 0) {
        cout << "CHAN" << endl;
    } else {
        cout << "LE" << endl;
    }
    return 0;
}`,
      giaiThich: "Một số là chẵn khi chia hết cho 2, tức `n % 2 == 0`. Không nên kiểm tra `n % 2 == 1`, vì với số âm lẻ như -7, phép `%` trong C++ cho kết quả -1 chứ không phải 1."
    },
    {
      id: "c2-bt2",
      muc: 1,
      tieuDe: "Số lớn nhất trong ba số",
      deBai: "Nhập ba số nguyên `a`, `b`, `c` trên một dòng. In ra số lớn nhất trong ba số.",
      viDu: { input: "3 9 5", output: "9" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    int lonNhat = a;            // giả sử a lớn nhất
    if (b > lonNhat) lonNhat = b;
    if (c > lonNhat) lonNhat = c;
    cout << lonNhat << endl;
    return 0;
}`,
      giaiThich: "Giả sử số đầu tiên lớn nhất, sau đó so sánh lần lượt với từng số còn lại và cập nhật khi gặp số lớn hơn. Cách này gọn hơn `if` lồng nhau và mở rộng dễ dàng cho nhiều số."
    },
    {
      id: "c2-bt3",
      muc: 2,
      tieuDe: "Số ngày trong tháng",
      deBai: "Nhập tháng `m` (1 ≤ m ≤ 12) và năm `y` (1 ≤ y ≤ 9999) trên một dòng. In ra số ngày của tháng đó. Tháng 2 có 29 ngày nếu là năm nhuận (chia hết cho 400, hoặc chia hết cho 4 nhưng không chia hết cho 100), ngược lại có 28 ngày. Dùng câu lệnh `switch`.",
      viDu: { input: "2 2024", output: "29" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    int m, y;
    cin >> m >> y;
    int soNgay = 0;
    switch (m) {
        case 4: case 6: case 9: case 11:
            soNgay = 30;
            break;
        case 2: {
            bool nhuan = (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
            soNgay = nhuan ? 29 : 28;
            break;
        }
        default:
            soNgay = 31;
    }
    cout << soNgay << endl;
    return 0;
}`,
      giaiThich: "Các tháng 4, 6, 9, 11 dùng chung một nhánh nhờ rơi xuyên giữa các `case`. Tháng 2 dùng toán tử ba ngôi với điều kiện năm nhuận; các tháng còn lại có 31 ngày nên đặt ở `default`. Khi khai báo biến bên trong một `case`, cần bọc nhánh đó trong cặp ngoặc nhọn."
    },
    {
      id: "c2-bt4",
      muc: 2,
      tieuDe: "Đếm chữ số và tổng chữ số",
      deBai: "Nhập một số nguyên không âm `n` (0 ≤ n ≤ 10^18). In ra số chữ số của `n` và tổng các chữ số của `n`, cách nhau một dấu cách. Lưu ý số 0 có một chữ số.",
      viDu: { input: "20260", output: "5 10" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int dem = 0, tong = 0;
    do {
        tong += n % 10;   // lấy chữ số cuối
        n /= 10;          // bỏ chữ số cuối
        dem++;
    } while (n > 0);
    cout << dem << " " << tong << endl;
    return 0;
}`,
      giaiThich: "Lặp lại việc lấy chữ số cuối bằng `n % 10` rồi bỏ nó đi bằng `n /= 10` cho đến khi `n` bằng 0. Dùng `do-while` để thân vòng lặp chạy ít nhất một lần, nhờ đó số 0 vẫn được đếm là có một chữ số."
    },
    {
      id: "c2-bt5",
      muc: 3,
      tieuDe: "Kiểm tra số nguyên tố",
      deBai: "Viết hàm `bool laNguyenTo(long long n)` và dùng nó để kiểm tra số `n` nhập vào (1 ≤ n ≤ 2·10^9). In ra `YES` nếu `n` là số nguyên tố, ngược lại in `NO`.",
      viDu: { input: "97", output: "YES" },
      loiGiai: `#include <iostream>
using namespace std;

bool laNguyenTo(long long n) {
    if (n < 2) return false;
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;   // gặp ước thì kết luận ngay
    }
    return true;
}

int main() {
    long long n;
    cin >> n;
    cout << (laNguyenTo(n) ? "YES" : "NO") << endl;
    return 0;
}`,
      giaiThich: "Chỉ cần thử các ước từ 2 đến căn bậc hai của `n`; gặp ước đầu tiên thì `return false` ngay. Biến `i` dùng kiểu `long long` để `i * i` không bị tràn khi `n` gần 2·10^9."
    },
    {
      id: "c2-bt6",
      muc: 3,
      tieuDe: "Ước chung lớn nhất và bội chung nhỏ nhất",
      deBai: "Nhập hai số nguyên dương `a` và `b` (1 ≤ a, b ≤ 10^9). In ra ước chung lớn nhất và bội chung nhỏ nhất của chúng, cách nhau một dấu cách. Viết hàm đệ quy để tính ước chung lớn nhất.",
      viDu: { input: "12 18", output: "6 36" },
      loiGiai: `#include <iostream>
using namespace std;

long long ucln(long long a, long long b) {
    if (b == 0) return a;
    return ucln(b, a % b);   // thuật toán Euclid
}

long long bcnn(long long a, long long b) {
    return a / ucln(a, b) * b;   // chia trước để giảm nguy cơ tràn số
}

int main() {
    long long a, b;
    cin >> a >> b;
    cout << ucln(a, b) << " " << bcnn(a, b) << endl;
    return 0;
}`,
      giaiThich: "Thuật toán Euclid dựa trên tính chất `ucln(a, b) = ucln(b, a % b)` và dừng khi `b` bằng 0. Bội chung nhỏ nhất bằng `a * b / ucln`; ta chia trước rồi mới nhân và dùng `long long` vì kết quả có thể lên đến 10^18."
    },
    {
      id: "c2-bt7",
      muc: 4,
      tieuDe: "Tháp Hà Nội",
      deBai: "Có ba cột A, B, C và `n` đĩa (1 ≤ n ≤ 15) kích thước khác nhau xếp ở cột A, đĩa lớn ở dưới. Cần chuyển toàn bộ sang cột C, mỗi lần chỉ chuyển một đĩa trên cùng và không bao giờ đặt đĩa lớn lên đĩa nhỏ. Dòng đầu in số lần chuyển ít nhất; các dòng sau in lần lượt từng lần chuyển theo dạng `X -> Y`.",
      viDu: { input: "3", output: "7\nA -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C" },
      loiGiai: `#include <iostream>
using namespace std;

// Chuyển n đĩa từ cột tu sang cột den, dùng cột trung gian
void chuyen(int n, char tu, char den, char trungGian) {
    if (n == 0) return;                      // không còn đĩa: dừng
    chuyen(n - 1, tu, trungGian, den);       // dời n-1 đĩa sang cột trung gian
    cout << tu << " -> " << den << "\\n";     // chuyển đĩa lớn nhất
    chuyen(n - 1, trungGian, den, tu);       // đưa n-1 đĩa về cột đích
}

int main() {
    int n;
    cin >> n;
    cout << (1 << n) - 1 << "\\n";            // 2^n - 1 lần chuyển
    chuyen(n, 'A', 'C', 'B');
    return 0;
}`,
      giaiThich: "Muốn chuyển `n` đĩa từ A sang C, ta chuyển `n-1` đĩa trên sang B, chuyển đĩa lớn nhất sang C, rồi chuyển `n-1` đĩa từ B sang C. Trường hợp cơ sở là không còn đĩa nào. Số lần chuyển thỏa mãn `T(n) = 2T(n-1) + 1` nên bằng `2^n - 1`, tính nhanh bằng phép dịch bit `1 << n`."
    },
    {
      id: "c2-bt8",
      muc: 4,
      tieuDe: "Phân tích thừa số nguyên tố",
      deBai: "Nhập số nguyên `n` (2 ≤ n ≤ 10^12). In ra dạng phân tích `n` thành tích các thừa số nguyên tố, các thừa số theo thứ tự tăng dần, nối nhau bằng ` * `. Thừa số có số mũ lớn hơn 1 viết dạng `p^k`, số mũ bằng 1 thì chỉ viết `p`.",
      viDu: { input: "360", output: "2^3 * 3^2 * 5" },
      loiGiai: `#include <iostream>
using namespace std;

// In thừa số p với số mũ k, kèm dấu " * " nếu không phải thừa số đầu tiên
void inThuaSo(long long p, int k, bool &dauTien) {
    if (!dauTien) cout << " * ";
    cout << p;
    if (k > 1) cout << "^" << k;
    dauTien = false;
}

int main() {
    long long n;
    cin >> n;
    bool dauTien = true;
    for (long long p = 2; p * p <= n; p++) {
        int k = 0;
        while (n % p == 0) {   // chia hết bao nhiêu lần thì số mũ bấy nhiêu
            n /= p;
            k++;
        }
        if (k > 0) inThuaSo(p, k, dauTien);
    }
    if (n > 1) inThuaSo(n, 1, dauTien);   // phần còn lại là một số nguyên tố
    cout << endl;
    return 0;
}`,
      giaiThich: "Thử chia `n` cho `p` từ 2 trở lên, mỗi khi chia hết thì chia liên tục và đếm số mũ; vì đã chia hết các thừa số nhỏ nên `p` nào chia hết cũng là số nguyên tố. Chỉ cần thử đến căn bậc hai của `n` hiện tại, phần còn lại lớn hơn 1 chính là thừa số nguyên tố cuối cùng. Biến `dauTien` truyền tham chiếu để hàm in biết khi nào cần thêm dấu ` * `."
    }
  ]
};
