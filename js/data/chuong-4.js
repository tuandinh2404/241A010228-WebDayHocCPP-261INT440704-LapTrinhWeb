window.CHUONG = window.CHUONG || {};
window.CHUONG[4] = {
  so: 4,
  ten: "Con trỏ & bộ nhớ động",
  tomTat: "Hiểu biến nằm ở đâu trong bộ nhớ, dùng con trỏ để đọc và sửa dữ liệu gián tiếp, duyệt mảng bằng số học con trỏ, phân biệt tham chiếu với con trỏ, tự cấp phát và giải phóng bộ nhớ bằng new/delete mà không gây rò rỉ hay con trỏ treo, và làm việc với struct thông qua toán tử ->.",
  baiGiang: [
    {
      id: "c4-l1",
      tieuDe: "Địa chỉ ô nhớ và toán tử &",
      noiDung: [
        { loai: "p", text: "Khi chương trình chạy, mọi biến đều được đặt vào **bộ nhớ trong** (RAM). Có thể hình dung RAM như một dãy rất dài các ô, mỗi ô chứa 1 byte và được đánh số liên tiếp. Con số đánh dấu vị trí của một ô gọi là **địa chỉ** (address). Một biến `int` thường chiếm 4 byte liên tiếp, một biến `double` chiếm 8 byte; địa chỉ của biến chính là địa chỉ của byte đầu tiên trong vùng nhớ đó." },
        { loai: "p", text: "Cho đến giờ ta chỉ làm việc với **giá trị** của biến: gán, đọc, tính toán. C++ còn cho phép hỏi **biến này nằm ở đâu** bằng toán tử lấy địa chỉ `&` đặt trước tên biến. Kết quả của `&tuoi` là địa chỉ của biến `tuoi`, khi in ra bằng `cout` sẽ hiện ở dạng số thập lục phân như `0x61fe1c`. Toán tử `sizeof` cho biết một biến hay một kiểu chiếm bao nhiêu byte." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    int tuoi = 19;
    double diem = 8.5;

    cout << "Gia tri cua tuoi: " << tuoi << endl;   // 19
    cout << "Dia chi cua tuoi: " << &tuoi << endl;  // vi du 0x61fe1c, moi lan chay co the khac
    cout << "Dia chi cua diem: " << &diem << endl;  // mot dia chi khac

    cout << "sizeof(tuoi) = " << sizeof(tuoi) << endl;  // 4 (tren hau het may hien nay)
    cout << "sizeof(diem) = " << sizeof(diem) << endl;  // 8
    return 0;
}` },
        { loai: "p", text: "Địa chỉ do hệ điều hành và trình biên dịch quyết định, vì vậy giá trị in ra thay đổi giữa các máy và thậm chí giữa các lần chạy. Ta **không bao giờ** tự bịa ra một con số rồi coi nó là địa chỉ; ta chỉ lấy địa chỉ của những thứ đang thật sự tồn tại bằng `&`, hoặc nhận địa chỉ do `new` trả về (học ở phần sau)." },
        { loai: "p", text: "Vì sao cần biết địa chỉ? Có ba lý do chính mà chương này sẽ lần lượt giải quyết:" },
        { loai: "list", items: [
          "Cho phép một hàm **sửa biến của nơi gọi** (ví dụ hàm hoán đổi hai số).",
          "Duyệt **mảng** hiệu quả, vì các phần tử của mảng nằm sát nhau trong bộ nhớ.",
          "Tạo dữ liệu có kích thước **chỉ biết lúc chạy** (mảng động, danh sách liên kết) bằng `new` và `delete`."
        ] },
        { loai: "note", text: "Ký hiệu `&` có hai vai trò khác nhau: đứng trước một biến trong biểu thức (`&tuoi`) là lấy địa chỉ; đứng trong khai báo kiểu (`int& r = tuoi;`) là khai báo tham chiếu. Đừng nhầm lẫn hai cách dùng này." }
      ]
    },
    {
      id: "c4-l2",
      tieuDe: "Con trỏ, toán tử * và nullptr",
      noiDung: [
        { loai: "p", text: "**Con trỏ** (pointer) là một biến mà giá trị của nó là **một địa chỉ**. Khai báo con trỏ bằng cách thêm dấu `*` sau kiểu dữ liệu mà nó trỏ tới: `int* p;` đọc là \"p là con trỏ tới int\". Kiểu của con trỏ rất quan trọng: con trỏ `int*` chỉ được giữ địa chỉ của một `int`, con trỏ `double*` chỉ giữ địa chỉ của một `double`." },
        { loai: "p", text: "Khi đã có con trỏ, toán tử **giải tham chiếu** `*` đặt trước tên con trỏ cho phép truy cập đến chính ô nhớ mà nó trỏ tới. Nếu `p` trỏ tới `x` thì `*p` chính là `x`: đọc `*p` là đọc `x`, gán `*p = 25` là gán `x = 25`. Đây là cách ta làm việc **gián tiếp** với một biến thông qua địa chỉ của nó." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    int x = 10;
    int* p = &x;          // p giu dia chi cua x

    cout << *p << endl;   // 10  (doc x thong qua p)
    *p = 25;              // sua x thong qua p
    cout << x << endl;    // 25

    int y = 7;
    p = &y;               // con tro co the doi sang tro bien khac
    *p += 1;              // y = 8
    cout << y << endl;    // 8

    int* q = nullptr;     // q chua tro vao dau ca
    if (q == nullptr) {
        cout << "q chua tro vao dau" << endl;
    }
    return 0;
}` },
        { loai: "table", head: ["Cách viết", "Ý nghĩa"], rows: [
          ["`int* p;`", "Khai báo `p` là con trỏ tới `int` (chưa khởi tạo, giá trị rác)"],
          ["`p = &x;`", "Cho `p` trỏ tới biến `x`"],
          ["`*p`", "Ô nhớ mà `p` đang trỏ tới (ở đây là `x`)"],
          ["`p`", "Bản thân địa chỉ được lưu trong `p`"],
          ["`int* q = nullptr;`", "Con trỏ rỗng, quy ước là không trỏ vào đâu"]
        ] },
        { loai: "p", text: "Một con trỏ vừa khai báo mà chưa gán sẽ chứa **giá trị rác**, tức một địa chỉ ngẫu nhiên. Giải tham chiếu con trỏ như vậy là lỗi nghiêm trọng: chương trình có thể ghi đè dữ liệu khác hoặc bị dừng đột ngột. Vì thế hãy luôn khởi tạo con trỏ, nếu chưa có gì để trỏ thì gán `nullptr`. Từ khóa `nullptr` (có từ C++11) thay cho cách viết cũ `NULL` hoặc `0`, an toàn hơn vì nó có kiểu riêng là con trỏ." },
        { loai: "p", text: "Trước khi dùng `*p`, nếu không chắc chắn `p` có hợp lệ hay không, hãy kiểm tra `if (p != nullptr)`. Giải tham chiếu `nullptr` luôn là lỗi và thường làm chương trình bị hệ điều hành dừng ngay." },
        { loai: "note", text: "Lỗi hay gặp: viết `int* a, b;` rồi nghĩ cả `a` và `b` đều là con trỏ. Thực ra dấu `*` chỉ gắn với `a`, còn `b` là `int` thường. Muốn hai con trỏ hãy viết `int *a, *b;` hoặc khai báo trên hai dòng." }
      ]
    },
    {
      id: "c4-l3",
      tieuDe: "Con trỏ với mảng và số học con trỏ",
      noiDung: [
        { loai: "p", text: "Các phần tử của một mảng được đặt **liền nhau** trong bộ nhớ. Tên mảng khi dùng trong biểu thức tự động chuyển thành con trỏ tới phần tử đầu tiên, nên `int* p = a;` tương đương `int* p = &a[0];`. Từ đó C++ cho phép làm toán trên con trỏ: `p + 1` không phải là địa chỉ cộng thêm 1 byte, mà là địa chỉ của **phần tử kế tiếp**. Trình biên dịch tự nhân với kích thước kiểu, nên với `int*` thì `p + 1` thực tế tiến thêm 4 byte." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    int a[5] = {10, 20, 30, 40, 50};
    int* p = a;                  // giong p = &a[0]

    cout << *p << endl;          // 10
    cout << *(p + 2) << endl;    // 30  (phan tu a[2])
    cout << p[3] << endl;        // 40  (p[i] chinh la *(p + i))

    p++;                         // p tro sang a[1]
    cout << *p << endl;          // 20

    int* cuoi = a + 5;           // vi tri ngay sau phan tu cuoi
    int tong = 0;
    for (int* q = a; q != cuoi; q++) {
        tong += *q;
    }
    cout << tong << endl;        // 150
    cout << cuoi - a << endl;    // 5  (hieu hai con tro = so phan tu)
    return 0;
}` },
        { loai: "p", text: "Các phép toán hợp lệ trên con trỏ gồm:" },
        { loai: "list", items: [
          "`p + k`, `p - k`: con trỏ tới phần tử cách `p` đúng `k` vị trí.",
          "`p++`, `p--`: dịch con trỏ sang phần tử kế tiếp hoặc phía trước.",
          "`q - p`: số phần tử nằm giữa hai con trỏ cùng thuộc một mảng.",
          "So sánh `p < q`, `p == q`, `p != q` giữa hai con trỏ cùng một mảng.",
          "`p[i]` là cách viết gọn của `*(p + i)`; vì thế `a[i]` và `*(a + i)` là một."
        ] },
        { loai: "p", text: "Khi truyền mảng vào hàm, thứ thật sự được truyền là **con trỏ tới phần tử đầu**, không phải bản sao của cả mảng. Hàm `int tinhTong(const int* a, int n)` và `int tinhTong(const int a[], int n)` hoàn toàn giống nhau. Do đó hàm có thể sửa trực tiếp mảng gốc, và hàm **không biết** mảng dài bao nhiêu, nên ta luôn phải truyền kèm số phần tử `n`. Từ khóa `const` trước kiểu cho biết hàm chỉ đọc chứ không sửa dữ liệu." },
        { loai: "p", text: "Con trỏ `a + n` (ngay sau phần tử cuối) được phép **tính** và **so sánh**, đây chính là điểm dừng của vòng lặp trong ví dụ trên. Tuy nhiên tuyệt đối không được **giải tham chiếu** nó, vì ô nhớ đó không thuộc mảng." },
        { loai: "note", text: "Bên trong hàm nhận tham số mảng, `sizeof(a)` chỉ trả về kích thước của một con trỏ (thường là 8), không phải kích thước cả mảng. Đừng dùng `sizeof` để đếm số phần tử của mảng được truyền vào hàm." }
      ]
    },
    {
      id: "c4-l4",
      tieuDe: "Tham chiếu so với con trỏ",
      noiDung: [
        { loai: "p", text: "Mặc định C++ truyền tham số **theo giá trị**: hàm nhận một bản sao, sửa bản sao không ảnh hưởng tới biến gốc. Muốn hàm sửa được biến của nơi gọi, ta có hai cách: truyền **con trỏ** (địa chỉ của biến) hoặc truyền **tham chiếu**. Ví dụ kinh điển là hàm hoán đổi hai số." },
        { loai: "code", text: `#include <iostream>
using namespace std;

void hoanDoiGiaTri(int a, int b) {     // chi doi ban sao
    int tam = a; a = b; b = tam;
}

void hoanDoiConTro(int* a, int* b) {   // nhan dia chi
    int tam = *a; *a = *b; *b = tam;
}

void hoanDoiThamChieu(int& a, int& b) { // a, b la ten khac cua bien goc
    int tam = a; a = b; b = tam;
}

int main() {
    int x = 1, y = 2;
    hoanDoiGiaTri(x, y);
    cout << x << " " << y << endl;   // 1 2  (khong doi)
    hoanDoiConTro(&x, &y);
    cout << x << " " << y << endl;   // 2 1
    hoanDoiThamChieu(x, y);
    cout << x << " " << y << endl;   // 1 2  (doi lai lan nua)

    int& r = x;   // r la biet danh cua x
    r = 100;
    cout << x << endl;               // 100
    return 0;
}` },
        { loai: "p", text: "**Tham chiếu** (reference) là một tên gọi khác của một biến đã tồn tại. Sau khi `int& r = x;` thì `r` và `x` là cùng một ô nhớ, mọi thao tác trên `r` thực chất là trên `x`. Bên trong, trình biên dịch thường cài đặt tham chiếu bằng con trỏ, nhưng cú pháp gọn hơn nhiều: không cần `&` khi gọi hàm, không cần `*` khi dùng." },
        { loai: "table", head: ["Tiêu chí", "Con trỏ", "Tham chiếu"], rows: [
          ["Khai báo", "`int* p = &x;`", "`int& r = x;`"],
          ["Bắt buộc khởi tạo", "Không (nhưng nên)", "Có, ngay khi khai báo"],
          ["Có thể rỗng", "Có (`nullptr`)", "Không"],
          ["Đổi sang biến khác", "Được (`p = &y;`)", "Không, gắn cố định suốt đời"],
          ["Truy cập giá trị", "`*p`", "`r`"],
          ["Số học, duyệt mảng", "Được", "Không"]
        ] },
        { loai: "p", text: "Quy tắc chọn đơn giản: dùng **tham chiếu** cho tham số hàm khi cần sửa biến gốc hoặc khi muốn tránh sao chép dữ liệu lớn (viết `const string& s` nếu chỉ đọc). Dùng **con trỏ** khi cần khả năng \"không trỏ vào đâu\" (`nullptr`), khi cần đổi đối tượng được trỏ, khi duyệt mảng, hoặc khi làm việc với bộ nhớ cấp phát động." },
        { loai: "note", text: "Không được trả về tham chiếu hay con trỏ tới **biến cục bộ** của hàm: khi hàm kết thúc, biến đó bị hủy và tham chiếu/con trỏ trở thành vô nghĩa." }
      ]
    },
    {
      id: "c4-l5",
      tieuDe: "Cấp phát động với new/delete và new[]/delete[]",
      noiDung: [
        { loai: "p", text: "Các biến cục bộ thông thường nằm trên **stack**: chúng được tạo khi vào khối lệnh và tự hủy khi ra khỏi khối. Kích thước của chúng phải biết lúc biên dịch, và stack khá nhỏ (thường vài MB). Khi cần dữ liệu có kích thước **chỉ biết lúc chạy** (ví dụ người dùng nhập `n`), hoặc cần dữ liệu sống lâu hơn hàm tạo ra nó, ta xin bộ nhớ từ vùng **heap** bằng toán tử `new`." },
        { loai: "p", text: "`new` cấp phát vùng nhớ trên heap và trả về **địa chỉ** của vùng đó, nên kết quả luôn được cất vào một con trỏ. Bộ nhớ trên heap **không tự giải phóng**: lập trình viên phải trả lại bằng `delete` khi không dùng nữa. Cấp phát một biến đơn dùng cặp `new`/`delete`; cấp phát một mảng dùng cặp `new[]`/`delete[]`." },
        { loai: "code", text: `#include <iostream>
using namespace std;

int main() {
    // Mot bien don tren heap
    int* p = new int(42);
    cout << *p << endl;          // 42
    delete p;                    // tra bo nho
    p = nullptr;                 // tranh dung lai dia chi cu

    // Mot mang dong, kich thuoc co the la bien
    int n = 5;
    int* a = new int[n];
    for (int i = 0; i < n; i++) {
        a[i] = (i + 1) * (i + 1);
    }
    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";     // 1 4 9 16 25
    }
    cout << endl;
    delete[] a;                  // mang thi phai dung delete[]
    a = nullptr;
    return 0;
}` },
        { loai: "table", head: ["Cấp phát", "Giải phóng", "Dùng khi"], rows: [
          ["`new int`, `new int(5)`", "`delete p;`", "Một biến đơn"],
          ["`new int[n]`", "`delete[] a;`", "Một mảng `n` phần tử"],
          ["`new int[n]()`", "`delete[] a;`", "Mảng mà mọi phần tử được khởi tạo bằng 0"]
        ] },
        { loai: "p", text: "Sau khi `delete`, vùng nhớ được trả lại cho hệ thống nhưng **biến con trỏ vẫn giữ địa chỉ cũ**. Gán ngay `p = nullptr;` là thói quen tốt: nếu lỡ dùng lại, lỗi sẽ lộ ra rõ ràng thay vì âm thầm làm hỏng dữ liệu. Gọi `delete` trên `nullptr` là an toàn và không làm gì cả." },
        { loai: "list", items: [
          "Mỗi `new` phải có đúng **một** `delete` tương ứng, mỗi `new[]` phải có đúng một `delete[]`.",
          "Không trộn lẫn: `new[]` mà giải phóng bằng `delete` (thiếu `[]`) là hành vi không xác định.",
          "Không `delete` hai lần cùng một vùng nhớ, không `delete` địa chỉ của biến trên stack."
        ] },
        { loai: "note", text: "Một số trình biên dịch chấp nhận `int a[n];` với `n` là biến (VLA), nhưng đó **không phải** C++ chuẩn. Khi kích thước chỉ biết lúc chạy, hãy dùng `new int[n]` (hoặc `vector` ở chương 6)." }
      ]
    },
    {
      id: "c4-l6",
      tieuDe: "Rò rỉ bộ nhớ và con trỏ treo",
      noiDung: [
        { loai: "p", text: "Làm việc với bộ nhớ động trao cho ta nhiều quyền, đi kèm hai loại lỗi kinh điển mà trình biên dịch **không** báo giúp. Hiểu rõ chúng là điều kiện để viết chương trình C++ chạy ổn định lâu dài." },
        { loai: "p", text: "**Rò rỉ bộ nhớ** (memory leak) xảy ra khi ta cấp phát bằng `new` nhưng làm mất mọi con trỏ tới vùng nhớ đó trước khi kịp `delete`. Vùng nhớ ấy vẫn bị chiếm nhưng không ai còn truy cập hay giải phóng được. Một lần rò rỉ nhỏ có thể không sao, nhưng nếu nằm trong vòng lặp hay trong một server chạy liên tục nhiều ngày, bộ nhớ sẽ cạn dần." },
        { loai: "code", text: `// CAC DOAN MA SAI - chi de minh hoa, khong nen chay
void roRi1() {
    int* a = new int[1000];
    // ... dung a ...
}   // quen delete[] a: ra khoi ham la mat con tro, ro ri 1000 int

void roRi2() {
    int* p = new int(1);
    p = new int(2);   // vung nho chua so 1 khong con ai tro toi -> ro ri
    delete p;         // chi giai phong vung chua so 2
}

void treo() {
    int* p = new int(5);
    int* q = p;       // q va p cung tro mot vung
    delete p;
    // *q = 10;       // LOI: q la con tro treo, vung nho da bi tra lai
}

int* traVeCucBo() {
    int x = 3;
    return &x;        // LOI: x bi huy khi ham ket thuc
}` },
        { loai: "p", text: "**Con trỏ treo** (dangling pointer) là con trỏ vẫn giữ một địa chỉ nhưng vùng nhớ ở đó đã bị giải phóng hoặc đã hết vòng đời. Đọc hay ghi qua con trỏ treo là **hành vi không xác định**: có lúc chạy đúng, có lúc in ra số lạ, có lúc chương trình sập ở một chỗ chẳng liên quan. Lỗi này rất khó tìm vì triệu chứng xuất hiện xa nơi gây ra lỗi." },
        { loai: "p", text: "Một số thói quen giúp tránh cả hai loại lỗi:" },
        { loai: "list", items: [
          "Viết `delete` ngay khi vừa viết `new`, rồi mới chèn phần xử lý ở giữa.",
          "Sau `delete p;` gán ngay `p = nullptr;`.",
          "Xác định rõ **ai sở hữu** vùng nhớ: đúng một nơi chịu trách nhiệm giải phóng; các con trỏ khác chỉ \"mượn\" để đọc.",
          "Không trả về địa chỉ của biến cục bộ.",
          "Khi đã học tới chương 6, ưu tiên `vector` và `string`: chúng tự quản lý bộ nhớ bên trong."
        ] },
        { loai: "code", text: `#include <iostream>
using namespace std;

// Ham tao mang dong va tra quyen so huu ve cho noi goi
int* taoMangBinhPhuong(int n) {
    int* a = new int[n];
    for (int i = 0; i < n; i++) a[i] = i * i;
    return a;                 // hop le: vung nho tren heap van ton tai
}

int main() {
    int n = 4;
    int* a = taoMangBinhPhuong(n);
    for (int i = 0; i < n; i++) cout << a[i] << " ";   // 0 1 4 9
    cout << endl;
    delete[] a;               // noi goi chiu trach nhiem giai phong
    a = nullptr;
    return 0;
}` },
        { loai: "note", text: "Các công cụ như AddressSanitizer (biên dịch với `-fsanitize=address` trên Linux) hoặc Valgrind có thể phát hiện rò rỉ và truy cập con trỏ treo. Hãy nhớ đến chúng khi chương trình có biểu hiện \"lúc đúng lúc sai\"." }
      ]
    },
    {
      id: "c4-l7",
      tieuDe: "struct và con trỏ tới struct (toán tử ->)",
      noiDung: [
        { loai: "p", text: "Dữ liệu thực tế thường gồm nhiều trường đi cùng nhau: một sinh viên có tên, tuổi, điểm. `struct` cho phép gom các trường đó thành **một kiểu dữ liệu mới**. Mỗi biến kiểu `struct` chứa đủ các trường, truy cập bằng dấu chấm: `sv.ten`, `sv.diem`." },
        { loai: "p", text: "Khi có con trỏ `p` tới một struct, muốn truy cập trường `ten` ta phải giải tham chiếu rồi mới chấm: `(*p).ten`. Dấu ngoặc là bắt buộc vì toán tử `.` có độ ưu tiên cao hơn `*`. Cách viết này rườm rà nên C++ cung cấp toán tử mũi tên: `p->ten` hoàn toàn tương đương `(*p).ten`." },
        { loai: "code", text: `#include <iostream>
#include <string>
using namespace std;

struct SinhVien {
    string ten;
    int tuoi;
    double diem;
};

void tangDiem(SinhVien* p, double them) {
    p->diem += them;            // sua truc tiep sinh vien goc
}

int main() {
    SinhVien sv = {"An", 19, 7.5};
    SinhVien* p = &sv;

    cout << p->ten << endl;       // An
    cout << (*p).tuoi << endl;    // 19 (cach viet dai)
    tangDiem(&sv, 1.0);
    cout << sv.diem << endl;      // 8.5

    // Mang struct cap phat dong
    int n = 3;
    SinhVien* ds = new SinhVien[n];
    ds[0] = {"Binh", 20, 6.0};
    ds[1] = {"Chi", 19, 9.0};
    ds[2] = {"Dung", 21, 7.0};
    SinhVien* gioiNhat = ds;
    for (SinhVien* q = ds; q < ds + n; q++) {
        if (q->diem > gioiNhat->diem) gioiNhat = q;
    }
    cout << gioiNhat->ten << endl; // Chi
    delete[] ds;

    // Mot struct don tren heap
    SinhVien* moi = new SinhVien{"Em", 18, 8.0};
    cout << moi->ten << " " << moi->tuoi << endl;  // Em 18
    delete moi;
    return 0;
}` },
        { loai: "p", text: "Trong ví dụ, hàm `tangDiem` nhận **con trỏ** tới sinh viên nên sửa được bản gốc. Nếu nhận `SinhVien sv` theo giá trị, cả struct sẽ bị sao chép và thay đổi bị mất khi hàm kết thúc. Biến `gioiNhat` chỉ là con trỏ \"mượn\" tới một phần tử trong mảng `ds`, nên ta không `delete` nó; chỉ cần một lệnh `delete[] ds` cho cả mảng." },
        { loai: "table", head: ["Bạn đang có", "Truy cập trường", "Ví dụ"], rows: [
          ["Biến struct", "Dấu chấm `.`", "`sv.ten`"],
          ["Con trỏ tới struct", "Mũi tên `->`", "`p->ten`"],
          ["Phần tử mảng struct", "`ds[i].ten` hoặc `(ds + i)->ten`", "`ds[1].diem`"]
        ] },
        { loai: "p", text: "Struct kết hợp con trỏ là nền móng của nhiều cấu trúc dữ liệu: một nút trong **danh sách liên kết** chứa dữ liệu và một con trỏ tới nút kế tiếp (`struct Node { int giaTri; Node* tiep; };`). Bạn sẽ tự cài đặt cấu trúc này trong phần bài tập." },
        { loai: "note", text: "Dùng `.` trên con trỏ (`p.ten`) hoặc `->` trên biến thường (`sv->ten`) đều là lỗi biên dịch. Quy tắc nhớ nhanh: bên trái là con trỏ thì dùng `->`, là đối tượng thì dùng `.`." }
      ]
    }
  ],
  baiTap: [
    {
      id: "c4-bt1",
      muc: 1,
      tieuDe: "Hoán đổi bằng con trỏ",
      deBai: "Viết hàm `void hoanDoi(int* a, int* b)` hoán đổi giá trị hai biến thông qua con trỏ. Chương trình đọc hai số nguyên `x` và `y` trên một dòng, gọi hàm hoán đổi rồi in `x` và `y` sau khi đổi, cách nhau một dấu cách.",
      viDu: { input: "3 5", output: "5 3" },
      loiGiai: `#include <iostream>
using namespace std;

// Nhan dia chi cua hai bien, doi gia tri thong qua *a va *b
void hoanDoi(int* a, int* b) {
    int tam = *a;
    *a = *b;
    *b = tam;
}

int main() {
    int x, y;
    cin >> x >> y;
    hoanDoi(&x, &y);
    cout << x << " " << y << endl;
    return 0;
}`,
      giaiThich: "Hàm nhận địa chỉ `&x` và `&y`, nên `*a` và `*b` chính là hai biến gốc trong `main`. Dùng một biến tạm để đổi chỗ hai giá trị."
    },
    {
      id: "c4-bt2",
      muc: 1,
      tieuDe: "Tổng mảng bằng số học con trỏ",
      deBai: "Dòng đầu là số nguyên `n` (1 ≤ n ≤ 100), dòng thứ hai gồm `n` số nguyên. Hãy tính tổng các phần tử, trong đó vòng lặp tính tổng phải duyệt mảng bằng con trỏ (`p++`) thay vì chỉ số. In ra tổng.",
      viDu: { input: "5\n1 2 3 4 5", output: "15" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int a[100];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    long long tong = 0;
    // p di tu phan tu dau toi ngay truoc a + n
    for (int* p = a; p < a + n; p++) {
        tong += *p;
    }
    cout << tong << endl;
    return 0;
}`,
      giaiThich: "Tên mảng `a` là con trỏ tới phần tử đầu, `a + n` là vị trí ngay sau phần tử cuối. Mỗi lần `p++` con trỏ tiến sang phần tử kế tiếp, `*p` là giá trị tại đó."
    },
    {
      id: "c4-bt3",
      muc: 2,
      tieuDe: "Đảo ngược mảng động",
      deBai: "Đọc số nguyên `n` (n ≥ 1) rồi `n` số nguyên. Cấp phát mảng bằng `new int[n]`, đảo ngược mảng tại chỗ bằng hai con trỏ (một ở đầu, một ở cuối tiến lại gần nhau), sau đó in mảng trên một dòng, các số cách nhau một dấu cách. Nhớ giải phóng bộ nhớ.",
      viDu: { input: "5\n1 2 3 4 5", output: "5 4 3 2 1" },
      loiGiai: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int* a = new int[n];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int* dau = a;
    int* cuoi = a + n - 1;
    while (dau < cuoi) {
        int tam = *dau;
        *dau = *cuoi;
        *cuoi = tam;
        dau++;
        cuoi--;
    }

    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << a[i];
    }
    cout << endl;

    delete[] a;
    return 0;
}`,
      giaiThich: "Hai con trỏ `dau` và `cuoi` lần lượt đổi chỗ hai phần tử rồi tiến vào giữa; khi chúng gặp nhau thì mảng đã đảo xong. Mảng cấp phát bằng `new[]` nên giải phóng bằng `delete[]`."
    },
    {
      id: "c4-bt4",
      muc: 2,
      tieuDe: "Tìm min, max qua tham số con trỏ",
      deBai: "Viết hàm `void timMinMax(const int* a, int n, int* mn, int* mx)` tìm giá trị nhỏ nhất và lớn nhất của mảng, trả kết quả qua hai con trỏ `mn` và `mx`. Chương trình đọc `n` (n ≥ 1) và `n` số nguyên vào mảng động, gọi hàm và in hai dòng theo đúng dạng `Min = ...` và `Max = ...`.",
      viDu: { input: "6\n4 9 1 7 3 9", output: "Min = 1\nMax = 9" },
      loiGiai: `#include <iostream>
