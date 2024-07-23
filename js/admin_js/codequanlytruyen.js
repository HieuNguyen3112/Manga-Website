class HangTruyen {
    constructor(HinhAnh, TenTruyen, DanhMuc, SoChuong, Tacgia) {
        this.HinhAnh = HinhAnh;
        this.TenTruyen = TenTruyen;
        this.DanhMuc = DanhMuc;
        this.SoChuong = SoChuong;
        this.Tacgia = Tacgia;
    }

    taoNut(iconClass, tieuDe) {
        const nut = document.createElement('button');
        nut.className = `${iconClass}-btn`;
        nut.title = tieuDe;
        const icon = document.createElement('i');
        icon.className = `fas fa-${iconClass}`;
        nut.appendChild(icon);
        return nut;
    }

    taoHang() {
        const Hang = document.createElement('tr');

        // Ô hình ảnh
        const cellHinhAnh = document.createElement('td');
        const Img = document.createElement('img');
        Img.src = this.HinhAnh;
        cellHinhAnh.appendChild(Img);
        Hang.appendChild(cellHinhAnh);

        // Ô tên truyện
        const cellTenTruyen = document.createElement('td');
        cellTenTruyen.textContent = this.TenTruyen;
        Hang.appendChild(cellTenTruyen);

        // Ô danh mục
        const cellDanhMuc = document.createElement('td');
        cellDanhMuc.textContent = this.DanhMuc;
        Hang.appendChild(cellDanhMuc);

        // Ô số chương
        const cellSoChuong = document.createElement('td');
        cellSoChuong.textContent = this.SoChuong;
        Hang.appendChild(cellSoChuong);

        // Ô tác giả
        const cellTacgia = document.createElement('td');
        cellTacgia.textContent = this.Tacgia;
        Hang.appendChild(cellTacgia);

        // Ô hành động
        const cellHanhDong = document.createElement('td');
        const editButton = this.taoNut('edit', 'Chỉnh sửa');
        editButton.addEventListener('click', () => this.moChinhSua());
        cellHanhDong.appendChild(editButton);
        cellHanhDong.appendChild(this.taoNut('trash-alt', 'Xóa'));
        cellHanhDong.appendChild(this.taoNut('eye', 'Xem'));
        Hang.appendChild(cellHanhDong);

        return Hang;
    }

    moChinhSua() {
        const modal = document.getElementById('editModal');
        const form = document.getElementById('editForm');
        form.editHinhAnh.value = this.HinhAnh;
        form.editTenTruyen.value = this.TenTruyen;
        form.editDanhMuc.value = this.DanhMuc;
        form.editSoChuong.value = this.SoChuong;
        form.editTacgia.value = this.Tacgia;
        modal.style.display = 'block';

        document.getElementById('saveEdit').onclick = () => {
            this.HinhAnh = form.editHinhAnh.value;
            this.TenTruyen = form.editTenTruyen.value;
            this.DanhMuc = form.editDanhMuc.value;
            this.SoChuong = form.editSoChuong.value;
            this.Tacgia = form.editTacgia.value;

            hienThiBang(trangHienTai);
            modal.style.display = 'none';
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('editModal');
    const span = document.getElementsByClassName('close')[0];

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});

const soTruyenMoiTrang = 9; 
let trangHienTai = 1; 
let danhSachTruyen = []; 

function scrollToTop() {
    document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
}

function hienThiBang(trang, danhSachTruyenHienTai = danhSachTruyen) {
    const chiSoBatDau = (trang - 1) * soTruyenMoiTrang;
    const chiSoKetThuc = chiSoBatDau + soTruyenMoiTrang;
    const truyenHienThi = danhSachTruyenHienTai.slice(chiSoBatDau, chiSoKetThuc);

    const bangTruyen = document.getElementById('comicTableBody');
    bangTruyen.innerHTML = '';

    truyenHienThi.forEach(truyen => {
        bangTruyen.appendChild(truyen.taoHang());
    });

    capNhatPhanTrang();
    scrollToTop();
}

function capNhatPhanTrang() {
    const tongSoTrang = Math.ceil(danhSachTruyen.length / soTruyenMoiTrang);
    const pageInfo = document.getElementById('pageInfo');
    pageInfo.innerHTML = '';

    const soTrangHienThiToiDa = 10;

    let trangBatDau = Math.max(1, trangHienTai - Math.floor(soTrangHienThiToiDa / 2));
    let trangKetThuc = trangBatDau + soTrangHienThiToiDa - 1;

    if (trangKetThuc > tongSoTrang) {
        trangKetThuc = tongSoTrang;
        trangBatDau = Math.max(1, trangKetThuc - soTrangHienThiToiDa + 1);
    }

    for (let i = trangBatDau; i <= trangKetThuc; i++) {
        const trang = document.createElement('button');
        trang.textContent = i;
        trang.className = (i === trangHienTai) ? 'current-page' : '';
        trang.addEventListener('click', () => {
            trangHienTai = i;
            hienThiBang(trangHienTai);
        });
        pageInfo.appendChild(trang);
    }

    if (trangKetThuc < tongSoTrang) {
        const dot = document.createElement('span');
        dot.textContent = '...';
        pageInfo.appendChild(dot);

        const trangCuoi = document.createElement('button');
        trangCuoi.textContent = tongSoTrang;
        trangCuoi.addEventListener('click', () => {
            trangHienTai = tongSoTrang;
            hienThiBang(trangHienTai);
        });
        pageInfo.appendChild(trangCuoi);
    }
}

function thayDoiTrang(huong) {
    const trangMoi = trangHienTai + huong;
    if (trangMoi >= 1 && trangMoi <= Math.ceil(danhSachTruyen.length / soTruyenMoiTrang)) {
        trangHienTai = trangMoi;
        hienThiBang(trangMoi);
    }
}

function searchComics() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredTruyen = danhSachTruyen.filter(truyen => {
        return truyen.TenTruyen.toLowerCase().includes(searchTerm) ||
               truyen.SoChuong.toString().includes(searchTerm) ||
               truyen.DanhMuc.toLowerCase().includes(searchTerm)||
               truyen.TacGia.toLowerCase().includes(searchTerm);})
    hienThiBang(trangHienTai, filteredTruyen);
}

