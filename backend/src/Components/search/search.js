// Khai báo biến cho số lượng truyện trên mỗi trang
const comicsPerPage = 12;
let totalPages = 1;
let currentPage = 1;

// Khai báo biến để kiểm soát trạng thái của thanh tìm kiếm
let isSearchVisible = false;

document.getElementById('searchIcon').addEventListener('click', () => {
    const searchBarContainer = document.getElementById('searchBarContainer');
    
    if (isSearchVisible) {
        searchBarContainer.style.display = 'none';
        isSearchVisible = false;
    } else {
        searchBarContainer.style.display = 'flex';
        document.getElementById('searchInput').focus(); // Đặt focus vào thanh tìm kiếm khi hiện lên
        isSearchVisible = true;
    }
});

// Ẩn thanh tìm kiếm khi nhấp ra ngoài
document.addEventListener('click', function(event) {
    const searchBarContainer = document.getElementById('searchBarContainer');
    const searchIcon = document.getElementById('searchIcon');
    
    if (isSearchVisible && !searchBarContainer.contains(event.target) && !searchIcon.contains(event.target)) {
        searchBarContainer.style.display = 'none';
        isSearchVisible = false;
    }
});

// Sự kiện khi người dùng nhập vào ô tìm kiếm
document.getElementById('searchInput').addEventListener('input', async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        try {
            const response = await fetch(`http://localhost:3000/api/comics/search?search=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const comics = await response.json();
            if (comics.length > 0) {
                totalPages = Math.ceil(comics.length / comicsPerPage);
                clearPreviousData(); // Xóa các dữ liệu cũ trước khi hiển thị kết quả tìm kiếm
                displaySearchResults(comics, 1); // Hiển thị kết quả từ trang 1
            } else {
                displayNoResultsMessage();
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
        }
    } else {
        document.querySelector('.collection-list').innerHTML = ''; // Xóa kết quả nếu ô tìm kiếm rỗng
    }
});


function clearPreviousData() {
    const collectionList = document.querySelector('.collection-list');
    const paginationContainer = document.getElementById('pagination-container');
    const loadMoreButton = document.getElementById('load-more-button'); // Tham chiếu đến nút "Xem thêm nhiều truyện"
    const comicsContainer = document.getElementById('comics-container'); // Tham chiếu đến container dữ liệu động cũ

    collectionList.innerHTML = ''; // Xóa các kết quả cũ
    paginationContainer.innerHTML = ''; // Xóa phân trang hiện tại
    if (loadMoreButton) {
        loadMoreButton.style.display = 'none'; // Ẩn nút "Xem thêm nhiều truyện"
    }
    if (comicsContainer) {
        comicsContainer.innerHTML = ''; // Xóa dữ liệu động cũ trong comicsContainer
    }
}

function displaySearchResults(comics, page) {
    const collectionList = document.querySelector('.collection-list');

    const start = (page - 1) * comicsPerPage;
    const end = start + comicsPerPage;
    const comicsToDisplay = comics.slice(start, end);

    comicsToDisplay.forEach(comic => {
        const box = document.createElement('div');
        box.className = 'col-md-6 col-lg-4 col-xl-3 p-2';

        box.innerHTML = `
            <div class="collection-img position-relative">
                <img src="${comic.imageUrl}" class="w-100 img-fluid custom-img" alt="${comic.title}">
                ${comic.status === 'Đang cập nhật' ? '<span class="position-absolute bg-primary text-white d-flex align-items-center justify-content-center">New</span>' : ''}
            </div>
            <div class="text-center">
                <div class="rating mt-3">
                    ${generateRatingHtml(comic.rating)}
                </div>
                <p class="text-capitalize fw-bold">${comic.title}</p>
                <span class="fw-bold d-block">
                    <a href="doc_ngay.html?id=${comic._id}" class="btn btn-primary mt-3">Đọc ngay</a>
                    <a href="#" class="btn btn-primary mt-3"><i class="fa-regular fa-heart"></i></a>
                </span>
            </div>
        `;
        collectionList.appendChild(box);
    });

    // Cập nhật pagination
    createPagination(comics);
}

// Hàm tạo HTML cho rating (dùng lại từ TrangTruyen.js)
function generateRatingHtml(rating) {
    let ratingHtml = '';
    for (let i = 0; i < Math.floor(rating); i++) {
        ratingHtml += '<span class="text-primary"><i class="fas fa-star"></i></span>';
    }
    if (rating % 1 !== 0) {
        ratingHtml += '<span class="text-primary"><i class="fas fa-star-half-alt"></i></span>';
    }
    return ratingHtml;
}

// Hàm tạo pagination cho kết quả tìm kiếm
function createPagination(comics) {
    const paginationContainer = document.getElementById('pagination-container');
    const paginationList = document.createElement('ul');
    paginationList.classList.add('pagination');

    // Nút Previous
    const prevPageItem = document.createElement('li');
    prevPageItem.classList.add('page-item');
    prevPageItem.innerHTML = `<a class="page-link" href="#" id="prev-page">Previous</a>`;
    prevPageItem.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            displaySearchResults(comics, currentPage);
        }
    });
    paginationList.appendChild(prevPageItem);

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        if (i === currentPage) {
            pageItem.classList.add('active');
        }
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener('click', function () {
            currentPage = i;
            displaySearchResults(comics, currentPage);
        });
        paginationList.appendChild(pageItem);
    }

    // Nút Next
    const nextPageItem = document.createElement('li');
    nextPageItem.classList.add('page-item');
    nextPageItem.innerHTML = `<a class="page-link" href="#" id="next-page">Next</a>`;
    nextPageItem.addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            displaySearchResults(comics, currentPage);
        }
    });
    paginationList.appendChild(nextPageItem);

    // Thêm thanh phân trang vào container
    paginationContainer.innerHTML = ''; // Xóa các phần tử hiện tại trước khi thêm mới
    paginationContainer.appendChild(paginationList);
}

// Hàm hiển thị thông báo không tìm thấy kết quả và tự động refresh trang
function displayNoResultsMessage() {
    const noResultsModal = new bootstrap.Modal(document.getElementById('noResultsModal'));
    noResultsModal.show();

    setTimeout(() => {
        window.location.reload();
    }, 3000); // Trang sẽ tự động refresh sau 3 giây
}