using namespace std;

// Ket qua duoc ghi vao bien cua noi goi thong qua mn va mx
void timMinMax(const int* a, int n, int* mn, int* mx) {
    *mn = a[0];
    *mx = a[0];
    for (const int* p = a + 1; p < a + n; p++) {
        if (*p < *mn) *mn = *p;
        if (*p > *mx) *mx = *p;
    }
}

int main() {
    int n;
    cin >> n;
    int* a = new int[n];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int nhoNhat, lonNhat;
    timMinMax(a, n, &nhoNhat, &lonNhat);
    cout << "Min = " << nhoNhat << endl;
    cout << "Max = " << lonNhat << endl;

    delete[] a;
    return 0;
}`,
      giaiThich: "Một hàm chỉ trả về được một giá trị, nên ta truyền địa chỉ của hai biến kết quả để hàm ghi vào. `const int*` bảo đảm hàm không sửa mảng dữ liệu."
    },
    {
      id: "c4-bt5",
      muc: 3,
      tieuDe: "Trộn hai mảng đã sắp xếp",
      deBai: "Dòng 1 là `n`, dòng 2 gồm `n` số nguyên tăng dần; dòng 3 là `m`, dòng 4 gồm `m` số nguyên tăng dần (n, m ≥ 1). Hãy cấp phát động ba mảng (hai mảng đầu vào và mảng kết quả `n + m` phần tử), trộn hai mảng thành một mảng tăng dần bằng các con trỏ chạy, rồi in mảng kết quả trên một dòng, cách nhau một dấu cách.",
      viDu: { input: "3\n1 4 7\n4\n2 3 8 10", output: "1 2 3 4 7 8 10" },
      loiGiai: `#include <iostream>