document.getElementById('searchButton').addEventListener('click', searchComics);
document.getElementById('searchInput').addEventListener('input', searchComics);

document.addEventListener('DOMContentLoaded', () => {
    danhSachTruyen = [
        new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
        new HangTruyen('../image/Harry_Potter_và_Hòn_đá_phù_thủy_bìa_2003.jpeg', 'Harry Potter và Hòn đá Phù thủy', 'Dremy', 1, "J. K. Rowling"),
        new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
        new HangTruyen('../image/Harry_Potter_và_Hòn_đá_phù_thủy_bìa_2003.jpeg', 'Harry Potter và Hòn đá Phù thủy', 'Dremy', 1, "J. K. Rowling"), new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
        new HangTruyen('../image/Harry_Potter_và_Hòn_đá_phù_thủy_bìa_2003.jpeg', 'Harry Potter và Hòn đá Phù thủy', 'Dremy', 1, "J. K. Rowling"), new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
        new HangTruyen('../image/Harry_Potter_và_Hòn_đá_phù_thủy_bìa_2003.jpeg', 'Harry Potter và Hòn đá Phù thủy', 'Dremy', 1, "J. K. Rowling"), new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
        new HangTruyen('../image/Harry_Potter_và_Hòn_đá_phù_thủy_bìa_2003.jpeg', 'Harry Potter và Hòn đá Phù thủy', 'Dremy', 1, "J. K. Rowling"), new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
        new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
        new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
        new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
        new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
        new HangTruyen('../image/thanhguom.png', 'Thanh gươm diệt quỷ', 'Action', 45, "Gotōge Koyoharu"),
       
    ];

    hienThiBang(trangHienTai);

    document.getElementById('prevPage').addEventListener('click', () => thayDoiTrang(-1));
    document.getElementById('nextPage').addEventListener('click', () => thayDoiTrang(1));
});
