let moTaNganEditor;
let ContentAdd;
let editMoTaNgan;
let danhSachDanhMuc = []; // Lưu trữ danh sách danh mục

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
fetchCategories().then(categories => {
    danhSachDanhMuc = categories;
});


async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/categories');
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}
class HangTruyen {
    constructor(_id, image, title, category, chapters, author, description, views, likes ,status, rating, creationDate, updateDate) {
        this._id = _id;
        this.imageUrl = image;
        this.title = title;
        this.categoryId = category; // Lưu ID danh mục
        this.chapters = chapters;
        this.author = author;
        this.description = description;
        this.views = views;
        this.likes = likes ;
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
        cellDanhMuc.textContent = this.getCategoryNameById(this.categoryId);
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
        
        // Set the selected category in the dropdown
        const categorySelect = form.editDanhMuc;
        if (categorySelect) {
            for (let i = 0; i < categorySelect.options.length; i++) {
                if (categorySelect.options[i].value === this.categoryId) {
                    categorySelect.selectedIndex = i;
                    break;
                }
            }
        }
    
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
    
            // Get selected category ID from dropdown
            const selectedCategoryId = form.editDanhMuc.value;
            formData.append('category', selectedCategoryId); // Update or keep the existing category ID
    
            // Thêm các trường khác vào formData
            formData.append('title', form.editTenTruyen.value);
            formData.append('author', form.editTacgia.value);
            formData.append('description', updatedDescription);
            formData.append('updateDate', new Date().toISOString());
            // formData.append('status', this.status);
    
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
                            updatedComic.category || this.categoryId, // Đảm bảo danh mục được cập nhật đúng
                            truyen.chapters,
                            updatedComic.author,
                            updatedComic.description,
                            truyen.views,
                            truyen.likes,
                            this.status,
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
        updateChapterHeader(this.imageUrl, this.title, this.author, this.views, this.description, this._id);
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

    const selectedCategory = document.getElementById('selectedCategory').value;

    if (!selectedCategory) {
        console.error('Chưa có danh mục nào được chọn');
        return;
    }

    formData.append('title', form.addTenTruyen.value);
    formData.append('category', selectedCategory);  // Lấy ID của danh mục đã chọn
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
                createdComic.likes,
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
            document.getElementById('selectedCategory').value = '';  // Reset danh mục

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


function updateChapterHeader(image, title, author,views, description, _id) {
    document.getElementById('chapterImage').src = image;
    document.getElementById('chapterTitle').textContent = `Tên Truyện : ${title}`;
    document.getElementById('chapterAuthor').innerHTML = `<strong>Tác giả:</strong> ${author}`;
    // document.getElementById('chapterStatus').innerHTML = `<strong>Trạng thái:</strong> ${likes}`;
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
        return chapters.map(chapter => new HangChuong(chapter._id, chapter.comicId, chapter.chapterTitle, chapter.uploadDate));
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
            comic.chapters.length || 0,
            comic.author,
            comic.description,
            comic.views,
            comic.status,
            comic.rating,
            comic.creationDate,
            comic.updateDate,
            // comic.likes || 0  // Thêm biến likes với giá trị mặc định là 0
        ));
    } catch (error) {
        console.error('Error fetching comics:', error);
        return [];
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    try {
        danhSachDanhMuc = await fetchCategories();
        danhSachTruyen = await fetchComics();
        hienThiBang(trangHienTai);

        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => thayDoiTrang(-1));
        } else {
            console.error('Element with ID "prevPage" not found.');
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => thayDoiTrang(1));
        } else {
            console.error('Element with ID "nextPage" not found.');
        }
    } catch (error) {
        console.error('Error during DOMContentLoaded execution:', error);
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

// Lớp đại diện cho mỗi chương truyện
class HangChuong {
    constructor(_id, comicId, chapterTitle, uploadDate) {
        this._id = _id;
        this.comicId = comicId;
        this.chapterTitle = chapterTitle;
        this.uploadDate = new Date(uploadDate).toLocaleDateString();
    }

    // Tạo một hàng đại diện cho chương trong bảng
    taoHang() {
        const Hang = document.createElement('tr');

        // Ô tên chương
        const cellTenChuong = document.createElement('td');
        cellTenChuong.textContent = this.chapterTitle;
        Hang.appendChild(cellTenChuong);

        // Ô ngày đăng
        const cellNgayDang = document.createElement('td');
        cellNgayDang.textContent = this.uploadDate;
        Hang.appendChild(cellNgayDang);

        // Ô hành động
        const cellHanhDong = document.createElement('td');
        const editButton = this.taoNut('edit', 'Chỉnh sửa');
        editButton.addEventListener('click', () => this.moChinhSua());
        const deleteButton = this.taoNut('trash-alt', 'Xóa');
        deleteButton.addEventListener('click', () => this.moXoa());
        const viewButton = this.taoNut('eye', 'Xem');
        viewButton.addEventListener('click', () => this.moXem());

        cellHanhDong.appendChild(editButton);
        cellHanhDong.appendChild(deleteButton);
        cellHanhDong.appendChild(viewButton);
        Hang.appendChild(cellHanhDong);

        return Hang;
    }

    // Tạo một nút hành động
    taoNut(iconClass, tieuDe) {
        const nut = document.createElement('button');
        nut.className = `${iconClass}-btn`;
        nut.title = tieuDe;
        const icon = document.createElement('i');
        icon.className = `fas fa-${iconClass}`;
        nut.appendChild(icon);
        return nut;
    }

    // Mở modal chỉnh sửa chương
    // Mở modal chỉnh sửa chương
moChinhSua() {
    const modal = document.getElementById('editChapterModal');
    const form = document.getElementById('editChapterForm');

    // Cập nhật giá trị ban đầu của form
    form.editChapterTitle.value = this.chapterTitle;
    form.editChapterFile.value = ""; // Reset file đầu vào

    modal.style.display = 'block';

    document.getElementById('saveEditChapter').onclick = async () => {
        const file = form.editChapterFile.files[0];
        const formData = new FormData();

        // Kiểm tra nếu có tệp mới được chọn
        if (file) {
            formData.append('contentFile', file); // Thêm tệp mới vào formData
        }

        // Chỉ cập nhật tiêu đề nếu nó đã được thay đổi
        const updatedTitle = form.editChapterTitle.value;
        if (updatedTitle !== this.chapterTitle) {
            formData.append('chapterTitle', updatedTitle); // Cập nhật tiêu đề nếu có thay đổi
        }

        // Chỉ thực hiện yêu cầu cập nhật nếu có dữ liệu trong formData
        if (formData.has('contentFile') || formData.has('chapterTitle')) {
            try {
                const response = await fetch(`http://localhost:3000/api/chapters/${this._id}`, {
                    method: 'PUT',
                    body: formData // Gửi dữ liệu dưới dạng form data
                });

                if (response.ok) {
                    const updatedChapter = await response.json();
                    this.chapterTitle = updatedChapter.chapterTitle;
                    await hienThiDanhSachChuong(this.comicId); // Cập nhật lại danh sách chương
                    modal.style.display = 'none';
                } else {
                    console.error("Lỗi cập nhật chương:", await response.text());
                }
            } catch (err) {
                console.error("Lỗi cập nhật chương:", err);
            }
        } else {
            console.log("Không có thay đổi nào được thực hiện.");
            modal.style.display = 'none';
        }
    };
}


    // Mở modal xóa chương
    moXoa() {
        const deleteModal = document.getElementById('deleteChapterModal');
        deleteModal.style.display = 'block';

        document.getElementById('confirmDeleteChapter').onclick = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/chapters/${this._id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    hienThiDanhSachChuong(this.comicId); // Cập nhật lại danh sách chương
                    deleteModal.style.display = 'none';
                } else {
                    console.error("Lỗi xóa chương:", await response.text());
                }
            } catch (err) {
                console.error("Lỗi xóa chương:", err);
            }
        };

        document.getElementById('cancelDeleteChapter').onclick = () => {
            deleteModal.style.display = 'none';
        };

        document.getElementById('closeDeleteChapterModal').onclick = () => {
            deleteModal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target == deleteModal) {
                deleteModal.style.display = 'none';
            }
        };
    }

    // Xem nội dung chương
    async moXem() {
        try {
            const response = await fetch(`http://localhost:3000/api/chapters/${this._id}`);
            const chapter = await response.json();
            if (chapter) {
                window.open(chapter.content, '_blank'); // Mở tệp chương trong tab mới
            } else {
                console.error("Chương không tồn tại.");
            }
        } catch (err) {
            console.error("Lỗi khi xem chương:", err);
        }
    }
}