using namespace std;

// Doc so luong vao n, cap phat mang va doc du lieu, tra ve con tro
int* docMang(int& n) {
    cin >> n;
    int* a = new int[n];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    return a;
}

int main() {
    int n, m;
    int* a = docMang(n);
    int* b = docMang(m);
    int* c = new int[n + m];

    int* pa = a;
    int* pb = b;
    int* pc = c;
    // Lay phan tu nho hon trong hai dau mang
    while (pa < a + n && pb < b + m) {
        if (*pa <= *pb) {
            *pc = *pa;
            pa++;
        } else {
            *pc = *pb;
            pb++;
        }
        pc++;
    }
    // Chep phan con lai
    while (pa < a + n) { *pc = *pa; pa++; pc++; }
    while (pb < b + m) { *pc = *pb; pb++; pc++; }

    for (int i = 0; i < n + m; i++) {
        if (i > 0) cout << " ";
        cout << c[i];
    }
    cout << endl;

    delete[] a;
    delete[] b;
    delete[] c;
    return 0;
}`,
      giaiThich: "Ba con trỏ `pa`, `pb`, `pc` chạy song song: mỗi bước chọn phần tử nhỏ hơn ở đầu hai mảng và ghi vào `c`. Khi một mảng hết thì chép nốt mảng còn lại. Hàm `docMang` trả về vùng nhớ heap, `main` chịu trách nhiệm giải phóng cả ba mảng."
    },
    {
      id: "c4-bt6",
      muc: 3,
      tieuDe: "Mảng sinh viên cấp phát động",
      deBai: "Dòng đầu là `n` (n ≥ 1). Mỗi dòng trong `n` dòng tiếp theo gồm tên (một từ, không dấu cách) và điểm (số thực) của một sinh viên. Dùng `struct SinhVien` và mảng cấp phát bằng `new SinhVien[n]`, duyệt mảng bằng con trỏ và toán tử `->`. In dòng `Trung binh: X` với X là điểm trung bình, và dòng `Cao nhat: TEN DIEM` cho sinh viên có điểm cao nhất (nếu bằng nhau lấy người xuất hiện trước). Các số thực in với đúng 2 chữ số sau dấu chấm.",
      viDu: { input: "3\nAn 7.5\nBinh 8.25\nChi 6", output: "Trung binh: 7.25\nCao nhat: Binh 8.25" },
      loiGiai: `#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

