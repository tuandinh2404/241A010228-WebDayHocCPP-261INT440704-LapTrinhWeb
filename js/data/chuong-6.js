window.CHUONG = window.CHUONG || {};
window.CHUONG[6] = {
  so: 6,
  ten: "STL & xử lý ngoại lệ",
  tomTat: "Dùng thư viện chuẩn STL thay vì tự quản lý mảng: vector, pair, map, set và iterator, các thuật toán trong <algorithm> như sort, find, count, max_element kết hợp lambda; sau đó xử lý lỗi một cách có tổ chức bằng try/catch/throw, các lớp ngoại lệ chuẩn và ngoại lệ tự định nghĩa.",
  baiGiang: [
    {
      id: "c6-l1",
      tieuDe: "vector: mảng động tự quản lý",
      noiDung: [
        { loai: "p", text: "Ở chương 4 ta đã tự cấp phát mảng bằng `new[]` và phải nhớ `delete[]`. Nếu muốn mảng lớn thêm, ta lại phải cấp phát mảng mới, chép dữ liệu, giải phóng mảng cũ. **STL** (Standard Template Library) là phần thư viện chuẩn của C++ cung cấp sẵn các cấu trúc dữ liệu và thuật toán đã được kiểm chứng. Thành phần dùng nhiều nhất là `vector`: một mảng động **tự co giãn** và **tự giải phóng** bộ nhớ khi hết phạm vi." },
        { loai: "p", text: "`vector` là một **template**: khi khai báo ta ghi kiểu phần tử trong cặp ngoặc nhọn, ví dụ `vector<int>`, `vector<string>`, `vector<SinhVien>`. Phần tử nằm liền nhau trong bộ nhớ giống mảng thường, nên truy cập `v[i]` vẫn rất nhanh." },
        { loai: "code", text: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;                 // vector rong
    v.push_back(10);               // them vao cuoi
    v.push_back(20);
    v.push_back(30);
    cout << v.size() << endl;                  // 3
    cout << v[0] << " " << v.back() << endl;   // 10 30

    v.pop_back();                  // bo phan tu cuoi: con 10 20
    v.insert(v.begin(), 5);        // chen vao dau: 5 10 20
    v.erase(v.begin() + 1);        // xoa phan tu thu 2: 5 20
    for (size_t i = 0; i < v.size(); i++) {
        cout << v[i] << " ";       // 5 20
    }
    cout << endl;

    vector<int> w(5, 0);           // 5 phan tu, deu bang 0
    w[2] = 7;
    for (int x : w) {              // vong for theo pham vi
        cout << x << " ";          // 0 0 7 0 0
    }
    cout << endl;

    vector<vector<int>> mt(2, vector<int>(3, 1));   // ma tran 2x3 toan so 1
    cout << mt.size() << "x" << mt[0].size() << endl;   // 2x3
    return 0;
}` },
        { loai: "table", head: ["Thao tác", "Ý nghĩa"], rows: [
          ["`vector<int> v(n);`", "Tạo `n` phần tử, mỗi phần tử bằng 0"],
          ["`v.push_back(x)` / `v.pop_back()`", "Thêm vào cuối / bỏ phần tử cuối"],
          ["`v.size()`, `v.empty()`", "Số phần tử, kiểm tra rỗng"],
          ["`v[i]`, `v.at(i)`", "Truy cập phần tử; `at` có kiểm tra chỉ số"],
          ["`v.front()`, `v.back()`", "Phần tử đầu, phần tử cuối"],
          ["`v.insert(it, x)`, `v.erase(it)`", "Chèn, xóa tại vị trí iterator"],
          ["`v.clear()`", "Xóa hết phần tử"]
        ] },
        { loai: "p", text: "Vòng lặp `for (int x : v)` duyệt từng phần tử theo **bản sao**. Muốn sửa phần tử trong vòng lặp, dùng tham chiếu `for (int& x : v)`; muốn đọc phần tử lớn (như `string`) mà không sao chép, dùng `for (const string& s : v)`. Khi truyền vector vào hàm cũng vậy: `void in(const vector<int>& v)` tránh việc sao chép cả mảng." },
        { loai: "note", text: "`v[i]` không kiểm tra chỉ số: truy cập ngoài phạm vi là hành vi không xác định, giống mảng thường. `v.at(i)` kiểm tra và ném ngoại lệ `out_of_range` khi sai, rất hữu ích lúc gỡ lỗi. Ngoài ra `v.size()` có kiểu không dấu, nên viết `v.size() - 1` khi vector rỗng sẽ ra một số khổng lồ." }
      ]
    },
    {
      id: "c6-l2",
      tieuDe: "Iterator và pair",
      noiDung: [
        { loai: "p", text: "Mỗi loại container lưu dữ liệu theo cách riêng: vector là mảng liền nhau, còn `map` và `set` (phần sau) là cây. Để duyệt mọi container theo **cùng một cách**, STL cung cấp **iterator**: một đối tượng đóng vai trò như con trỏ tới một phần tử. Iterator hỗ trợ `*it` để lấy phần tử, `++it` để sang phần tử kế tiếp, và so sánh `it != v.end()`. Bạn sẽ thấy cách dùng gần giống hệt con trỏ duyệt mảng ở chương 4." },
        { loai: "list", items: [
          "`v.begin()`: iterator tới phần tử đầu tiên.",
          "`v.end()`: iterator tới vị trí **ngay sau** phần tử cuối (không được giải tham chiếu), dùng làm điểm dừng.",
          "Một khoảng `[begin, end)` luôn gồm đầu mà không gồm cuối; hầu hết thuật toán STL nhận đúng cặp này.",
          "Từ khóa `auto` để trình biên dịch tự suy ra kiểu iterator dài dòng như `vector<int>::iterator`."
        ] },
        { loai: "code", text: `#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {4, 8, 15, 16};
    for (vector<int>::iterator it = v.begin(); it != v.end(); ++it) {
        cout << *it << " ";        // 4 8 15 16
    }
    cout << endl;

    for (auto it = v.begin(); it != v.end(); ++it) {
        *it *= 2;                  // sua phan tu qua iterator
    }
    for (int x : v) cout << x << " ";   // 8 16 30 32
    cout << endl;

    pair<string, int> p = {"An", 9};
    cout << p.first << " " << p.second << endl;   // An 9

    pair<int, int> a(1, 5), b(1, 3);
    cout << (b < a) << endl;       // 1: so first truoc, bang nhau thi so second

    vector<pair<string, int>> ds = {{"An", 9}, {"Binh", 7}};
    ds.push_back(make_pair("Chi", 8));
    for (const auto& sv : ds) {
        cout << sv.first << ": " << sv.second << endl;   // An: 9 / Binh: 7 / Chi: 8
    }
    for (const auto& [ten, diem] : ds) {               // C++17: tach truc tiep
        cout << ten << "=" << diem << " ";            // An=9 Binh=7 Chi=8
    }
    cout << endl;
    return 0;
}` },
        { loai: "p", text: "`pair<A, B>` (trong `<utility>`) gói **hai giá trị** có thể khác kiểu thành một, truy cập bằng `.first` và `.second`. Pair rất tiện khi cần trả về hai giá trị từ một hàm, hoặc lưu danh sách các cặp như (tên, điểm). Hai pair so sánh theo **thứ tự từ điển**: so `first` trước, nếu bằng nhau mới so `second`. Nhờ vậy `sort` một `vector<pair<...>>` sẽ tự sắp theo `first` rồi `second` mà không cần viết thêm gì." },
        { loai: "p", text: "Cú pháp `auto [ten, diem] = p;` gọi là **structured binding** (có từ C++17), giúp đặt tên rõ nghĩa cho hai thành phần thay vì `first`/`second` khó đọc." },
        { loai: "note", text: "Sau khi `push_back`, `insert` hay `erase` trên vector, các iterator cũ có thể bị **vô hiệu** vì vector có thể đã chuyển dữ liệu sang vùng nhớ mới. Đừng giữ iterator qua các thao tác làm thay đổi kích thước vector." }
      ]
    },
    {
      id: "c6-l3",
      tieuDe: "map: ánh xạ khóa sang giá trị",
      noiDung: [
        { loai: "p", text: "Trong thực tế ta thường cần tra cứu theo **khóa**: tra điểm theo tên sinh viên, tra số lần xuất hiện theo từ, tra giá theo mã hàng. Dùng vector thì phải duyệt cả mảng để tìm. `map<K, V>` lưu các cặp (khóa, giá trị) với **khóa không trùng nhau**, luôn được **sắp xếp tăng dần theo khóa**, và tìm kiếm rất nhanh (độ phức tạp O(log n) nhờ cấu trúc cây cân bằng bên trong)." },
        { loai: "code", text: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> diem;
    diem["Binh"] = 6;              // them moi
    diem["An"] = 8;
    diem.insert({"Chi", 9});
    diem["An"] = 10;               // khoa da co: ghi de gia tri
    cout << diem.size() << endl;   // 3

    for (const auto& kv : diem) {  // duyet theo khoa tang dan
        cout << kv.first << " -> " << kv.second << endl;
    }
    // An -> 10
    // Binh -> 6
    // Chi -> 9

    if (diem.count("Dung") == 0) {
        cout << "Khong co Dung" << endl;
    }
    auto it = diem.find("Binh");
    if (it != diem.end()) {
        cout << "Binh co " << it->second << " diem" << endl;   // Binh co 6 diem
    }
    diem.erase("Binh");
    cout << diem.size() << endl;   // 2

    // Dem tan suat ky tu
    map<char, int> dem;
    for (char c : string("banana")) {
        dem[c]++;                  // khoa chua co thi tu tao voi gia tri 0
    }
    for (const auto& [kyTu, soLan] : dem) {
        cout << kyTu << ":" << soLan << " ";   // a:3 b:1 n:2
    }
    cout << endl;
    return 0;
}` },
        { loai: "p", text: "Mỗi phần tử của map là một `pair<const K, V>`, nên khi duyệt ta dùng `kv.first` (khóa) và `kv.second` (giá trị); qua iterator thì viết `it->first`, `it->second`. Khóa là `const` vì đổi khóa sẽ phá vỡ thứ tự sắp xếp; muốn đổi khóa phải xóa rồi thêm lại." },
        { loai: "table", head: ["Thao tác", "Ý nghĩa"], rows: [
          ["`m[k]`", "Truy cập giá trị của khóa `k`; **tự tạo** nếu chưa có"],
          ["`m.at(k)`", "Truy cập; ném `out_of_range` nếu chưa có"],
          ["`m.count(k)`", "1 nếu có khóa `k`, 0 nếu không"],
          ["`m.find(k)`", "Iterator tới phần tử, hoặc `m.end()` nếu không có"],
          ["`m.erase(k)`", "Xóa phần tử có khóa `k`"]
        ] },
        { loai: "p", text: "Mẫu `dem[x]++` là cách đếm tần suất kinh điển: lần đầu gặp `x`, toán tử `[]` tạo phần tử với giá trị mặc định (0 với kiểu số) rồi tăng lên 1. Chính đặc điểm này cũng là cái bẫy: chỉ **đọc** `m[k]` để kiểm tra cũng vô tình thêm khóa `k` vào map." },
        { loai: "note", text: "Khi chỉ muốn kiểm tra khóa có tồn tại không, hãy dùng `count` hoặc `find`, đừng dùng `m[k] == 0`. Nếu không cần thứ tự sắp xếp, `unordered_map` (header `<unordered_map>`) có cách dùng tương tự và thường nhanh hơn." }
      ]
    },
    {
      id: "c6-l4",
      tieuDe: "set: tập hợp không trùng lặp",
      noiDung: [
        { loai: "p", text: "`set<T>` lưu một tập các giá trị **không trùng nhau** và luôn **sắp xếp tăng dần**. Có thể xem set như một map chỉ có khóa mà không có giá trị. Thêm một phần tử đã có vào set sẽ không làm gì cả. Set rất hợp cho các bài toán: loại bỏ phần tử trùng, đếm số giá trị khác nhau, kiểm tra nhanh một giá trị đã xuất hiện hay chưa, hoặc luôn biết ngay phần tử nhỏ nhất và lớn nhất." },
        { loai: "code", text: `#include <iostream>
#include <set>
using namespace std;

int main() {
    set<int> s = {5, 1, 3, 5, 1};    // trung lap bi bo
    cout << s.size() << endl;        // 3
    for (int x : s) cout << x << " ";   // 1 3 5
    cout << endl;

    s.insert(4);                     // 1 3 4 5
    s.insert(3);                     // da co, khong doi
    s.erase(1);                      // 3 4 5
    cout << s.count(3) << " " << s.count(9) << endl;   // 1 0

    cout << *s.begin() << endl;      // 3 (nho nhat)
    cout << *s.rbegin() << endl;     // 5 (lon nhat)

    auto it = s.lower_bound(4);      // phan tu dau tien >= 4
    if (it != s.end()) cout << *it << endl;   // 4

    multiset<int> ms = {2, 2, 1};    // cho phep trung lap
    cout << ms.count(2) << endl;     // 2
    return 0;
}` },
        { loai: "p", text: "Các thao tác thêm, xóa, tìm trên set đều có độ phức tạp O(log n). Với vector chưa sắp xếp, kiểm tra một giá trị có tồn tại hay không phải duyệt cả mảng (O(n)), nên khi số lần tra cứu lớn, set nhanh hơn hẳn." },
        { loai: "list", items: [
          "`s.insert(x)`, `s.erase(x)`, `s.count(x)`, `s.find(x)` dùng giống map.",
          "`*s.begin()` là phần tử nhỏ nhất, `*s.rbegin()` là phần tử lớn nhất (khi set không rỗng).",
          "`s.lower_bound(x)`: phần tử nhỏ nhất `>= x`; `s.upper_bound(x)`: phần tử nhỏ nhất `> x`.",
          "Phần tử trong set **không sửa trực tiếp** được qua iterator; muốn đổi giá trị phải xóa rồi thêm lại.",
          "`multiset` cho phép phần tử trùng; `unordered_set` không giữ thứ tự nhưng thường nhanh hơn."
        ] },
        { loai: "p", text: "Một mẹo hay: muốn có danh sách các giá trị khác nhau đã sắp xếp từ một vector, chỉ cần tạo `set<int> s(v.begin(), v.end());`. Mọi container STL đều có constructor nhận một khoảng iterator như vậy, giúp chuyển đổi qua lại rất gọn." },
        { loai: "note", text: "Set sắp xếp theo toán tử `<`. Muốn đưa đối tượng của lớp tự viết vào set hoặc làm khóa map, lớp đó phải có `operator<` (đúng thứ bạn đã học ở chương 5)." }
      ]
    },
    {
      id: "c6-l5",
      tieuDe: "Thư viện <algorithm> và hàm lambda",
      noiDung: [
        { loai: "p", text: "Header `<algorithm>` chứa hàng chục thuật toán dùng chung cho mọi container. Chúng không nhận container trực tiếp mà nhận **khoảng iterator** `[first, last)`, thường là `v.begin(), v.end()`. Nhờ vậy cùng một hàm `sort` dùng được cho vector, mảng thường (`sort(a, a + n)`) hay một đoạn con của vector. Dùng thuật toán có sẵn giúp mã ngắn hơn, ít lỗi hơn và thường nhanh hơn tự viết." },
        { loai: "table", head: ["Hàm", "Tác dụng", "Trả về"], rows: [
          ["`sort(b, e)`", "Sắp xếp tăng dần, O(n log n)", "Không"],
          ["`sort(b, e, cmp)`", "Sắp xếp theo hàm so sánh `cmp`", "Không"],
          ["`find(b, e, x)`", "Tìm phần tử đầu tiên bằng `x`", "Iterator, hoặc `e` nếu không thấy"],
          ["`count(b, e, x)`", "Đếm số phần tử bằng `x`", "Số lượng"],
          ["`max_element(b, e)`", "Vị trí phần tử lớn nhất", "Iterator"],
          ["`min_element(b, e)`", "Vị trí phần tử nhỏ nhất", "Iterator"],
          ["`reverse(b, e)`", "Đảo ngược khoảng", "Không"],
          ["`count_if(b, e, f)`", "Đếm phần tử thỏa điều kiện `f`", "Số lượng"]
        ] },
        { loai: "p", text: "Nhiều thuật toán nhận thêm một **hàm** làm tham số, ví dụ hàm so sánh cho `sort`. Thay vì viết một hàm riêng ở ngoài, C++ cho phép viết **lambda**: một hàm không tên viết ngay tại chỗ dùng. Cú pháp: `[bắt_biến](tham_số) { thân hàm }`. Phần ngoặc vuông cho biết lambda được dùng những biến nào ở bên ngoài: `[]` không dùng biến nào, `[x]` sao chép `x`, `[&x]` tham chiếu tới `x`, `[&]` tham chiếu tới mọi biến cần dùng." },
        { loai: "code", text: `#include <algorithm>
#include <functional>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {5, 2, 9, 1, 7, 2};

    sort(v.begin(), v.end());                       // 1 2 2 5 7 9
    sort(v.begin(), v.end(), greater<int>());       // 9 7 5 2 2 1
    for (int x : v) cout << x << " ";
    cout << endl;

    auto it = find(v.begin(), v.end(), 7);
    if (it != v.end()) {
        cout << "7 o vi tri " << (it - v.begin()) << endl;   // 7 o vi tri 1
    }
    cout << count(v.begin(), v.end(), 2) << endl;           // 2
    cout << *max_element(v.begin(), v.end()) << endl;       // 9
    cout << *min_element(v.begin(), v.end()) << endl;       // 1

    // Lambda
    auto binhPhuong = [](int x) { return x * x; };
    cout << binhPhuong(4) << endl;                          // 16

    int nguong = 4;
    int soLonHon = count_if(v.begin(), v.end(), [nguong](int x) { return x > nguong; });
    cout << soLonHon << endl;                               // 3 (9, 7, 5)

    // Sap xep chuoi theo do dai, cung do dai thi theo thu tu tu dien
    vector<string> tu = {"tao", "chuoi", "na", "cam", "le"};
    sort(tu.begin(), tu.end(), [](const string& a, const string& b) {
        if (a.size() != b.size()) return a.size() < b.size();
        return a < b;
    });
    for (const string& s : tu) cout << s << " ";            // le na cam tao chuoi
    cout << endl;
    return 0;
}` },
        { loai: "p", text: "Hàm so sánh truyền cho `sort` nhận hai phần tử `a`, `b` và trả về `true` khi `a` **phải đứng trước** `b`. Nó phải là một quan hệ \"nhỏ hơn hẳn\": với hai phần tử bằng nhau phải trả về `false`. Viết `<=` thay cho `<` là lỗi kinh điển, có thể khiến chương trình chạy sai hoặc bị sập." },
        { loai: "note", text: "`max_element` trả về **iterator**, không phải giá trị: dùng `*` để lấy giá trị, hoặc trừ cho `v.begin()` để lấy chỉ số. Gọi `*max_element` trên vector rỗng là lỗi vì khi đó nó trả về `v.end()`." }
      ]
    },
    {
      id: "c6-l6",
      tieuDe: "Ngoại lệ: try, catch, throw và các lớp chuẩn",
      noiDung: [
        { loai: "p", text: "Chương trình luôn có thể gặp tình huống bất thường: chia cho 0, chỉ số ngoài phạm vi, dữ liệu nhập sai định dạng. Cách cũ là trả về một mã lỗi đặc biệt (như -1), nhưng nơi gọi rất dễ quên kiểm tra, và nhiều hàm không có giá trị nào \"rảnh\" để làm mã lỗi. **Ngoại lệ** (exception) tách hẳn đường đi của lỗi khỏi đường đi bình thường: nơi phát hiện lỗi **ném** (`throw`) một ngoại lệ, nơi biết cách xử lý **bắt** (`catch`) nó." },
        { loai: "code", text: `#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>
using namespace std;

double chia(int a, int b) {
    if (b == 0) {
        throw runtime_error("Khong the chia cho 0");   // dung ham ngay tai day
    }
    return (double)a / b;
}

int main() {
    try {
        cout << chia(10, 4) << endl;   // 2.5
        cout << chia(1, 0) << endl;    // nem ngoai le, dong nay khong in
        cout << "Khong bao gio chay toi" << endl;
    } catch (const runtime_error& e) {
        cout << "Loi: " << e.what() << endl;   // Loi: Khong the chia cho 0
    }

    vector<int> v = {1, 2, 3};
    try {
        cout << v.at(10) << endl;      // at kiem tra chi so
    } catch (const out_of_range& e) {
        cout << "Chi so ngoai pham vi" << endl;
    }

    try {
        int x = stoi("abc");           // khong phai so
        cout << x << endl;
    } catch (const invalid_argument& e) {
        cout << "Khong doi duoc sang so" << endl;
    } catch (const exception& e) {     // bat moi ngoai le chuan con lai
        cout << "Loi khac: " << e.what() << endl;
    }
    cout << "Chuong trinh van tiep tuc" << endl;
    return 0;
}` },
        { loai: "p", text: "Khi một ngoại lệ được ném ra, chương trình **dừng ngay** các lệnh phía sau, thoát dần ra khỏi các hàm đang chạy (các biến cục bộ được hủy đúng cách trên đường đi) cho tới khi gặp khối `catch` phù hợp đầu tiên. Nếu không có `catch` nào phù hợp, chương trình kết thúc bất thường. Sau khi `catch` xử lý xong, chương trình chạy tiếp các lệnh **sau** toàn bộ khối try/catch." },
        { loai: "table", head: ["Lớp ngoại lệ", "Lớp cha", "Thường gặp khi"], rows: [
          ["`exception`", "(gốc)", "Lớp cơ sở của mọi ngoại lệ chuẩn, có `what()`"],
          ["`logic_error`", "`exception`", "Lỗi logic có thể phát hiện trước khi chạy"],
          ["`out_of_range`", "`logic_error`", "`vector::at`, `string::at`, `map::at` sai chỉ số/khóa"],
          ["`invalid_argument`", "`logic_error`", "`stoi(\"abc\")`, tham số không hợp lệ"],
          ["`runtime_error`", "`exception`", "Lỗi chỉ phát hiện được lúc chạy"],
          ["`overflow_error`", "`runtime_error`", "Tràn số trong tính toán"]
        ] },
        { loai: "list", items: [
          "Luôn bắt bằng **tham chiếu hằng**: `catch (const runtime_error& e)`, để không sao chép và không bị cắt mất thông tin lớp con.",
          "Đặt `catch` lớp con **trước** lớp cha. `catch (const exception& e)` đặt đầu tiên sẽ bắt hết, các khối phía sau không bao giờ được chạy.",
          "`catch (...)` bắt mọi thứ, kể cả ngoại lệ không thuộc lớp chuẩn (như `throw 42;`), nhưng không biết được thông tin lỗi.",
          "Các lớp ngoại lệ chuẩn nằm trong header `<stdexcept>` (lớp `exception` trong `<exception>`)."
        ] },
        { loai: "note", text: "Ngoại lệ dành cho tình huống **bất thường**, không dùng thay cho `if` trong luồng xử lý bình thường (ví dụ dùng ngoại lệ để thoát vòng lặp). Ném và bắt ngoại lệ chậm hơn nhiều so với một phép so sánh." }
      ]
    },
    {
      id: "c6-l7",
      tieuDe: "Ngoại lệ tự định nghĩa",
      noiDung: [
        { loai: "p", text: "Các lớp ngoại lệ chuẩn mô tả lỗi chung chung. Trong một ứng dụng thật, ta muốn phân biệt rõ từng loại lỗi nghiệp vụ, như \"số dư không đủ\" hay \"không tìm thấy mặt hàng\", và mang theo dữ liệu đi kèm (thiếu bao nhiêu tiền, mã hàng nào). Cách làm chuẩn là **tự định nghĩa lớp ngoại lệ kế thừa** từ `runtime_error` (hoặc `logic_error`). Nhờ kế thừa, ngoại lệ mới vẫn có `what()` và vẫn bị bắt bởi `catch (const exception& e)` ở những nơi chỉ cần xử lý chung." },
        { loai: "code", text: `#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

// Ngoai le rieng, mang theo so tien con thieu
class LoiSoDu : public runtime_error {
private:
    long long thieu;
public:
    LoiSoDu(long long soThieu)
        : runtime_error("So du khong du"), thieu(soThieu) {}
    long long getThieu() const { return thieu; }
};

class TaiKhoan {
private:
    long long soDu;
public:
    TaiKhoan(long long banDau) : soDu(banDau) {}
    long long getSoDu() const { return soDu; }
    void rut(long long x) {
        if (x <= 0) throw invalid_argument("So tien phai duong");
        if (x > soDu) throw LoiSoDu(x - soDu);
        soDu -= x;
    }
};

int main() {
    TaiKhoan tk(1000);
    long long cacLan[] = {300, -5, 900, 200};
    for (long long x : cacLan) {
        try {
            tk.rut(x);
            cout << "Rut " << x << " -> con " << tk.getSoDu() << endl;
        } catch (const LoiSoDu& e) {               // lop rieng: bat truoc
            cout << e.what() << ", thieu " << e.getThieu() << endl;
        } catch (const exception& e) {             // moi loi chuan khac
            cout << "Loi: " << e.what() << endl;
        }
    }
    // Rut 300 -> con 700
    // Loi: So tien phai duong
    // So du khong du, thieu 200
    // Rut 200 -> con 500
    return 0;
}` },
        { loai: "p", text: "Constructor của lớp ngoại lệ gọi constructor của `runtime_error` trong danh sách khởi tạo để truyền **thông điệp**; đó chính là chuỗi mà `what()` trả về. Phần dữ liệu thêm (`thieu`) được lưu như thuộc tính thường và đọc qua getter. Thông điệp có thể ghép động, ví dụ `runtime_error(\"Khong tim thay \" + ten)`." },
        { loai: "p", text: "Khi có nhiều loại lỗi liên quan, có thể xây cả một **cây ngoại lệ**: một lớp `LoiKho` làm cha chung, các lớp `LoiKhongDuHang`, `LoiKhongTimThay` kế thừa nó. Nơi gọi có thể bắt riêng từng loại để xử lý khác nhau, hoặc bắt chung `LoiKho` khi cách xử lý giống nhau. Đây cũng là đa hình mà bạn đã học ở chương 5, chỉ áp dụng cho lỗi." },
        { loai: "list", items: [
          "Ném theo **giá trị** (`throw LoiSoDu(200);`), bắt theo **tham chiếu hằng** (`catch (const LoiSoDu& e)`).",
          "Không ném con trỏ do `new` tạo ra (`throw new LoiSoDu(...)`): nơi bắt dễ quên `delete`, gây rò rỉ.",
          "Trong khối `catch`, lệnh `throw;` (không kèm gì) ném lại chính ngoại lệ đang xử lý cho tầng ngoài.",
          "Nhờ destructor tự chạy khi ngoại lệ đi qua, `vector`, `string` và các đối tượng cục bộ được dọn dẹp tự động; đó là một lý do nữa để ưu tiên chúng thay vì `new`/`delete` thủ công."
        ] },
        { loai: "note", text: "Đặt tên ngoại lệ theo **điều gì đã sai** (`LoiSoDu`, `LoiKhongTimThay`) chứ không theo nơi xảy ra. Thông điệp nên đủ rõ để người đọc log hiểu ngay vấn đề mà không cần mở mã nguồn." }
      ]
    }
  ],
  baiTap: [
    {
      id: "c6-bt1",
      muc: 1,
      tieuDe: "Lọc số chẵn bằng vector",
      deBai: "Dòng đầu là `n`, dòng thứ hai gồm `n` số nguyên. Đọc dữ liệu vào một `vector<int>`, tạo vector mới chỉ chứa các số chẵn (giữ nguyên thứ tự). In các số chẵn trên một dòng, cách nhau một dấu cách (nếu không có số chẵn nào thì in `KHONG CO`), dòng tiếp theo in `So luong: K` với K là số lượng số chẵn.",
      viDu: { input: "6\n1 2 3 4 5 6", output: "2 4 6\nSo luong: 3" },
      loiGiai: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) {          // tham chieu de doc thang vao phan tu
        cin >> x;
    }

    vector<int> chan;
    for (int x : a) {
        if (x % 2 == 0) chan.push_back(x);
    }

    if (chan.empty()) {
        cout << "KHONG CO" << endl;
    } else {
        for (size_t i = 0; i < chan.size(); i++) {
            if (i > 0) cout << " ";
            cout << chan[i];
        }
        cout << endl;
    }
    cout << "So luong: " << chan.size() << endl;
    return 0;
}`,
      giaiThich: "Vector `chan` bắt đầu rỗng và lớn dần nhờ `push_back`, không cần biết trước có bao nhiêu số chẵn. Vòng `for (int& x : a)` dùng tham chiếu nên `cin` ghi trực tiếp vào từng phần tử."
    },
    {
      id: "c6-bt2",
      muc: 1,
      tieuDe: "Sắp xếp giảm dần",
      deBai: "Dòng đầu là `n`, dòng thứ hai gồm `n` số nguyên. Dùng `sort` trong `<algorithm>` để sắp xếp dãy theo thứ tự **giảm dần** rồi in dãy trên một dòng, các số cách nhau một dấu cách.",
      viDu: { input: "5\n3 1 4 1 5", output: "5 4 3 1 1" },
      loiGiai: `#include <algorithm>
