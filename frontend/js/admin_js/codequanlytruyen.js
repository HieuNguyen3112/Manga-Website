
class HangTruyen {
    constructor(_id, image, title, category, chapters, author, description,views, status, rating) {
        this._id = _id;
        this.image = image;
        this.title = title;
        this.category = category;
        this.chapters = chapters;
        this.author = author;
        this.description = description;
        this.views = views;
        this.status = status;
        this.rating = rating;
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
        Img.src = this.image ;// Không cần chuyển đổi Base64 nữa
        Img.style.width = "70px"; // Set image size
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

        const viewButton = this.taoNut('eye', 'Xem');
        viewButton.addEventListener('click', () => this.moXem());
        cellHanhDong.appendChild(viewButton);

        Hang.appendChild(cellHanhDong);

        return Hang;
    }

    moChinhSua() {
        const modal = document.getElementById('editModal');
        const form = document.getElementById('editForm');
        form.editHinhAnh.value = ""; // Reset giá trị hình ảnh
        form.editTenTruyen.value = this.title;
        form.editDanhMuc.value = this.category;
        form.editTacgia.value = this.author !== "undefined" ? this.author : "";
        form.editMoTaNgan.value = this.description;
        modal.style.display = 'block';
    
        document.getElementById('saveEdit').onclick = async () => {
            const file = form.editHinhAnh.files[0];
            const formData = new FormData();
    
            if (file) {
                formData.append('image', file); // Nếu có hình ảnh mới, thêm vào formData
            }
            formData.append('title', form.editTenTruyen.value);
            formData.append('category', form.editDanhMuc.value);
            formData.append('author', form.editTacgia.value);
            formData.append('description', form.editMoTaNgan.value);
    
            try {
                const response = await fetch(`http://localhost:3000/api/comics/${this._id}`, {
                    method: 'PUT',
                    body: formData // Gửi dữ liệu dưới dạng form data
                });
    
                if (response.ok) {
                    const updatedComic = await response.json();
                    danhSachTruyen = danhSachTruyen.map(truyen =>
                        truyen._id === updatedComic._id ? new HangTruyen(
                            updatedComic._id,
                            file ? `/uploads/${updatedComic.image.filename}` : this.image, // Nếu có hình ảnh mới, cập nhật đường dẫn, nếu không giữ nguyên
                            updatedComic.title,
                            updatedComic.category,
                            this.chapters,
                            updatedComic.author,
                            updatedComic.description,
                            updatedComic.views,
                            updatedComic.status,
                            updatedComic.rating
                        ) : truyen
                    );
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

    async moXem() {
        updateChapterHeader(this.image, this.title, this.author, this.status, this.views,this.description);
        await hienThiDanhSachChuong(this._id);
        showSection('quanlychuong');
    }
}
document.getElementById('saveAddForm').addEventListener('click', async function (event) {
    event.preventDefault();

    const form = document.getElementById('addForm');
    const file = form.addHinhAnh.files[0];
    const formData = new FormData();

    if (file) {
        formData.append('image', file); // Thêm hình ảnh vào form data
    }
    formData.append('title', form.addTenTruyen.value); // Thêm tiêu đề vào form data
    formData.append('category', form.addDanhMuc.value); // Thêm danh mục vào form data
    formData.append('author', form.addTacgia.value); // Thêm tác giả vào form data
    formData.append('description', form.addMoTaNgan.value); // Thêm mô tả vào form data
    // Thêm các trường mặc định nếu cần
    formData.append('views', 0); // Lượt xem mặc định là 0
    formData.append('status', 'Ongoing'); // Trạng thái mặc định là "Ongoing"
    formData.append('rating', 5); // Đánh giá mặc định là 5

    try {
        const response = await fetch('http://localhost:3000/api/comics', {
            method: 'POST',
            body: formData // Gửi dữ liệu dưới dạng form data
        });

        if (response.ok) {
            const createdComic = await response.json();
            danhSachTruyen.push(new HangTruyen(
                createdComic._id,
                createdComic.image, // Đường dẫn ảnh từ MongoDB
                createdComic.title,
                createdComic.category,
                createdComic.chapters || 0, // Mặc định chapters là 0 khi mới tạo
                createdComic.author,
                createdComic.description,
                createdComic.views,
                createdComic.status,
                createdComic.rating
            ));
            hienThiBang(trangHienTai);
            form.reset(); // Reset form sau khi thêm mới
            
        
        } else {
            console.error("Lỗi thêm mới truyện:", await response.text());
        }
    } catch (err) {
        console.error("Lỗi thêm mới truyện:", err);
    }
});


function updateChapterHeader(image, title, author, status, views,description) {
    document.getElementById('chapterImage').src = image; // Không cần chuyển đổi Base64 nữa
    document.getElementById('chapterTitle').textContent = `Tên Truyện : ${title}`;
    document.getElementById('chapterAuthor').innerHTML = `<strong>Tác giả:</strong> ${author}`;
    document.getElementById('chapterStatus').innerHTML = `<strong>Trạng thái:</strong> ${status}`;
    document.getElementById('chapterViews').innerHTML = `<strong>Lượt xem:</strong> ${views}`;
    document.getElementById('chapterDescription').innerHTML = `<strong>Mô tả </strong> ${description}`;

}


async function hienThiDanhSachChuong(comicId) {
    const chapters = await fetchChapters(comicId);
    const tableBody = document.getElementById('chapterTableBody');
    tableBody.innerHTML = ''; // Clear existing content
    chapters.forEach(chapter => {
        tableBody.appendChild(chapter.taoHang());
    });
}

async function fetchChapters(comicId) {
    try {
        const response = await fetch(`http://localhost:3000/api/chapters?comicId=${comicId}`);
        const chapters = await response.json();
        return chapters.map(chapter => new HangChuong(chapter._id, chapter.comicId, chapter.chapterTitle, chapter.createdDate));
    } catch (error) {
        console.error('Error fetching chapters:', error);
        return [];
    }
}

async function fetchComics() {
    try {
        const response = await fetch('http://localhost:3000/api/comics');
        const comics = await response.json();
        const chapters = await fetchChapters();

        const chaptersMap = chapters.reduce((map, chapter) => {
            if (!map[chapter.comicId]) {
                map[chapter.comicId] = 0;
            }
            map[chapter.comicId]++;
            return map;
        }, {});

        const comicsWithChapters = comics.map(comic => {
            const chaptersCount = chaptersMap[comic._id] || 0;
            return new HangTruyen(comic._id, comic.image, comic.title, comic.category, chaptersCount, comic.author, comic.description, comic.views, comic.status, comic.rating);
        });

        return comicsWithChapters;
    } catch (error) {
        console.error('Error fetching comics:', error);
        return [];
    }
}



document.addEventListener('DOMContentLoaded', async () => {
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