struct SinhVien {
    string ten;
    double diem;
};

int main() {
    int n;
    cin >> n;
    SinhVien* ds = new SinhVien[n];
    for (int i = 0; i < n; i++) {
        cin >> ds[i].ten >> ds[i].diem;
    }

    SinhVien* tot = ds;   // con tro "muon", khong delete rieng
    double tong = 0;
    for (SinhVien* p = ds; p < ds + n; p++) {
        tong += p->diem;
        if (p->diem > tot->diem) {
            tot = p;
        }
    }

    cout << fixed << setprecision(2);
    cout << "Trung binh: " << tong / n << endl;
    cout << "Cao nhat: " << tot->ten << " " << tot->diem << endl;

    delete[] ds;
    return 0;
}`,
      giaiThich: "Con trỏ `p` duyệt qua từng phần tử, `p->diem` lấy điểm của sinh viên đang xét. Thay vì chép cả struct, ta chỉ giữ con trỏ `tot` tới sinh viên tốt nhất; chỉ so sánh lớn hơn hẳn nên người xuất hiện trước được giữ khi bằng điểm."
    },
    {
      id: "c4-bt7",
      muc: 4,
      tieuDe: "Nhân hai ma trận cấp phát động",
      deBai: "Dòng đầu gồm `m n` là kích thước ma trận A, tiếp theo là `m` dòng, mỗi dòng `n` số nguyên. Sau đó là `p q` là kích thước ma trận B, tiếp theo `p` dòng, mỗi dòng `q` số nguyên. Cấp phát các ma trận bằng con trỏ cấp hai (`new long long*[hang]` rồi `new long long[cot]` cho từng hàng). Nếu `n != p` thì in `KHONG NHAN DUOC`; ngược lại in ma trận C = A x B gồm `m` dòng, mỗi dòng `q` số cách nhau một dấu cách. Giải phóng toàn bộ bộ nhớ trước khi kết thúc.",
      viDu: { input: "2 3\n1 2 3\n4 5 6\n3 2\n7 8\n9 10\n11 12", output: "58 64\n139 154" },
      loiGiai: `#include <iostream>
