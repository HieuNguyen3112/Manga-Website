class HangTruyen {
    constructor(_id, image, title, category, chapters, author) {
        this._id = _id;
        this.image = image;
        this.title = title;
        this.category = category;
        this.chapters = chapters;
        this.author = author;
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
        Img.src = this.image;
        Img.style.width = "50px";  // Set image size
        cellHinhAnh.appendChild(Img);
        Hang.appendChild(cellHinhAnh);

        // Ô tên truyện
        const cellTenTruyen = document.createElement('td');
        cellTenTruyen.textContent = this.title;
        Hang.appendChild(cellTenTruyen);

        // Ô danh mục
        const cellDanhMuc = document.createElement('td');
        cellDanhMuc.textContent = this.category;
        Hang.appendChild(cellDanhMuc);

        // Ô số chương
        const cellSoChuong = document.createElement('td');
        cellSoChuong.textContent = this.chapters;
        Hang.appendChild(cellSoChuong);

        // Ô tác giả
        const cellTacgia = document.createElement('td');
        cellTacgia.textContent = this.author;
        Hang.appendChild(cellTacgia);

        // Ô hành động
        const cellHanhDong = document.createElement('td');
        const editButton = this.taoNut('edit', 'Chỉnh sửa');
        editButton.addEventListener('click', () => this.moChinhSua());
        cellHanhDong.appendChild(editButton);

        const deleteButton = this.taoNut('trash-alt', 'Xóa');
        deleteButton.addEventListener('click', () => this.moXoa());
        cellHanhDong.appendChild(deleteButton);

        cellHanhDong.appendChild(this.taoNut('eye', 'Xem'));
        Hang.appendChild(cellHanhDong);

        return Hang;
    }

    moChinhSua() {
        const modal = document.getElementById('editModal');
        const form = document.getElementById('editForm');
        form.editHinhAnh.value = this.image;
        form.editTenTruyen.value = this.title;
        form.editDanhMuc.value = this.category;
        form.editSoChuong.value = this.chapters;
        form.editTacgia.value = this.author;
        modal.style.display = 'block';

        // Remove existing onclick event to avoid multiple bindings
        document.getElementById('saveEdit').onclick = null;

        // Add new onclick event
        document.getElementById('saveEdit').onclick = async () => {
            this.image = form.editHinhAnh.value;
            this.title = form.editTenTruyen.value;
            this.category = form.editDanhMuc.value;
            this.chapters = form.editSoChuong.value;
            this.author = form.editTacgia.value;

            try {
                const response = await fetch(`http://localhost:3000/api/comics/${this._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image: this.image,
                        title: this.title,
                        category: this.category,
                        chapters: this.chapters,
                        author: this.author
                    })
                });

                if (response.ok) {
                    const updatedComic = await response.json();
                    // Update the list with the updated comic
                    danhSachTruyen = danhSachTruyen.map(truyen => truyen._id === updatedComic._id ? new HangTruyen(updatedComic._id, updatedComic.image, updatedComic.title, updatedComic.category, updatedComic.chapters, updatedComic.author) : truyen);
                    hienThiBang(trangHienTai);
                    modal.style.display = 'none';
                } else {
                    console.error("Lỗi cập nhật:", await response.text());
                }
            } catch (err) {
                console.error("Lỗi cập nhật:", err);
            }
        };
    }

    moXoa() {
        const deleteModal = document.getElementById('deleteModal');
        deleteModal.style.display = 'block';

        document.getElementById('confirmDelete').onclick = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/comics/${this._id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    danhSachTruyen = danhSachTruyen.filter(truyen => truyen._id !== this._id);
                    hienThiBang(trangHienTai);
                    deleteModal.style.display = 'none';
                } else {
                    console.error("Lỗi xóa:", await response.text());
                }
            } catch (err) {
                console.error("Lỗi xóa:", err);
            }
        };

        document.getElementById('cancelDelete').onclick = () => {
            deleteModal.style.display = 'none';
        };

        document.getElementById('closeDeleteModal').onclick = () => {
            deleteModal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target == deleteModal) {
                deleteModal.style.display = 'none';
            }
        };
    }
}

async function themMoiTruyen(event) {
    event.preventDefault();

    const form = document.getElementById('addForm');
    const newComic = {
        image: form.addHinhAnh.files[0] ? URL.createObjectURL(form.addHinhAnh.files[0]) : '', // Handle file input
        title: form.addTenTruyen.value,
        category: form.addDanhMuc.value,
        chapters: form.addSoChuong.value,
        author: form.addTacgia.value,
        moTaNgan: form.addMoTaNgan.value,
        noiDungTruyen: form.addNoiDungTruyen.value
    };

    try {
        const response = await fetch('http://localhost:3000/api/comics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComic)
        });

        if (response.ok) {
            const createdComic = await response.json();
            danhSachTruyen.push(new HangTruyen(createdComic._id, createdComic.image, createdComic.title, createdComic.category, createdComic.chapters, createdComic.author));
            hienThiBang(trangHienTai);
            form.reset(); // Clear the form fields
            showSection('quanlytruyen'); // Switch to the comic list section
        } else {
            console.error("Lỗi thêm mới truyện:", await response.text());
        }
    } catch (err) {
        console.error("Lỗi thêm mới truyện:", err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    async function fetchComics() {
        try {
            const response = await fetch('http://localhost:3000/api/comics');
            const data = await response.json();
            console.log(data); // Log the data to verify it's being received
            return data.map(comic => new HangTruyen(comic._id, comic.image, comic.title, comic.category, comic.chapters, comic.author));
        } catch (error) {
            console.error('Error fetching comics:', error);
            return [];
        }
    }

    danhSachTruyen = await fetchComics();
    hienThiBang(trangHienTai);

    document.getElementById('prevPage').addEventListener('click', () => thayDoiTrang(-1));
    document.getElementById('nextPage').addEventListener('click', () => thayDoiTrang(1));
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

    capNhatPhanTrang(danhSachTruyenHienTai);
    scrollToTop();
}

function capNhatPhanTrang(danhSachTruyenHienTai = danhSachTruyen) {
    const tongSoTrang = Math.ceil(danhSachTruyenHienTai.length / soTruyenMoiTrang);
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
            hienThiBang(trangHienTai, danhSachTruyenHienTai);
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
            hienThiBang(trangHienTai, danhSachTruyenHienTai);
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

async function searchComics() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredTruyen = danhSachTruyen.filter(truyen => {
        return truyen.title.toLowerCase().includes(searchTerm) ||
               truyen.category.toLowerCase().includes(searchTerm) ||
               truyen.author.toLowerCase().includes(searchTerm);
    });
    hienThiBang(trangHienTai, filteredTruyen);
}

document.getElementById('searchButton').addEventListener('click', searchComics);
document.getElementById('searchInput').addEventListener('input', searchComics);

document.addEventListener('DOMContentLoaded', async () => {
    danhSachTruyen = await fetchComics();
    hienThiBang(trangHienTai);

    document.getElementById('prevPage').addEventListener('click', () => thayDoiTrang(-1));
    document.getElementById('nextPage').addEventListener('click', () => thayDoiTrang(1));
});
