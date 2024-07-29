
class ThanhVien {
    constructor(ten, gioiTinh, doTuoi, ngayDangKy, soLuotTruyenTruyCap, noiDungYeuThich) {
        this.ten = ten;
        this.gioiTinh = gioiTinh;
        this.doTuoi = doTuoi;
        this.ngayDangKy = ngayDangKy;
        this.soLuotTruyenTruyCap = soLuotTruyenTruyCap;
        this.noiDungYeuThich = noiDungYeuThich;
    }
}

// danh sách thành viên
const danhSachThanhVien = [
    new ThanhVien("Nguyễn Văn A", "Nam", 25, "2023-06-15", 120, "Truyện hành động"),
    new ThanhVien("Trần Thị B", "Nữ", 30, "2023-07-01", 200, "Truyện lãng mạn"),
    new ThanhVien("Lê Văn C", "Nam", 22, "2023-08-10", 150, "Truyện kinh dị"),
   
];

// thêm thành viên vào bảng
function hienThiThanhVien(thanhVien) {
    const memberTableBody = document.getElementById('memberTableBody');
    const hang = document.createElement('tr');

    // Tạo các ô cho từng cột
    Object.keys(thanhVien).forEach(key => {
        const cell = document.createElement('td');
        cell.textContent = thanhVien[key];
        hang.appendChild(cell);
    });

    memberTableBody.appendChild(hang); 
}

// Hàm để tải dữ liệu thành viên (ở đây là dữ liệu giả lập)
function taiDuLieuThanhVien() {
    danhSachThanhVien.forEach(thanhVien => {
        hienThiThanhVien(thanhVien);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Tải dữ liệu thành viên khi trang web được tải
    taiDuLieuThanhVien();
});