using namespace std;

long long** taoMaTran(int hang, int cot) {
    long long** mt = new long long*[hang];   // mang cac con tro hang
    for (int i = 0; i < hang; i++) {
        mt[i] = new long long[cot]();        // moi hang la mot mang, khoi tao 0
    }
    return mt;
}

void giaiPhong(long long** mt, int hang) {
    for (int i = 0; i < hang; i++) {
        delete[] mt[i];                      // giai phong tung hang truoc
    }
    delete[] mt;                             // roi moi giai phong mang con tro
}

long long** docMaTran(int& hang, int& cot) {
    cin >> hang >> cot;
    long long** mt = taoMaTran(hang, cot);
    for (int i = 0; i < hang; i++) {
        for (int j = 0; j < cot; j++) {
            cin >> mt[i][j];
        }
    }
    return mt;
}

int main() {
    int m, n, p, q;
    long long** a = docMaTran(m, n);
    long long** b = docMaTran(p, q);

    if (n != p) {
        cout << "KHONG NHAN DUOC" << endl;
    } else {
        long long** c = taoMaTran(m, q);
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < q; j++) {
                for (int k = 0; k < n; k++) {
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < q; j++) {
                if (j > 0) cout << " ";
                cout << c[i][j];
            }
            cout << endl;
        }
        giaiPhong(c, m);
    }

    giaiPhong(a, m);
    giaiPhong(b, p);
    return 0;
}`,
      giaiThich: "Ma trận động là một mảng các con trỏ, mỗi con trỏ trỏ tới một mảng hàng; `mt[i][j]` truy cập như mảng hai chiều thường. Phần tử C[i][j] là tổng A[i][k] * B[k][j] theo k. Khi giải phóng phải xóa từng hàng trước rồi mới xóa mảng con trỏ, theo thứ tự ngược với lúc cấp phát."
    },
    {
      id: "c4-bt8",
      muc: 4,
      tieuDe: "Xóa phần tử khỏi danh sách liên kết",
      deBai: "Dòng đầu là `n` (n ≥ 1), dòng thứ hai gồm `n` số nguyên, dòng thứ ba là số nguyên `x`. Hãy xây dựng danh sách liên kết đơn từ `n` số (giữ nguyên thứ tự, mỗi nút tạo bằng `new`), sau đó xóa **tất cả** các nút có giá trị bằng `x` (giải phóng nút bị xóa bằng `delete`). In các giá trị còn lại trên một dòng, cách nhau một dấu cách; nếu danh sách rỗng in `EMPTY`. Cuối chương trình giải phóng toàn bộ danh sách.",
      viDu: { input: "7\n1 2 3 2 4 2 5\n2", output: "1 3 4 5" },
      loiGiai: `#include <iostream>