#include <functional>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    sort(a.begin(), a.end(), greater<int>());   // greater: lon dung truoc

    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << a[i];
    }
    cout << endl;
    return 0;
}`,
      giaiThich: "`sort` mặc định sắp tăng dần; truyền thêm `greater<int>()` làm hàm so sánh thì phần tử lớn hơn đứng trước. Cũng có thể dùng lambda `[](int x, int y) { return x > y; }`."
    },
    {
      id: "c6-bt3",
      muc: 2,
      tieuDe: "Đếm tần suất từ",
      deBai: "Dòng đầu là `n`, dòng thứ hai gồm `n` từ (chữ thường, không dấu cách). Dùng `map<string, int>` đếm số lần xuất hiện của mỗi từ, rồi in mỗi từ khác nhau trên một dòng theo thứ tự từ điển, dạng `TU SOLAN`.",
      viDu: { input: "6\nan binh an chi binh an", output: "an 3\nbinh 2\nchi 1" },
      loiGiai: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> dem;
    for (int i = 0; i < n; i++) {
        string tu;
        cin >> tu;
        dem[tu]++;              // lan dau gap: tu tao voi gia tri 0 roi tang
    }
    for (const auto& kv : dem) {
        cout << kv.first << " " << kv.second << endl;
    }
    return 0;
}`,
      giaiThich: "`dem[tu]++` vừa thêm từ mới (giá trị khởi đầu 0) vừa tăng bộ đếm. Map luôn sắp theo khóa nên chỉ cần duyệt là có thứ tự từ điển."
    },
    {
      id: "c6-bt4",
      muc: 2,
      tieuDe: "Các giá trị khác nhau",
      deBai: "Dòng đầu là `n`, dòng thứ hai gồm `n` số nguyên. Dùng `set<int>` để tìm các giá trị khác nhau. In dòng thứ nhất là số lượng giá trị khác nhau, dòng thứ hai là các giá trị đó theo thứ tự tăng dần, cách nhau một dấu cách.",
      viDu: { input: "8\n5 3 5 1 3 9 1 5", output: "4\n1 3 5 9" },
      loiGiai: `#include <iostream>
#include <set>
using namespace std;

int main() {
    int n;
    cin >> n;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.insert(x);            // gia tri da co thi bi bo qua
    }

    cout << s.size() << endl;
    bool dau = true;
    for (int x : s) {           // set tu sap tang dan
        if (!dau) cout << " ";
        cout << x;
        dau = false;
    }
    cout << endl;
    return 0;
}`,
      giaiThich: "Set tự loại bỏ phần tử trùng và giữ thứ tự tăng dần, nên `s.size()` chính là số giá trị khác nhau và duyệt set cho ra dãy đã sắp xếp. Set không có chỉ số nên dùng cờ `dau` để in dấu cách đúng chỗ."
    },
    {
      id: "c6-bt5",
      muc: 3,
      tieuDe: "Xếp hạng sinh viên",
      deBai: "Dòng đầu là `n`, mỗi dòng tiếp theo gồm tên (một từ) và điểm (số nguyên) của một sinh viên. Lưu vào `vector<pair<string, int>>` và dùng `sort` với lambda để sắp xếp theo điểm **giảm dần**; nếu cùng điểm thì theo tên **tăng dần** (thứ tự từ điển). In danh sách sau khi sắp xếp, mỗi dòng `TEN DIEM`.",
      viDu: { input: "4\nNam 8\nAn 9\nBinh 8\nCuong 7", output: "An 9\nBinh 8\nNam 8\nCuong 7" },
      loiGiai: `#include <algorithm>
#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<string, int>> ds(n);
    for (auto& sv : ds) {
        cin >> sv.first >> sv.second;
    }

    sort(ds.begin(), ds.end(), [](const pair<string, int>& a, const pair<string, int>& b) {
        if (a.second != b.second) return a.second > b.second;   // diem cao dung truoc
        return a.first < b.first;                               // cung diem: ten tang dan
    });

    for (const auto& [ten, diem] : ds) {
        cout << ten << " " << diem << endl;
    }
    return 0;
}`,
      giaiThich: "Lambda so sánh trả về `true` khi `a` phải đứng trước `b`: trước hết so điểm theo chiều giảm, chỉ khi bằng điểm mới so tên. Structured binding `auto [ten, diem]` giúp phần in dễ đọc hơn `first`/`second`."
    },
    {
      id: "c6-bt6",
      muc: 3,
      tieuDe: "Phép chia an toàn",
      deBai: "Dòng đầu là `n`, dòng thứ hai gồm `n` số nguyên lưu vào vector `a`. Dòng tiếp theo là `q`, sau đó là `q` dòng, mỗi dòng hai chỉ số `i j` (có thể âm hoặc vượt quá). Với mỗi truy vấn tính `a[i] / a[j]` (chia số thực) trong một hàm dùng `a.at(...)` và ném `runtime_error` khi số chia bằng 0. Bắt ngoại lệ trong `main`: nếu chỉ số không hợp lệ in `Loi: chi so khong hop le`, nếu chia cho 0 in `Loi: chia cho 0`, ngược lại in kết quả với 2 chữ số sau dấu chấm.",
      viDu: { input: "5\n10 0 4 7 2\n4\n0 2\n2 1\n1 9\n4 2", output: "2.50\nLoi: chia cho 0\nLoi: chi so khong hop le\n0.50" },
      loiGiai: `#include <iomanip>
#include <iostream>
#include <stdexcept>
#include <vector>
using namespace std;

double chia(const vector<int>& a, int i, int j) {
    int x = a.at(i);            // nem out_of_range neu i sai
    int y = a.at(j);
    if (y == 0) {
        throw runtime_error("chia cho 0");
    }
    return (double)x / y;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    int q;
    cin >> q;
    cout << fixed << setprecision(2);
    for (int k = 0; k < q; k++) {
        int i, j;
        cin >> i >> j;
        try {
            cout << chia(a, i, j) << endl;
        } catch (const out_of_range& e) {
            cout << "Loi: chi so khong hop le" << endl;
        } catch (const runtime_error& e) {
            cout << "Loi: " << e.what() << endl;
        }
    }
    return 0;
}`,
      giaiThich: "Hàm `chia` chỉ phát hiện lỗi và ném ngoại lệ, còn việc in thông báo do `main` quyết định. `at` tự ném `out_of_range` khi chỉ số sai (chỉ số âm bị đổi sang số không dấu rất lớn nên cũng bị bắt). Mỗi truy vấn có khối try riêng nên một lỗi không làm dừng các truy vấn sau."
    },
    {
      id: "c6-bt7",
      muc: 4,
      tieuDe: "Nhóm các từ đảo chữ",
      deBai: "Hai từ là **đảo chữ** của nhau nếu sắp xếp lại các chữ cái của từ này được từ kia (ví dụ `eat` và `tea`). Dòng đầu là `n`, dòng thứ hai gồm `n` từ chữ thường. Hãy gom các từ thành nhóm đảo chữ. In mỗi nhóm trên một dòng, các từ cách nhau một dấu cách theo thứ tự xuất hiện; các nhóm in theo thứ tự xuất hiện lần đầu của nhóm.",
      viDu: { input: "6\neat tea tan ate nat bat", output: "eat tea ate\ntan nat\nbat" },
      loiGiai: `#include <algorithm>
#include <iostream>
#include <map>
#include <string>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> viTriNhom;          // khoa chuan -> chi so nhom
    vector<vector<string>> nhom;         // cac nhom theo thu tu xuat hien

    for (int i = 0; i < n; i++) {
        string tu;
        cin >> tu;
        string khoa = tu;
        sort(khoa.begin(), khoa.end());  // "tea" va "eat" deu thanh "aet"

        auto it = viTriNhom.find(khoa);
        if (it == viTriNhom.end()) {
            viTriNhom[khoa] = (int)nhom.size();
            nhom.push_back({tu});        // mo nhom moi
        } else {
            nhom[it->second].push_back(tu);
        }
    }

    for (const auto& g : nhom) {
        for (size_t k = 0; k < g.size(); k++) {
            if (k > 0) cout << " ";
            cout << g[k];
        }
        cout << endl;
    }
    return 0;
}`,
      giaiThich: "Mọi từ trong cùng một nhóm đảo chữ có chung \"khóa chuẩn\" là chuỗi chữ cái đã sắp xếp. Map ánh xạ khóa sang chỉ số nhóm trong `vector<vector<string>>`; vì nhóm được thêm vào vector theo lần đầu xuất hiện nên thứ tự in đúng yêu cầu."
    },
    {
      id: "c6-bt8",
      muc: 4,
      tieuDe: "Quản lý kho với ngoại lệ tự định nghĩa",
      deBai: "Viết lớp `KhoHang` dùng `map<string, int>` lưu tồn kho, và cây ngoại lệ tự định nghĩa: `LoiKho` kế thừa `runtime_error`, hai lớp con `LoiKhongDuHang` và `LoiKhongTimThay`. Dòng đầu là `q`, mỗi dòng sau là một lệnh `NHAP ten sl` hoặc `XUAT ten sl`. Số lượng không dương thì ném `invalid_argument(\"so luong khong hop le\")`; xuất mặt hàng chưa từng nhập thì ném `LoiKhongTimThay` với thông điệp `khong tim thay TEN`; xuất quá số tồn thì ném `LoiKhongDuHang` với thông điệp `khong du hang TEN (con X, can Y)`. Trong `main`, lỗi kho in `Loi: THONGDIEP`, các lỗi khác in `Loi nhap lieu: THONGDIEP`. Sau khi xử lý hết, in tồn kho theo thứ tự tên tăng dần, mỗi dòng `TEN SOLUONG`.",
      viDu: { input: "7\nNHAP but 10\nNHAP vo 5\nXUAT but 4\nXUAT vo 8\nXUAT thuoc 1\nNHAP ghe -2\nNHAP but 3", output: "Loi: khong du hang vo (con 5, can 8)\nLoi: khong tim thay thuoc\nLoi nhap lieu: so luong khong hop le\nbut 9\nvo 5" },
      loiGiai: `#include <iostream>
#include <map>
#include <stdexcept>
#include <string>
using namespace std;

// Cay ngoai le rieng cua kho
class LoiKho : public runtime_error {
public:
    LoiKho(const string& thongDiep) : runtime_error(thongDiep) {}
};

class LoiKhongDuHang : public LoiKho {
public:
    LoiKhongDuHang(const string& ten, int con, int can)
        : LoiKho("khong du hang " + ten + " (con " + to_string(con) +
                 ", can " + to_string(can) + ")") {}
};

class LoiKhongTimThay : public LoiKho {
public:
    LoiKhongTimThay(const string& ten) : LoiKho("khong tim thay " + ten) {}
};

class KhoHang {
private:
    map<string, int> ton;
public:
    void nhap(const string& ten, int sl) {
        if (sl <= 0) throw invalid_argument("so luong khong hop le");
        ton[ten] += sl;
    }
    void xuat(const string& ten, int sl) {
        if (sl <= 0) throw invalid_argument("so luong khong hop le");
        auto it = ton.find(ten);
        if (it == ton.end()) throw LoiKhongTimThay(ten);
        if (it->second < sl) throw LoiKhongDuHang(ten, it->second, sl);
        it->second -= sl;
    }
    void inTonKho() const {
        for (const auto& kv : ton) {
            cout << kv.first << " " << kv.second << endl;
        }
    }
};

int main() {
    int q;
    cin >> q;
    KhoHang kho;
    for (int i = 0; i < q; i++) {
        string lenh, ten;
        int sl;
        cin >> lenh >> ten >> sl;
        try {
            if (lenh == "NHAP") kho.nhap(ten, sl);
            else if (lenh == "XUAT") kho.xuat(ten, sl);
            else throw invalid_argument("lenh khong hop le");
        } catch (const LoiKho& e) {          // bat chung moi loi kho
            cout << "Loi: " << e.what() << endl;
        } catch (const exception& e) {       // cac loi con lai
            cout << "Loi nhap lieu: " << e.what() << endl;
        }
    }
    kho.inTonKho();
    return 0;
}`,
      giaiThich: "Hai lỗi nghiệp vụ cùng kế thừa `LoiKho`, nên `main` chỉ cần một khối `catch (const LoiKho&)` để bắt cả hai, còn `invalid_argument` rơi xuống khối `catch (const exception&)`. Lớp `KhoHang` chỉ phát hiện và ném lỗi, không tự in gì; thông điệp được ghép bằng `to_string` ngay trong constructor của ngoại lệ."
    }
  ]
};
