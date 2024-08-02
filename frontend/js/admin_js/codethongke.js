class TruyenThongKe {
    constructor(tenTruyen, luotXem, yeuThich, danhGia, noiDung) {
        this.tenTruyen = tenTruyen;
        this.luotXem = luotXem;
        this.yeuThich = yeuThich;
        this.danhGia = danhGia;
        this.noiDung = noiDung;
    }

    taoHang() {
        const hang = document.createElement('tr');

        // Ô tên truyện
        const cellTenTruyen = document.createElement('td');
        cellTenTruyen.textContent = this.tenTruyen;
        hang.appendChild(cellTenTruyen);

        // Ô lượt xem
        const cellLuotXem = document.createElement('td');
        cellLuotXem.textContent = this.luotXem;
        hang.appendChild(cellLuotXem);

        // Ô yêu thích
        const cellYeuThich = document.createElement('td');
        cellYeuThich.textContent = this.yeuThich;
        hang.appendChild(cellYeuThich);

        // Ô đánh giá
        const cellDanhGia = document.createElement('td');
        cellDanhGia.textContent = this.danhGia;
        hang.appendChild(cellDanhGia);

        // Ô nội dung
        const cellNoiDung = document.createElement('td');
        cellNoiDung.textContent = this.noiDung;
        hang.appendChild(cellNoiDung);

        return hang;
    }
}

let danhSachThongKe = []; // Danh sách thống kê

// Hàm hiển thị bảng thống kê
function hienThiThongKe() {
    const bangThongKe = document.getElementById('statsTableBody');
    bangThongKe.innerHTML = '';

    danhSachThongKe.forEach(truyen => {
        bangThongKe.appendChild(truyen.taoHang());
    });
}

// Khi tài liệu đã được tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Giả sử bạn đã có dữ liệu từ API hoặc nguồn nào đó
    danhSachThongKe = [
        new TruyenThongKe('Thanh gươm diệt quỷ', 120, 45, '4.5/5', 'Đang cập nhật'),
        new TruyenThongKe('Nhật ký một thây ma', 90, 30, '4.0/5', 'Đã hoàn thành'),
        // Thêm các truyện khác tại đây
    ];

    hienThiThongKe();
});