using namespace std;

struct Node {
    int giaTri;
    Node* tiep;
};

int main() {
    int n;
    cin >> n;
    Node* dau = nullptr;
    Node* cuoi = nullptr;
    for (int i = 0; i < n; i++) {
        int v;
        cin >> v;
        Node* moi = new Node{v, nullptr};
        if (dau == nullptr) {
            dau = moi;
        } else {
            cuoi->tiep = moi;
        }
        cuoi = moi;
    }
    int x;
    cin >> x;

    // pp tro toi "o chua con tro toi nut hien tai":
    // ban dau la bien dau, sau do la truong tiep cua nut truoc.
    Node** pp = &dau;
    while (*pp != nullptr) {
        Node* hienTai = *pp;
        if (hienTai->giaTri == x) {
            *pp = hienTai->tiep;   // noi tat qua nut can xoa
            delete hienTai;
        } else {
            pp = &hienTai->tiep;   // tien sang nut ke tiep
        }
    }

    if (dau == nullptr) {
        cout << "EMPTY" << endl;
    } else {
        for (Node* p = dau; p != nullptr; p = p->tiep) {
            if (p != dau) cout << " ";
            cout << p->giaTri;
        }
        cout << endl;
    }

    // Giai phong phan con lai
    while (dau != nullptr) {
        Node* xoa = dau;
        dau = dau->tiep;
        delete xoa;
    }
    return 0;
}`,
      giaiThich: "Thay vì xử lý riêng trường hợp xóa nút đầu, ta dùng con trỏ cấp hai `pp` trỏ tới chính ô đang giữ địa chỉ nút hiện tại; xóa nút chỉ cần gán `*pp = hienTai->tiep`. Mỗi nút bị xóa được `delete` ngay, phần còn lại được giải phóng ở cuối nên không rò rỉ."
    }
  ]
};
