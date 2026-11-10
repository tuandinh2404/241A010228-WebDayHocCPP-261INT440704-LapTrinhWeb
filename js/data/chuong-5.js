window.CHUONG = window.CHUONG || {};
window.CHUONG[5] = {
  so: 5,
  ten: "Lập trình hướng đối tượng",
  tomTat: "Tự định nghĩa lớp để gom dữ liệu và hành vi vào một chỗ: đóng gói bằng public/private, khởi tạo và dọn dẹp đối tượng bằng constructor/destructor, dùng con trỏ this, getter/setter, thành viên static, nạp chồng toán tử, rồi xây dựng hệ thống lớp bằng kế thừa, hàm virtual, đa hình và lớp trừu tượng.",
  baiGiang: [
    {
      id: "c5-l1",
      tieuDe: "Lớp, đối tượng và phạm vi truy cập",
      noiDung: [
        { loai: "p", text: "Ở chương trước, `struct` giúp ta gom nhiều trường dữ liệu lại với nhau. Nhưng dữ liệu và các hàm xử lý nó vẫn nằm rời rạc, và bất kỳ ai cũng có thể gán `sv.diem = -5` mà không bị ngăn cản. **Lập trình hướng đối tượng** (OOP) giải quyết điều này bằng **lớp** (class): một kiểu dữ liệu chứa cả **thuộc tính** (biến thành viên) lẫn **phương thức** (hàm thành viên), đồng thời kiểm soát được ai được phép chạm vào dữ liệu bên trong." },
        { loai: "p", text: "Lớp giống một **bản thiết kế**, còn **đối tượng** (object) là một thực thể cụ thể được tạo ra từ bản thiết kế đó. Lớp `SinhVien` mô tả mọi sinh viên đều có tên và điểm; còn `a`, `b` là hai sinh viên cụ thể, mỗi người có dữ liệu riêng. Gọi phương thức qua dấu chấm: `a.inThongTin()` sẽ in thông tin của riêng `a`." },
        { loai: "code", text: `#include <iostream>
#include <string>
using namespace std;

class SinhVien {
private:                 // chi phuong thuc cua lop moi truy cap duoc
    string ten;
    double diem;

public:                  // ben ngoai lop duoc phep goi
    void datThongTin(string t, double d) {
        ten = t;
        if (d >= 0 && d <= 10) diem = d;   // kiem tra du lieu hop le
        else diem = 0;
    }
    void inThongTin() {
        cout << ten << " - " << diem << endl;
    }
    bool duocHocBong() {
        return diem >= 8.0;
    }
};

int main() {
    SinhVien a, b;
    a.datThongTin("An", 8.5);
    b.datThongTin("Binh", 12);     // diem sai nen bi dat ve 0
    a.inThongTin();                // An - 8.5
    b.inThongTin();                // Binh - 0
    cout << a.duocHocBong() << endl;   // 1 (true)
    // a.diem = 10;   // LOI bien dich: diem la private
    return 0;
}` },
        { loai: "p", text: "Hai từ khóa `public` và `private` quy định **phạm vi truy cập**. Thành viên `private` chỉ được dùng bên trong các phương thức của chính lớp đó; thành viên `public` thì nơi nào cũng gọi được. Cách làm phổ biến là để mọi thuộc tính ở `private` và chỉ mở ra những phương thức cần thiết ở `public`. Nguyên tắc này gọi là **đóng gói** (encapsulation): lớp tự bảo vệ dữ liệu của mình, mọi thay đổi phải đi qua phương thức có kiểm tra, nên đối tượng luôn ở trạng thái hợp lệ." },
        { loai: "table", head: ["", "struct", "class"], rows: [
          ["Phạm vi mặc định", "`public`", "`private`"],
          ["Có phương thức, constructor, kế thừa", "Có", "Có"],
          ["Thói quen sử dụng", "Gói dữ liệu đơn giản", "Đối tượng có hành vi và ràng buộc"]
        ] },
        { loai: "p", text: "Với lớp lớn, ta thường chỉ **khai báo** phương thức trong lớp rồi **định nghĩa** bên ngoài bằng toán tử phạm vi `::`, ví dụ `void SinhVien::inThongTin() { ... }`. Cách này giúp phần khai báo lớp ngắn gọn, dễ đọc như một bản mục lục." },
        { loai: "note", text: "Đừng quên dấu chấm phẩy sau dấu `}` kết thúc lớp: `class A { ... };`. Thiếu dấu này trình biên dịch sẽ báo lỗi ở một dòng phía sau, rất dễ gây bối rối." }
      ]
    },
    {
      id: "c5-l2",
      tieuDe: "Constructor, danh sách khởi tạo và destructor",
      noiDung: [
        { loai: "p", text: "Trong ví dụ trước, nếu quên gọi `datThongTin` thì `diem` mang giá trị rác. **Constructor** (hàm khởi tạo) giải quyết triệt để vấn đề này: đó là phương thức đặc biệt **trùng tên với lớp**, **không có kiểu trả về**, và được gọi **tự động** mỗi khi một đối tượng được tạo ra. Một lớp có thể có nhiều constructor với danh sách tham số khác nhau (nạp chồng)." },
        { loai: "list", items: [
          "**Constructor mặc định**: không có tham số, chạy khi viết `HinhChuNhat a;`.",
          "**Constructor có tham số**: nhận giá trị ban đầu, chạy khi viết `HinhChuNhat b(3, 4);`.",
          "Nếu ta không viết constructor nào, trình biên dịch tự sinh constructor mặc định rỗng. Nhưng chỉ cần viết một constructor có tham số, constructor mặc định tự sinh sẽ **biến mất**."
        ] },
        { loai: "p", text: "Cách khởi tạo thuộc tính được khuyến khích là **danh sách khởi tạo** (initializer list), viết sau dấu `:` trước thân hàm: `HinhChuNhat(double r, double c) : rong(r), cao(c) {}`. Thuộc tính được khởi tạo trực tiếp bằng giá trị, thay vì tạo ra rồi mới gán. Với thuộc tính `const`, thuộc tính kiểu tham chiếu, hay thuộc tính là đối tượng không có constructor mặc định, danh sách khởi tạo là **cách duy nhất**." },
        { loai: "code", text: `#include <iostream>
using namespace std;

class HinhChuNhat {
private:
    double rong, cao;
public:
    HinhChuNhat() : rong(1), cao(1) {
        cout << "Tao mac dinh" << endl;
    }
    HinhChuNhat(double r, double c) : rong(r), cao(c) {
        cout << "Tao co tham so" << endl;
    }
    ~HinhChuNhat() {
        cout << "Huy hinh " << rong << "x" << cao << endl;
    }
    double dienTich() const {        // const: khong sua thuoc tinh
        return rong * cao;
    }
};

int main() {
    HinhChuNhat a;              // Tao mac dinh
    HinhChuNhat b(3, 4);        // Tao co tham so
    cout << a.dienTich() << " " << b.dienTich() << endl;   // 1 12

    HinhChuNhat* p = new HinhChuNhat(2, 5);   // Tao co tham so
    cout << p->dienTich() << endl;            // 10
    delete p;                                 // Huy hinh 2x5
    return 0;
}   // ra khoi main: Huy hinh 3x4, roi Huy hinh 1x1 (nguoc thu tu tao)` },
        { loai: "p", text: "**Destructor** (hàm hủy) có tên là dấu ngã cộng tên lớp (`~HinhChuNhat`), không tham số, không kiểu trả về, và được gọi tự động khi đối tượng bị hủy: biến cục bộ ra khỏi phạm vi, hoặc đối tượng trên heap bị `delete`. Các đối tượng cục bộ bị hủy theo **thứ tự ngược** với thứ tự tạo. Destructor là nơi lý tưởng để giải phóng tài nguyên mà đối tượng nắm giữ, chẳng hạn bộ nhớ đã `new` trong constructor." },
        { loai: "p", text: "Từ khóa `const` sau danh sách tham số (`double dienTich() const`) cam kết phương thức không thay đổi thuộc tính. Chỉ phương thức `const` mới gọi được trên đối tượng `const`, vì vậy hãy đánh dấu `const` cho mọi phương thức chỉ đọc." },
        { loai: "note", text: "Thuộc tính được khởi tạo theo **thứ tự khai báo trong lớp**, không theo thứ tự viết trong danh sách khởi tạo. Hãy viết danh sách khởi tạo theo đúng thứ tự khai báo để tránh cảnh báo và lỗi khó thấy." }
      ]
    },
    {
      id: "c5-l3",
      tieuDe: "Con trỏ this, getter và setter",
      noiDung: [
        { loai: "p", text: "Mỗi phương thức không tĩnh đều nhận ngầm một con trỏ tên là `this`, trỏ tới **chính đối tượng đang gọi** phương thức. Khi viết `tk.napTien(500)`, bên trong `napTien` thì `this` bằng `&tk`. Thông thường ta không cần viết `this` vì trình biên dịch tự hiểu `soDu` là `this->soDu`. Nhưng có hai trường hợp `this` rất hữu ích:" },
        { loai: "list", items: [
          "Tham số trùng tên với thuộc tính: `this->chuTk = chuTk;` phân biệt thuộc tính (bên trái) với tham số (bên phải).",
          "Trả về chính đối tượng để **gọi nối tiếp**: phương thức trả về `*this` dưới dạng tham chiếu, cho phép viết `tk.napTien(500).napTien(200);`."
        ] },
        { loai: "p", text: "Vì thuộc tính để `private`, bên ngoài cần một cách có kiểm soát để đọc và sửa chúng. **Getter** là phương thức trả về giá trị thuộc tính (thường đặt tên `getX`, đánh dấu `const`). **Setter** là phương thức gán giá trị mới (`setX`), và đây chính là chỗ để **kiểm tra tính hợp lệ** trước khi chấp nhận. Không phải thuộc tính nào cũng cần setter: số dư tài khoản không nên cho gán tùy ý, mà chỉ thay đổi qua nạp và rút tiền." },
        { loai: "code", text: `#include <iostream>
#include <string>
using namespace std;

class TaiKhoan {
private:
    string chuTk;
    long long soDu;
public:
    TaiKhoan(string chuTk, long long soDu) {
        this->chuTk = chuTk;                  // this->chuTk: thuoc tinh; chuTk: tham so
        this->soDu = (soDu >= 0) ? soDu : 0;
    }

    // Getter: chi doc, danh dau const
    string getChuTk() const { return chuTk; }
    long long getSoDu() const { return soDu; }

    // Setter co kiem tra
    void setChuTk(const string& tenMoi) {
        if (!tenMoi.empty()) chuTk = tenMoi;
    }

    // Tra ve *this de goi noi tiep
    TaiKhoan& napTien(long long x) {
        if (x > 0) soDu += x;
        return *this;
    }
};

int main() {
    TaiKhoan tk("An", 1000);
    tk.napTien(500).napTien(200);        // goi noi tiep
    tk.setChuTk("");                     // ten rong bi tu choi
    cout << tk.getChuTk() << ": " << tk.getSoDu() << endl;   // An: 1700
    tk.setChuTk("Nguyen An");
    cout << tk.getChuTk() << endl;       // Nguyen An
    return 0;
}` },
        { loai: "p", text: "Lưu ý kiểu trả về `TaiKhoan&` của `napTien`. Nếu trả về `TaiKhoan` (không có `&`), mỗi lần gọi sẽ tạo một **bản sao**, và lệnh nạp thứ hai chỉ tác động lên bản sao đó chứ không phải `tk`. Đây là lỗi tinh vi rất hay gặp khi mới học gọi nối tiếp." },
        { loai: "note", text: "Getter/setter không phải để \"mở cửa sau\" cho mọi thuộc tính. Nếu lớp nào cũng có `get`/`set` cho tất cả thuộc tính mà không kiểm tra gì, việc để `private` gần như vô nghĩa. Hãy chỉ cung cấp những thao tác thật sự cần." }
      ]
    },
    {
      id: "c5-l4",
      tieuDe: "Thành viên static",
      noiDung: [
        { loai: "p", text: "Thuộc tính thông thường thuộc về **từng đối tượng**: mỗi sinh viên có tên riêng, điểm riêng. Đôi khi ta cần dữ liệu thuộc về **cả lớp**, được mọi đối tượng dùng chung, ví dụ \"tổng số sinh viên đã tạo\" hay \"mã số tiếp theo sẽ cấp\". Khi đó khai báo thuộc tính với từ khóa `static`: chỉ có **một bản duy nhất** tồn tại, dù có bao nhiêu đối tượng, kể cả khi chưa có đối tượng nào." },
        { loai: "p", text: "Thuộc tính `static` được **khai báo** trong lớp nhưng phải được **định nghĩa** (cấp chỗ và gán giá trị đầu) đúng một lần bên ngoài lớp: `int SinhVien::soLuong = 0;`. Từ C++17 có thể viết gọn `static inline int soLuong = 0;` ngay trong lớp. Bên ngoài lớp, truy cập thành viên static qua tên lớp: `SinhVien::getSoLuong()`." },
        { loai: "code", text: `#include <iostream>
#include <string>
using namespace std;

class SinhVien {
private:
    static int soLuong;     // khai bao: dung chung cho ca lop
    int maSo;
    string ten;
public:
    SinhVien(const string& t) : ten(t) {
        soLuong++;
        maSo = soLuong;     // cap ma so tang dan
    }
    ~SinhVien() {
        soLuong--;
    }
    static int getSoLuong() {   // ham static: goi khong can doi tuong
        return soLuong;
    }
    void in() const {
        cout << maSo << " " << ten << endl;
    }
};

int SinhVien::soLuong = 0;      // dinh nghia, dung mot lan ngoai lop

int main() {
    cout << SinhVien::getSoLuong() << endl;   // 0
    SinhVien a("An"), b("Binh");
    a.in();                                   // 1 An
    b.in();                                   // 2 Binh
    {
        SinhVien c("Chi");
        cout << SinhVien::getSoLuong() << endl;   // 3
    }                                         // c bi huy o day
    cout << SinhVien::getSoLuong() << endl;   // 2
    return 0;
}` },
        { loai: "p", text: "**Phương thức static** cũng thuộc về lớp chứ không thuộc đối tượng nào, nên nó **không có con trỏ `this`**. Hệ quả là trong phương thức static chỉ được dùng các thành viên static khác; truy cập `maSo` hay `ten` sẽ gây lỗi biên dịch, vì không biết đó là `maSo` của đối tượng nào." },
        { loai: "table", head: ["", "Thành viên thường", "Thành viên static"], rows: [
          ["Thuộc về", "Từng đối tượng", "Cả lớp"],
          ["Số bản sao", "Mỗi đối tượng một bản", "Đúng một bản"],
          ["Cách gọi", "`a.in()`", "`SinhVien::getSoLuong()`"],
          ["Có `this`", "Có", "Không"]
        ] },
        { loai: "note", text: "Quên dòng định nghĩa `int SinhVien::soLuong = 0;` sẽ gây lỗi khi **liên kết** (linker) dạng \"undefined reference to SinhVien::soLuong\", không phải lỗi biên dịch thông thường." }
      ]
    },
    {
      id: "c5-l5",
      tieuDe: "Nạp chồng toán tử",
      noiDung: [
        { loai: "p", text: "Với kiểu `int` ta viết `a + b`, `a == b`, `cout << a` rất tự nhiên. **Nạp chồng toán tử** (operator overloading) cho phép lớp do ta tự viết cũng dùng được các ký hiệu đó. Về bản chất, `a + b` chỉ là cách viết gọn của lời gọi hàm `a.operator+(b)`; ta định nghĩa hàm có tên đặc biệt `operator+` là xong." },
        { loai: "code", text: `#include <iostream>
using namespace std;

class PhanSo {
private:
    int tu, mau;
public:
    PhanSo(int t = 0, int m = 1) : tu(t), mau(m) {}

    // a + b  <=>  a.operator+(b)
    PhanSo operator+(const PhanSo& b) const {
        return PhanSo(tu * b.mau + b.tu * mau, mau * b.mau);
    }

    // So sanh bang nhan cheo, khong can rut gon
    bool operator==(const PhanSo& b) const {
        return tu * b.mau == b.tu * mau;
    }

    // cout << p: ve trai la ostream nen phai la ham ngoai lop (friend)
    friend ostream& operator<<(ostream& os, const PhanSo& p) {
        os << p.tu << "/" << p.mau;
        return os;
    }
};

int main() {
    PhanSo a(1, 2), b(1, 3);
    PhanSo c = a + b;
    cout << c << endl;                               // 5/6
    cout << (a == PhanSo(2, 4)) << endl;             // 1
    cout << a << " + " << b << " = " << a + b << endl;   // 1/2 + 1/3 = 5/6
    return 0;
}` },
        { loai: "p", text: "Toán tử `+` và `==` được viết như **phương thức** của lớp: đối tượng bên trái là `this`, đối tượng bên phải là tham số. Tham số nhận dạng `const PhanSo&` để tránh sao chép, và phương thức được đánh dấu `const` vì phép cộng không làm thay đổi toán hạng. Phép `+` trả về **đối tượng mới** theo giá trị, còn `==` trả về `bool`." },
        { loai: "p", text: "Toán tử `<<` thì khác: trong `cout << p`, vế trái là `cout` (kiểu `ostream`), không phải `PhanSo`, nên nó không thể là phương thức của `PhanSo`. Ta viết nó thành **hàm tự do** và khai báo `friend` bên trong lớp để hàm được phép đọc thuộc tính `private`. Hàm phải trả về `ostream&` (chính `os`) để chuỗi `cout << a << b << endl` tiếp tục được." },
        { loai: "table", head: ["Toán tử", "Cách khai báo thường dùng", "Trả về"], rows: [
          ["`+`, `-`, `*`", "Phương thức `const`, tham số `const T&`", "Đối tượng mới `T`"],
          ["`==`, `<`", "Phương thức `const`", "`bool`"],
          ["`+=`", "Phương thức không `const`", "`T&` (chính `*this`)"],
          ["`<<`, `>>`", "Hàm `friend` ngoài lớp", "`ostream&` / `istream&`"]
        ] },
        { loai: "note", text: "Hãy giữ đúng ý nghĩa quen thuộc của toán tử: `+` nên là phép cộng, không nên in ra màn hình hay sửa toán hạng. Toán tử có ý nghĩa bất ngờ khiến mã khó đọc hơn cả gọi hàm thông thường." }
      ]
    },
    {
      id: "c5-l6",
      tieuDe: "Kế thừa",
      noiDung: [
        { loai: "p", text: "Nhiều lớp có phần chung: chó, mèo đều là động vật có tên và biết ăn. Thay vì chép lại mã, ta viết một **lớp cơ sở** (base class) `DongVat` chứa phần chung, rồi cho `Cho` và `Meo` **kế thừa** (inheritance) từ nó. Lớp dẫn xuất (derived class) tự động có mọi thuộc tính và phương thức của lớp cơ sở, và bổ sung thêm phần riêng của mình. Quan hệ kế thừa nên thỏa mãn câu \"là một\": chó **là một** động vật." },
        { loai: "code", text: `#include <iostream>
#include <string>
using namespace std;

class DongVat {
protected:                    // lop con truy cap duoc, ben ngoai thi khong
    string ten;
public:
    DongVat(const string& t) : ten(t) {
        cout << "DongVat()" << endl;
    }
    ~DongVat() {
        cout << "~DongVat()" << endl;
    }
    void an() const {
        cout << ten << " dang an" << endl;
    }
};

class Cho : public DongVat {
public:
    // Goi constructor lop cha trong danh sach khoi tao
    Cho(const string& t) : DongVat(t) {
        cout << "Cho()" << endl;
    }
    ~Cho() {
        cout << "~Cho()" << endl;
    }
    void sua() const {
        cout << ten << ": Gau gau!" << endl;   // dung duoc ten vi la protected
    }
};

int main() {
    Cho c("Milu");      // DongVat() roi Cho()
    c.an();             // Milu dang an   (ke thua tu DongVat)
    c.sua();            // Milu: Gau gau!
    return 0;
}                       // ~Cho() roi ~DongVat()` },
        { loai: "p", text: "Cú pháp `class Cho : public DongVat` nghĩa là kế thừa **công khai**: phần `public` của lớp cha vẫn là `public` trong lớp con. Đây là kiểu kế thừa dùng trong hầu hết trường hợp. Thành viên `private` của lớp cha vẫn tồn tại trong đối tượng con nhưng lớp con **không truy cập trực tiếp** được; muốn lớp con dùng được mà bên ngoài vẫn không thấy, hãy dùng `protected`." },
        { loai: "table", head: ["Phạm vi trong lớp cha", "Trong lớp con", "Bên ngoài"], rows: [
          ["`public`", "Truy cập được", "Truy cập được"],
          ["`protected`", "Truy cập được", "Không"],
          ["`private`", "Không", "Không"]
        ] },
        { loai: "p", text: "Thứ tự xây dựng luôn là **cha trước, con sau**: phần lớp cha phải sẵn sàng thì lớp con mới dựa vào được. Nếu lớp cha không có constructor mặc định, constructor của lớp con **bắt buộc** gọi constructor của cha trong danh sách khởi tạo như `: DongVat(t)`. Khi hủy thì ngược lại: destructor của con chạy trước, rồi đến của cha." },
        { loai: "p", text: "Lớp con cũng có thể **định nghĩa lại** một phương thức trùng tên với lớp cha, ví dụ `Cho` tự viết `an()` riêng. Tuy nhiên nếu không có từ khóa `virtual`, việc chọn phương thức nào dựa vào **kiểu của biến** lúc biên dịch, chứ không phải kiểu thật của đối tượng. Phần tiếp theo sẽ giải thích vì sao điều này quan trọng." },
        { loai: "note", text: "Không lạm dụng kế thừa chỉ để dùng lại mã. Nếu câu \"B là một A\" nghe vô lý (ví dụ ô tô \"là một\" động cơ), hãy cho B **chứa** một đối tượng A làm thuộc tính thay vì kế thừa." }
      ]
    },
    {
      id: "c5-l7",
      tieuDe: "Hàm virtual, đa hình và lớp trừu tượng",
      noiDung: [
        { loai: "p", text: "Sức mạnh thật sự của kế thừa nằm ở chỗ một con trỏ (hoặc tham chiếu) kiểu lớp cha có thể trỏ tới đối tượng lớp con: `Hinh* h = new HinhTron(2);` là hợp lệ. Nhờ đó ta có thể cất nhiều loại hình khác nhau vào cùng một mảng `Hinh*` và xử lý chung bằng một vòng lặp. Câu hỏi là: khi gọi `h->dienTich()`, phương thức của `Hinh` hay của `HinhTron` được chạy?" },
        { loai: "p", text: "Nếu `dienTich` là phương thức thường, C++ chọn theo **kiểu con trỏ** (`Hinh`) ngay lúc biên dịch, và kết quả sai. Khi khai báo phương thức với từ khóa `virtual` ở lớp cha, C++ sẽ chọn theo **kiểu thật của đối tượng** lúc chạy. Cơ chế này gọi là **đa hình** (polymorphism): cùng một lời gọi `h->dienTich()` nhưng mỗi loại hình tự tính theo cách của mình. Ở lớp con nên ghi thêm `override` để trình biên dịch kiểm tra giúp rằng ta thật sự ghi đè một hàm virtual (sai tên hay sai tham số sẽ bị báo lỗi)." },
        { loai: "code", text: `#include <iostream>
#include <string>
using namespace std;

// Lop truu tuong: co it nhat mot ham thuan ao (= 0)
class Hinh {
public:
    virtual double dienTich() const = 0;         // ham thuan ao
    virtual string ten() const { return "Hinh"; } // virtual co san cai dat
    virtual ~Hinh() {}                            // destructor ao
};

class HinhTron : public Hinh {
private:
    double r;
public:
    HinhTron(double banKinh) : r(banKinh) {}
    double dienTich() const override { return 3.14 * r * r; }
    string ten() const override { return "Hinh tron"; }
};

class HinhVuong : public Hinh {
private:
    double a;
public:
    HinhVuong(double canh) : a(canh) {}
    double dienTich() const override { return a * a; }
    string ten() const override { return "Hinh vuong"; }
};

int main() {
    // Hinh h;   // LOI: khong tao duoc doi tuong cua lop truu tuong
    Hinh* ds[3] = { new HinhTron(1), new HinhVuong(2), new HinhTron(2) };
    for (int i = 0; i < 3; i++) {
        cout << ds[i]->ten() << ": " << ds[i]->dienTich() << endl;
    }
    // Hinh tron: 3.14
    // Hinh vuong: 4
    // Hinh tron: 12.56
    for (int i = 0; i < 3; i++) {
        delete ds[i];    // nho destructor ao nen huy dung lop con
    }
    return 0;
}` },
        { loai: "p", text: "Hàm `virtual double dienTich() const = 0;` là **hàm thuần ảo** (pure virtual): lớp cha chỉ tuyên bố \"mọi hình đều có diện tích\" mà không cài đặt, vì \"một hình chung chung\" không có công thức nào. Lớp có ít nhất một hàm thuần ảo là **lớp trừu tượng**: không thể tạo đối tượng trực tiếp từ nó, chỉ dùng làm lớp cha và làm kiểu cho con trỏ/tham chiếu. Lớp con bắt buộc cài đặt mọi hàm thuần ảo, nếu không chính nó cũng trở thành lớp trừu tượng." },
        { loai: "list", items: [
          "Đa hình chỉ hoạt động qua **con trỏ** hoặc **tham chiếu**. Gán đối tượng con vào biến kiểu cha theo giá trị (`Hinh h = tron;`) sẽ cắt mất phần con.",
          "Lớp có hàm virtual thì nên có **destructor virtual**. Nếu không, `delete` qua con trỏ lớp cha chỉ gọi destructor của cha, phần của con không được dọn dẹp.",
          "Một lớp trừu tượng giống như một **bản hợp đồng**: mã sử dụng chỉ cần biết hợp đồng, có thể thêm loại hình mới mà không phải sửa vòng lặp xử lý."
        ] },
        { loai: "note", text: "Khi đã có lớp con, đừng quên `virtual` ở lớp cha. Thiếu nó chương trình vẫn biên dịch bình thường nhưng luôn gọi phiên bản của lớp cha, đây là lỗi logic khó phát hiện." }
      ]
    }
  ],
  baiTap: [
    {
      id: "c5-bt1",
      muc: 1,
      tieuDe: "Lớp hình chữ nhật",
      deBai: "Viết lớp `HinhChuNhat` có hai thuộc tính `private` là chiều rộng và chiều dài (số nguyên), một constructor có tham số và hai phương thức `dienTich()`, `chuVi()`. Chương trình đọc chiều rộng và chiều dài trên một dòng, tạo đối tượng rồi in hai dòng: `Dien tich: ...` và `Chu vi: ...`.",
      viDu: { input: "4 5", output: "Dien tich: 20\nChu vi: 18" },
      loiGiai: `#include <iostream>
using namespace std;

class HinhChuNhat {
private:
    long long rong, dai;
public:
    HinhChuNhat(long long r, long long d) : rong(r), dai(d) {}
    long long dienTich() const { return rong * dai; }
    long long chuVi() const { return 2 * (rong + dai); }
};

int main() {
    long long r, d;
    cin >> r >> d;
    HinhChuNhat h(r, d);
    cout << "Dien tich: " << h.dienTich() << endl;
    cout << "Chu vi: " << h.chuVi() << endl;
    return 0;
}`,
      giaiThich: "Dữ liệu được đặt `private` và khởi tạo bằng danh sách khởi tạo; bên ngoài chỉ dùng các phương thức `const` để tính diện tích và chu vi."
    },
    {
      id: "c5-bt2",
      muc: 1,
      tieuDe: "Tài khoản ngân hàng",
      deBai: "Viết lớp `TaiKhoan` lưu số dư (`private`), có các phương thức nạp tiền, rút tiền (trả về `false` nếu không đủ tiền và khi đó số dư giữ nguyên) và lấy số dư. Dòng đầu là số dư ban đầu, dòng thứ hai là số giao dịch `q`, mỗi dòng tiếp theo có dạng `N x` (nạp x) hoặc `R x` (rút x). Sau mỗi giao dịch thành công in `So du: X`; nếu rút không đủ tiền in `Khong du so du`.",
      viDu: { input: "1000\n4\nN 500\nR 300\nR 2000\nN 100", output: "So du: 1500\nSo du: 1200\nKhong du so du\nSo du: 1300" },
      loiGiai: `#include <iostream>
using namespace std;

class TaiKhoan {
private:
    long long soDu;
public:
    TaiKhoan(long long banDau) : soDu(banDau) {}

    void napTien(long long x) {
        soDu += x;
    }
    bool rutTien(long long x) {
        if (x > soDu) return false;   // khong du tien, giu nguyen so du
        soDu -= x;
        return true;
    }
    long long getSoDu() const {
        return soDu;
    }
};

int main() {
    long long banDau;
    int q;
    cin >> banDau >> q;
    TaiKhoan tk(banDau);
    for (int i = 0; i < q; i++) {
        char lenh;
        long long x;
        cin >> lenh >> x;
        if (lenh == 'N') {
            tk.napTien(x);
            cout << "So du: " << tk.getSoDu() << endl;
        } else if (tk.rutTien(x)) {
            cout << "So du: " << tk.getSoDu() << endl;
        } else {
            cout << "Khong du so du" << endl;
        }
    }
    return 0;
}`,
      giaiThich: "Số dư chỉ thay đổi qua `napTien` và `rutTien`, nên không thể bị gán thành số âm từ bên ngoài. `rutTien` trả về `bool` để nơi gọi biết giao dịch có thành công hay không."
    },
    {
      id: "c5-bt3",
      muc: 2,
      tieuDe: "Phân số với toán tử + và ==",
      deBai: "Viết lớp `PhanSo` luôn ở dạng tối giản (rút gọn ngay trong constructor), có nạp chồng toán tử `+`, `==` và `<<`. Khi in, nếu mẫu bằng 1 thì chỉ in tử số, ngược lại in `tu/mau`. Đầu vào là bốn số nguyên dương `a b c d` biểu diễn hai phân số a/b và c/d. In dòng thứ nhất là tổng hai phân số; dòng thứ hai là `Bang nhau` nếu hai phân số bằng nhau, ngược lại `Khac nhau`.",
      viDu: { input: "1 6 2 4", output: "2/3\nKhac nhau" },
      loiGiai: `#include <iostream>
using namespace std;

long long ucln(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

class PhanSo {
private:
    long long tu, mau;
public:
    PhanSo(long long t = 0, long long m = 1) : tu(t), mau(m) {
        long long g = ucln(tu, mau);
        if (g != 0) {
            tu /= g;
            mau /= g;
        }
    }

    PhanSo operator+(const PhanSo& b) const {
        return PhanSo(tu * b.mau + b.tu * mau, mau * b.mau);   // constructor tu rut gon
    }

    bool operator==(const PhanSo& b) const {
        return tu == b.tu && mau == b.mau;   // ca hai deu da toi gian
    }

    friend ostream& operator<<(ostream& os, const PhanSo& p) {
        if (p.mau == 1) os << p.tu;
        else os << p.tu << "/" << p.mau;
        return os;
    }
};

int main() {
    long long a, b, c, d;
    cin >> a >> b >> c >> d;
    PhanSo x(a, b), y(c, d);
    cout << x + y << endl;
    if (x == y) cout << "Bang nhau" << endl;
    else cout << "Khac nhau" << endl;
    return 0;
}`,
      giaiThich: "Vì constructor luôn rút gọn, mọi phân số đều ở dạng tối giản nên `==` chỉ cần so sánh tử và mẫu. Phép cộng tạo phân số mới bằng công thức quy đồng, việc rút gọn để constructor lo."
    },
    {
      id: "c5-bt4",
      muc: 2,
      tieuDe: "Đơn hàng và thống kê static",
      deBai: "Viết lớp `DonHang` có thuộc tính tên hàng và thành tiền, cùng hai thuộc tính `static`: số đơn đã tạo và tổng doanh thu. Mỗi khi một đơn được tạo, constructor cấp mã đơn tăng dần từ 1 và cập nhật hai thuộc tính static. Dòng đầu là `n`, mỗi dòng tiếp theo gồm tên hàng (một từ), số lượng và đơn giá. Với mỗi đơn in `Don MA: TEN THANHTIEN`; cuối cùng in `So don: ...` và `Tong doanh thu: ...` lấy từ các phương thức static.",
      viDu: { input: "3\nBut 10 3000\nVo 5 12000\nThuoc 2 15000", output: "Don 1: But 30000\nDon 2: Vo 60000\nDon 3: Thuoc 30000\nSo don: 3\nTong doanh thu: 120000" },
      loiGiai: `#include <iostream>
#include <string>
using namespace std;

class DonHang {
private:
    static int soDon;               // dung chung cho moi don
    static long long tongDoanhThu;
    int maDon;
    string tenHang;
    long long thanhTien;
public:
    DonHang(const string& ten, long long soLuong, long long donGia)
        : maDon(0), tenHang(ten), thanhTien(soLuong * donGia) {
        soDon++;
        maDon = soDon;
        tongDoanhThu += thanhTien;
    }
    void in() const {
        cout << "Don " << maDon << ": " << tenHang << " " << thanhTien << endl;
    }
    static int getSoDon() { return soDon; }
    static long long getTongDoanhThu() { return tongDoanhThu; }
};

int DonHang::soDon = 0;
long long DonHang::tongDoanhThu = 0;

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string ten;
        long long soLuong, donGia;
        cin >> ten >> soLuong >> donGia;
        DonHang d(ten, soLuong, donGia);
        d.in();
    }
    cout << "So don: " << DonHang::getSoDon() << endl;
    cout << "Tong doanh thu: " << DonHang::getTongDoanhThu() << endl;
    return 0;
}`,
      giaiThich: "Mỗi đối tượng `d` chỉ sống trong một vòng lặp, nhưng `soDon` và `tongDoanhThu` là `static` nên thuộc về lớp và được giữ lại qua mọi lần tạo đối tượng. Cuối chương trình gọi phương thức static qua tên lớp."
    },
    {
      id: "c5-bt5",
      muc: 3,
      tieuDe: "Cộng thời gian",
      deBai: "Viết lớp `ThoiGian` biểu diễn một thời điểm trong ngày (giờ, phút, giây), có nạp chồng `+` (cộng hai khoảng thời gian, kết quả quay vòng theo 24 giờ), `==`, `<` và `<<` (in dạng `HH:MM:SS`, mỗi phần đủ 2 chữ số). Đầu vào gồm hai dòng, mỗi dòng ba số nguyên `h m s` (0 ≤ h < 24, 0 ≤ m, s < 60). In dòng thứ nhất là tổng; dòng thứ hai là `Bang nhau` nếu hai thời điểm bằng nhau, ngược lại `Som hon: X` với X là thời điểm sớm hơn.",
      viDu: { input: "1 45 30\n0 20 45", output: "02:06:15\nSom hon: 00:20:45" },
      loiGiai: `#include <iostream>
#include <iomanip>
using namespace std;

class ThoiGian {
private:
    int tongGiay;   // luon nam trong [0, 86400)
public:
    ThoiGian(int h = 0, int m = 0, int s = 0) {
        tongGiay = ((h * 3600 + m * 60 + s) % 86400 + 86400) % 86400;
    }

    ThoiGian operator+(const ThoiGian& b) const {
        return ThoiGian(0, 0, tongGiay + b.tongGiay);   // constructor tu quay vong
    }
    bool operator==(const ThoiGian& b) const {
        return tongGiay == b.tongGiay;
    }
    bool operator<(const ThoiGian& b) const {
        return tongGiay < b.tongGiay;
    }

    friend ostream& operator<<(ostream& os, const ThoiGian& t) {
        os << setfill('0')
           << setw(2) << t.tongGiay / 3600 << ":"
           << setw(2) << (t.tongGiay / 60) % 60 << ":"
           << setw(2) << t.tongGiay % 60;
        return os;
    }
};

int main() {
    int h1, m1, s1, h2, m2, s2;
    cin >> h1 >> m1 >> s1 >> h2 >> m2 >> s2;
    ThoiGian a(h1, m1, s1), b(h2, m2, s2);

    cout << a + b << endl;
    if (a == b) {
        cout << "Bang nhau" << endl;
    } else if (a < b) {
        cout << "Som hon: " << a << endl;
    } else {
        cout << "Som hon: " << b << endl;
    }
    return 0;
}`,
      giaiThich: "Thay vì lưu riêng giờ, phút, giây rồi xử lý nhớ, lớp chỉ lưu tổng số giây nên phép cộng và so sánh trở nên đơn giản; việc quy đổi về `HH:MM:SS` chỉ làm khi in. `setfill('0')` và `setw(2)` đảm bảo mỗi phần có đủ 2 chữ số."
    },
    {
      id: "c5-bt6",
      muc: 3,
      tieuDe: "Diện tích các hình (đa hình)",
      deBai: "Xây dựng lớp trừu tượng `Hinh` với hai hàm thuần ảo `dienTich()` và `ten()`, các lớp con `HinhTron`, `HinhChuNhat` và `HinhVuong` (kế thừa từ `HinhChuNhat`). Dòng đầu là `n`, mỗi dòng tiếp theo là một hình: `C r` (hình tròn bán kính r), `R a b` (hình chữ nhật a x b) hoặc `S a` (hình vuông cạnh a). Lưu các hình vào mảng con trỏ `Hinh*`, sau đó in mỗi hình một dòng `TEN: DIENTICH` và cuối cùng `Tong dien tich: X`. Số thực in 2 chữ số sau dấu chấm, lấy pi = acos(-1).",
      viDu: { input: "3\nC 1.5\nR 2 3.5\nS 4", output: "Hinh tron: 7.07\nHinh chu nhat: 7.00\nHinh vuong: 16.00\nTong dien tich: 30.07" },
      loiGiai: `#include <iostream>
#include <iomanip>
#include <string>
#include <cmath>
using namespace std;

class Hinh {
public:
    virtual double dienTich() const = 0;
    virtual string ten() const = 0;
    virtual ~Hinh() {}
};

class HinhTron : public Hinh {
private:
    double r;
public:
    HinhTron(double banKinh) : r(banKinh) {}
    double dienTich() const override { return acos(-1.0) * r * r; }
    string ten() const override { return "Hinh tron"; }
};

class HinhChuNhat : public Hinh {
protected:
    double rong, dai;
public:
    HinhChuNhat(double a, double b) : rong(a), dai(b) {}
    double dienTich() const override { return rong * dai; }
    string ten() const override { return "Hinh chu nhat"; }
};

class HinhVuong : public HinhChuNhat {
public:
    HinhVuong(double canh) : HinhChuNhat(canh, canh) {}
    string ten() const override { return "Hinh vuong"; }   // dung lai dienTich cua cha
};

int main() {
    int n;
    cin >> n;
    Hinh** ds = new Hinh*[n];
    for (int i = 0; i < n; i++) {
        char loai;
        cin >> loai;
        if (loai == 'C') {
            double r;
            cin >> r;
            ds[i] = new HinhTron(r);
        } else if (loai == 'R') {
            double a, b;
            cin >> a >> b;
            ds[i] = new HinhChuNhat(a, b);
        } else {
            double a;
            cin >> a;
            ds[i] = new HinhVuong(a);
        }
    }

    cout << fixed << setprecision(2);
    double tong = 0;
    for (int i = 0; i < n; i++) {
        double s = ds[i]->dienTich();   // goi dung ham cua lop con
        cout << ds[i]->ten() << ": " << s << endl;
        tong += s;
    }
    cout << "Tong dien tich: " << tong << endl;

    for (int i = 0; i < n; i++) {
        delete ds[i];
    }
    delete[] ds;
    return 0;
}`,
      giaiThich: "Vòng lặp in chỉ làm việc với `Hinh*` mà không cần biết hình cụ thể là gì; hàm virtual tự chọn đúng cài đặt của từng lớp con. `HinhVuong` kế thừa `HinhChuNhat` nên dùng lại công thức diện tích và chỉ ghi đè `ten()`. Destructor ảo giúp `delete ds[i]` hủy đúng đối tượng."
    },
    {
      id: "c5-bt7",
      muc: 4,
      tieuDe: "Bảng lương nhân viên",
      deBai: "Xây dựng lớp trừu tượng `NhanVien` (tên, hàm thuần ảo `tinhLuong()` và `loai()`) cùng hai lớp con: `ToanThoiGian` (lương = lương cơ bản + thưởng) và `BanThoiGian` (lương = số giờ x tiền mỗi giờ). Dòng đầu là `n`; mỗi dòng tiếp theo là `F ten luongCoBan thuong` hoặc `P ten soGio tienMoiGio` (tên một từ, các số nguyên). Lưu vào mảng `NhanVien*`, sắp xếp theo lương **giảm dần** (bằng nhau giữ thứ tự nhập), rồi in mỗi người một dòng `TEN (LOAI): LUONG` với LOAI là `Toan thoi gian` hoặc `Ban thoi gian`, cuối cùng in `Tong quy luong: X`.",
      viDu: { input: "4\nF An 8000000 1500000\nP Binh 120 50000\nF Chi 9000000 0\nP Dung 80 60000", output: "An (Toan thoi gian): 9500000\nChi (Toan thoi gian): 9000000\nBinh (Ban thoi gian): 6000000\nDung (Ban thoi gian): 4800000\nTong quy luong: 29300000" },
      loiGiai: `#include <iostream>
#include <string>
using namespace std;

class NhanVien {
protected:
    string ten;
public:
    NhanVien(const string& t) : ten(t) {}
    virtual ~NhanVien() {}
    string getTen() const { return ten; }
    virtual long long tinhLuong() const = 0;
    virtual string loai() const = 0;
};

class ToanThoiGian : public NhanVien {
private:
    long long luongCoBan, thuong;
public:
    ToanThoiGian(const string& t, long long coBan, long long th)
        : NhanVien(t), luongCoBan(coBan), thuong(th) {}
    long long tinhLuong() const override { return luongCoBan + thuong; }
    string loai() const override { return "Toan thoi gian"; }
};

class BanThoiGian : public NhanVien {
private:
    long long soGio, tienMoiGio;
public:
    BanThoiGian(const string& t, long long gio, long long tien)
        : NhanVien(t), soGio(gio), tienMoiGio(tien) {}
    long long tinhLuong() const override { return soGio * tienMoiGio; }
    string loai() const override { return "Ban thoi gian"; }
};

int main() {
    int n;
    cin >> n;
    NhanVien** ds = new NhanVien*[n];
    for (int i = 0; i < n; i++) {
        char kieu;
        string ten;
        long long x, y;
        cin >> kieu >> ten >> x >> y;
        if (kieu == 'F') ds[i] = new ToanThoiGian(ten, x, y);
        else ds[i] = new BanThoiGian(ten, x, y);
    }

    // Sap xep chen theo luong giam dan; chi doi cho khi nho hon han nen on dinh
    for (int i = 1; i < n; i++) {
        NhanVien* hienTai = ds[i];
        int j = i;
        while (j > 0 && ds[j - 1]->tinhLuong() < hienTai->tinhLuong()) {
            ds[j] = ds[j - 1];
            j--;
        }
        ds[j] = hienTai;
    }

    long long tong = 0;
    for (int i = 0; i < n; i++) {
        long long luong = ds[i]->tinhLuong();
        cout << ds[i]->getTen() << " (" << ds[i]->loai() << "): " << luong << endl;
        tong += luong;
    }
    cout << "Tong quy luong: " << tong << endl;

    for (int i = 0; i < n; i++) {
        delete ds[i];
    }
    delete[] ds;
    return 0;
}`,
      giaiThich: "Mọi nhân viên được xử lý chung qua con trỏ `NhanVien*`; cách tính lương khác nhau được ẩn sau hàm virtual `tinhLuong()`. Sắp xếp chèn chỉ di chuyển con trỏ (rẻ hơn sao chép đối tượng) và giữ thứ tự nhập khi lương bằng nhau."
    },
    {
      id: "c5-bt8",
      muc: 4,
      tieuDe: "Lớp số nguyên lớn",
      deBai: "Viết lớp `SoLon` lưu một số nguyên không âm rất lớn (tối đa 1000 chữ số) dưới dạng chuỗi chữ số, bỏ các chữ số 0 thừa ở đầu ngay trong constructor. Nạp chồng các toán tử `+`, `<`, `==` và `<<`. Đầu vào gồm hai dòng, mỗi dòng một số A và B. In dòng thứ nhất là A + B; dòng thứ hai là `A < B`, `A > B` hoặc `A = B` tùy kết quả so sánh.",
      viDu: { input: "123456789012345678901234567890\n987654321098765432109876543210", output: "1111111110111111111011111111100\nA < B" },
      loiGiai: `#include <iostream>
#include <string>
using namespace std;

class SoLon {
private:
    string chuSo;   // khong co so 0 thua o dau (tru khi la so 0)
public:
    SoLon(const string& s = "0") {
        size_t i = 0;
        while (i + 1 < s.size() && s[i] == '0') i++;
        chuSo = s.substr(i);
    }

    SoLon operator+(const SoLon& b) const {
        string nguoc;   // ket qua viet nguoc, hang don vi truoc
        int i = (int)chuSo.size() - 1;
        int j = (int)b.chuSo.size() - 1;
        int nho = 0;
        while (i >= 0 || j >= 0 || nho > 0) {
            int tong = nho;
            if (i >= 0) { tong += chuSo[i] - '0'; i--; }
            if (j >= 0) { tong += b.chuSo[j] - '0'; j--; }
            nguoc.push_back(char('0' + tong % 10));
            nho = tong / 10;
        }
        string kq(nguoc.rbegin(), nguoc.rend());   // dao lai
        return SoLon(kq);
    }

    bool operator<(const SoLon& b) const {
        if (chuSo.size() != b.chuSo.size()) {
            return chuSo.size() < b.chuSo.size();   // it chu so hon thi nho hon
        }
        return chuSo < b.chuSo;                     // cung do dai: so sanh tu dien
    }

    bool operator==(const SoLon& b) const {
        return chuSo == b.chuSo;
    }

    friend ostream& operator<<(ostream& os, const SoLon& x) {
        os << x.chuSo;
        return os;
    }
};

int main() {
    string sa, sb;
    cin >> sa >> sb;
    SoLon a(sa), b(sb);
    cout << a + b << endl;
    if (a == b) cout << "A = B" << endl;
    else if (a < b) cout << "A < B" << endl;
    else cout << "A > B" << endl;
    return 0;
}`,
      giaiThich: "Phép cộng mô phỏng cách cộng tay: đi từ hàng đơn vị, cộng từng cặp chữ số kèm phần nhớ. Vì không có số 0 thừa ở đầu, số nào nhiều chữ số hơn thì lớn hơn; cùng độ dài thì so sánh chuỗi theo thứ tự từ điển cũng chính là so sánh giá trị."
    }
  ]
};
