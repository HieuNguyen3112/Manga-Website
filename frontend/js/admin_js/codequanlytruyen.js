let moTaNganEditor;
let ContentAdd;
let editMoTaNgan;

document.addEventListener('DOMContentLoaded', function () {
    ClassicEditor
        .create(document.querySelector('#addMoTaNgan'))
        .then(editor => {
            moTaNganEditor = editor;
        })
        .catch(error => {
            console.error(error);
        });

    ClassicEditor
        .create(document.querySelector('#chapterContent'))
        .then(editor => {
            ContentAdd = editor;
        })
        .catch(error => {
            console.error(error);
        });

    ClassicEditor
        .create(document.querySelector('#editMoTaNgan'))
        .then(editor => {
            editMoTaNgan = editor;
        })
        .catch(error => {
            console.error(error);
        });
});

class HangTruyen {
    constructor(_id, image, title, category, chapters, author, description, views, status, rating, creationDate, updateDate) {
        this._id = _id;
        this.imageUrl = image;  // Sử dụng đúng tên biến `image`
        this.title = title;
        this.category = category;
        this.chapters = chapters;
        this.author = author;
        this.description = description;
        this.views = views;
        this.status = status;
        this.rating = rating;
        this.creationDate = creationDate;
        this.updateDate = updateDate;
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
        Img.src = this.imageUrl;  // Sử dụng URL từ Cloudinary
        Img.style.width = "70px";
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

        // Cập nhật giá trị ban đầu của form
        form.editHinhAnh.value = ""; // Reset giá trị hình ảnh
        form.editTenTruyen.value = this.title;
        form.editDanhMuc.value = this.category;
        form.editTacgia.value = this.author !== "undefined" ? this.author : "";
        editMoTaNgan.setData(this.description); // Cập nhật nội dung CKEditor với mô tả hiện tại

        modal.style.display = 'block';

        document.getElementById('saveEdit').onclick = async () => {
            const file = form.editHinhAnh.files[0]; // Lấy file ảnh từ form
            const formData = new FormData();
            const updatedDescription = editMoTaNgan.getData();

            // Kiểm tra nếu có ảnh mới thì thêm vào formData, nếu không thì thêm URL ảnh cũ
            if (file) {
                formData.append('image', file); // Thêm ảnh mới vào formData
            } else {
                formData.append('imageUrl', this.imageUrl); // Giữ nguyên URL của ảnh cũ
            }

            // Thêm các trường khác vào formData
            formData.append('title', form.editTenTruyen.value);
            formData.append('category', form.editDanhMuc.value);
            formData.append('author', form.editTacgia.value);
            formData.append('description', updatedDescription);
            formData.append('updateDate', new Date().toISOString());

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
                            updatedComic.imageUrl || this.imageUrl, // Đảm bảo hình ảnh được cập nhật đúng
                            updatedComic.title,
                            updatedComic.category,
                            truyen.chapters,
                            updatedComic.author,
                            updatedComic.description,
                            truyen.views,
                            truyen.status,
                            truyen.rating,
                            truyen.creationDate,
                            updatedComic.updateDate
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
                // Gửi yêu cầu DELETE để xóa truyện và hình ảnh trên Cloudinary
                const response = await fetch(`http://localhost:3000/api/comics/${this._id}`, {
                    method: 'DELETE'
                });
    
                if (response.ok) {
                    // Cập nhật lại danh sách và giao diện sau khi xóa
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
        updateChapterHeader(this.imageUrl, this.title, this.author, this.status, this.views, this.description, this._id);
        await hienThiDanhSachChuong(this._id);
        showSection('quanlychuong');
    }
}

// Add Comic (Save Function)
document.getElementById('saveAddForm').addEventListener('click', async function (event) {
    event.preventDefault();

    const form = document.getElementById('addForm');

    if (!form) {
        console.error('Form thêm truyện không tồn tại');
        return;
    }

    const file = form.addHinhAnh.files[0];
    const formData = new FormData();

    if (file) {
        formData.append('image', file);
    } else {
        console.error('Không có hình ảnh được chọn');
        return;
    }

    // Các trường khác
    formData.append('title', form.addTenTruyen.value);
    formData.append('category', form.addDanhMuc.value);
    formData.append('author', form.addTacgia.value);
    formData.append('description', moTaNganEditor.getData());

    try {
        const response = await fetch('http://localhost:3000/api/comics', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const createdComic = await response.json();
            console.log('Tạo truyện thành công:', createdComic);

            // Cập nhật bảng truyện
            danhSachTruyen.push(new HangTruyen(
                createdComic._id,
                createdComic.imageUrl,
                createdComic.title,
                createdComic.category,
                0, // Ban đầu số chương là 0
                createdComic.author,
                createdComic.description,
                createdComic.views,
                createdComic.status,
                createdComic.rating,
                createdComic.creationDate,
                createdComic.updateDate
            ));

            // Hiển thị bảng truyện với truyện mới được thêm vào
            hienThiBang(trangHienTai);

            // Reset form
            form.reset();
            moTaNganEditor.setData('');

            // Hiển thị section quản lý truyện
            showSection('quanlytruyen');
        } else {
            const errorText = await response.text();
            console.error("Lỗi khi thêm mới truyện:", errorText);
        }
    } catch (err) {
        console.error("Lỗi khi thêm mới truyện:", err);
    }
});

function updateChapterHeader(image, title, author, status, views, description, _id) {
    document.getElementById('chapterImage').src = image;
    document.getElementById('chapterTitle').textContent = `Tên Truyện : ${title}`;
    document.getElementById('chapterAuthor').innerHTML = `<strong>Tác giả:</strong> ${author}`;
    document.getElementById('chapterStatus').innerHTML = `<strong>Trạng thái:</strong> ${status}`;
    document.getElementById('chapterViews').innerHTML = `<strong>Lượt xem:</strong> ${views}`;
    document.getElementById('chapterDescription').innerHTML = `<strong>Mô tả:</strong> ${description}`;
    document.getElementById('chapterTableBody').dataset.comicId = _id;
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
        return comics.map(comic => new HangTruyen(
            comic._id,
            comic.imageUrl,
            comic.title,
            comic.category,
            comic.chapters || 0, // Mặc định chapters là 0
            comic.author,
            comic.description,
            comic.views,
            comic.status,
            comic.rating,
            comic.creationDate,
            comic.updateDate
        ));
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

class HangChuong {
    constructor(_id, comicId, chapterTitle, createdDate) {
        this._id = _id;
        this.comicId = comicId;
        this.chapterTitle = chapterTitle;
        this.createdDate = new Date(createdDate).toLocaleDateString();
    }

    taoHang() {
        const Hang = document.createElement('tr');

        // Ô tên chương
        const cellTenChuong = document.createElement('td');
        cellTenChuong.textContent = this.chapterTitle;
        Hang.appendChild(cellTenChuong);

        // Ô ngày đăng
        const cellNgayDang = document.createElement('td');
        cellNgayDang.textContent = this.createdDate;
        Hang.appendChild(cellNgayDang);

        // Ô hành động
        const cellHanhDong = document.createElement('td');
        const editButton = this.taoNut('edit', 'Chỉnh sửa');
        const deleteButton = this.taoNut('trash-alt', 'Xóa');
        cellHanhDong.appendChild(editButton);
        cellHanhDong.appendChild(deleteButton);
        Hang.appendChild(cellHanhDong);

        return Hang;
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
}

document.getElementById('saveChapterForm').addEventListener('click', async function (event) {
    event.preventDefault();

    const form = document.getElementById('addChapterForm');
    const comicId = document.getElementById('chapterTableBody').dataset.comicId; // Lấy ID của truyện từ dataset của tableBody

    if (!comicId) {
        console.error("Comic ID is missing");
        return;
    }

    const formData = new FormData();
    formData.append('comicId', comicId);
    formData.append('chapterTitle', form.chapterTitle.value);
    const chapterContent = ContentAdd.getData(); // Lấy dữ liệu từ CKEditor
    formData.append('content', chapterContent);

    try {
        const response = await fetch('http://localhost:3000/api/chapters', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const createdChapter = await response.json();
            const newChapter = new HangChuong(
                createdChapter._id,
                createdChapter.comicId,
                createdChapter.chapterTitle,
                createdChapter.createdDate
            );
            const tableBody = document.getElementById('chapterTableBody');
            tableBody.appendChild(newChapter.taoHang());

            const comic = danhSachTruyen.find(truyen => truyen._id === comicId);
            if (comic) {
                comic.chapters += 1;
                hienThiBang(trangHienTai);
            }

            form.reset();
            closeAddChapterModal(); // Đóng modal thêm chương
        } else {
            const errorText = await response.text();
            console.error("Lỗi thêm chương:", errorText);
        }
    } catch (err) {
        console.error("Lỗi thêm chương:", err);
    }
});
