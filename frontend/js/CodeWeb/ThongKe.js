class TruyenThongKe {
    constructor(tenTruyen, danhmuc, luotXem, yeuThich, danhGia, noiDung, ngayDang) {
        this.tenTruyen = tenTruyen;
        this.danhmuc= danhmuc;
        this.luotXem = luotXem;
        this.yeuThich = yeuThich;
        this.danhGia = danhGia;
        this.noiDung = noiDung;
        this.ngayDang = new Date(ngayDang).toLocaleDateString();
    }
    getCategoryNameById(categoryIds) {
        // Kiểm tra nếu categoryIds là mảng, nếu không thì biến nó thành mảng
        const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];

        // Lấy tên của tất cả các danh mục tương ứng với các ID
        const categoryNames = ids.map(id => {
            const category = danhSachDanhMuc.find(c => c._id === id);
            return category ? category.name : 'Danh mục không xác định';
        });

        // Nối các tên danh mục thành một chuỗi, ngăn cách bởi dấu phẩy
        return categoryNames.join(', ');
    }
    taoHang() {
        const hang = document.createElement('tr');

        // Ô tên truyện
        const cellTenTruyen = document.createElement('td');
        cellTenTruyen.textContent = this.tenTruyen;
        hang.appendChild(cellTenTruyen);

        const cellDanhMuc = document.createElement('td');
        cellDanhMuc.textContent = this.getCategoryNameById(this.danhmuc);
        hang.appendChild(cellDanhMuc);
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
    
        const cellNgayDang= document.createElement('td');
        cellNgayDang.textContent = this.ngayDang;
        hang.appendChild(cellNgayDang);

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
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/categories');
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}fetchCategories().then(categories => {
    danhSachDanhMuc = categories;
});
let currentSort = { field: '', direction: '' }; // Trạng thái sắp xếp hiện tại

// Hàm sắp xếp
function sortData(field) {
    let direction = 'asc';
    if (currentSort.field === field && currentSort.direction === 'asc') {
        direction = 'desc';
    }

    currentSort = { field, direction };

    danhSachThongKe.sort((a, b) => {
        let valueA, valueB;

        if (field === 'danhmuc') {
            valueA = a.getCategoryNameById(a.danhmuc).toLowerCase();
            valueB = b.getCategoryNameById(b.danhmuc).toLowerCase();
        } else if (field === 'views') {
            valueA = a.luotXem;
            valueB = b.luotXem;
        } else if (field === 'likes') {
            valueA = a.yeuThich;
            valueB = b.yeuThich;
        }

        if (direction === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });

    hienThiThongKe(); // Hiển thị lại bảng sau khi sắp xếp
}

// Thêm sự kiện vào các nút sắp xếp
document.getElementById('sortCategoryBtn').addEventListener('click', () => {
    sortData('danhmuc');
});

document.getElementById('sortViewsBtn').addEventListener('click', () => {
    sortData('views');
    currentSort = { field: 'views', direction: currentSort.direction };
});

document.getElementById('sortLikesBtn').addEventListener('click', () => {
    sortData('likes');
    currentSort = { field: 'likes', direction: currentSort.direction };
});

// Khi tài liệu đã được tải xong
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories().then(categories => {
        danhSachDanhMuc = categories;
    });

    fetch('http://localhost:3000/api/comics')
        .then(response => response.json())
        .then(data => {
            danhSachThongKe = data.map(comic => new TruyenThongKe(
                comic.title,
                comic.category,
                comic.views,
                comic.likes,
                `${comic.rating}/5`,
                comic.status,
                comic.creationDate
            ));

            hienThiThongKe(); // Hiển thị ban đầu
        })
        .catch(error => {
            console.error('Error fetching comic data:', error);
        });
});

// Hàm hiển thị bảng thống kê
function hienThiThongKe() {
    const bangThongKe = document.getElementById('statsTableBody');
    bangThongKe.innerHTML = '';

    danhSachThongKe.forEach(truyen => {
        bangThongKe.appendChild(truyen.taoHang());
    });
}