// Thêm mới chương và cập nhật danh sách chương sau khi thêm
document.getElementById('saveChapterForm').addEventListener('click', async function (event) {
    event.preventDefault();

    const form = document.getElementById('addChapterForm');
    const comicId = document.getElementById('chapterTableBody').dataset.comicId; 
    const chapterNumberInput = document.getElementById('chapterNumber');
    const chapterTitleInput = form.chapterTitle;
    const chapterFileInput = form.chapterFile;

    const chapterNumber = chapterNumberInput.value;
    const chapterTitle = chapterTitleInput.value;

    if (!comicId || !chapterNumber || !chapterTitle) {
        console.error("Thiếu thông tin cần thiết.");
        return;
    }

    const chapterFile = chapterFileInput.files[0];

    if (!chapterFile) {
        console.error("Không có tệp nội dung được chọn.");
        return;
    }

    const formData = new FormData();
    formData.append('comicId', comicId);
    formData.append('chapterNumber', chapterNumber);
    formData.append('chapterTitle', chapterTitle);
    formData.append('contentFile', chapterFile);

    try {
        const response = await fetch('http://localhost:3000/api/chapters', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const createdChapter = await response.json();
            console.log('Chương được tạo:', createdChapter);

            // Tăng số thứ tự cho chương kế tiếp
            chapterNumberInput.value = parseInt(chapterNumber) + 1;

            // Xóa các trường nhập để chuẩn bị nhập chương mới
            chapterTitleInput.value = '';
            chapterFileInput.value = '';

            // Cập nhật lại danh sách chương
            await hienThiDanhSachChuong(comicId);

            // Đóng modal hoặc làm mới UI
            closeAddChapterModal();
        } else {
            const errorText = await response.text();
            console.error("Lỗi khi thêm chương:", errorText);
        }
    } catch (err) {
        console.error("Lỗi khi thêm chương:", err);
    }
});
