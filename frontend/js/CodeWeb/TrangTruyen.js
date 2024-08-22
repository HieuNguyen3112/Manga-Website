document.addEventListener('DOMContentLoaded', async () => {
    const comicsPerPage = 12; // Số truyện mỗi trang
    const collectionList = document.querySelector('.collection-list');
    const paginationContainer = document.getElementById('pagination-container');

    let currentPage = 1;
    let totalPages = 1;
    let comics = [];

    // Hàm lấy dữ liệu từ API
    async function fetchComics() {
        try {
            const response = await fetch('http://localhost:3000/api/comics'); // API endpoint
            const data = await response.json();
            if (!data || data.length === 0) {
                console.error('Không có dữ liệu truyện nào!');
                return;
            }
            comics = data;
            totalPages = Math.ceil(comics.length / comicsPerPage);
            createPagination();
            displayComics(currentPage);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    }

    // Hàm hiển thị truyện cho trang hiện tại
    function displayComics(page) {
        const start = (page - 1) * comicsPerPage;
        const end = start + comicsPerPage;
        const comicsToDisplay = comics.slice(start, end);

        const collectionList = document.querySelector('.collection-list');
        collectionList.innerHTML = ''; // Xóa các phần tử hiện tại trước khi thêm mới

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

        updatePagination();
    }

    // Tạo các nút chuyển trang
    function createPagination() {
        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination');
        
        // Nút Previous
        const prevPageItem = document.createElement('li');
        prevPageItem.classList.add('page-item');
        prevPageItem.innerHTML = `<a class="page-link" href="#" id="prev-page">Previous</a>`;
        prevPageItem.addEventListener('click', function () {
            if (currentPage > 1) {
                currentPage--;
                displayComics(currentPage);
                updatePagination();
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
                displayComics(currentPage);
                updatePagination();
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
                displayComics(currentPage);
                updatePagination();
            }
        });
        paginationList.appendChild(nextPageItem);

        // Thêm thanh phân trang vào container
        paginationContainer.innerHTML = ''; // Xóa các phần tử hiện tại trước khi thêm mới
        paginationContainer.appendChild(paginationList);
    }

    // Cập nhật trạng thái phân trang
    function updatePagination() {
        const pageItems = paginationContainer.querySelectorAll('.page-item');
        pageItems.forEach(item => item.classList.remove('active'));
        if (pageItems[currentPage]) {
            pageItems[currentPage].classList.add('active');
        }
    }

    // Hàm tạo HTML cho rating
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

    // Khởi tạo trang và phân trang
    fetchComics();
});
