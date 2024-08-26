document.addEventListener('DOMContentLoaded', () => {
    const favoriteLink = document.querySelector('.nav-link[href="#special"]');
    const collectionList = document.querySelector('.collection-list');
    const paginationContainer = document.getElementById('pagination-container');
    const loadMoreButton = document.getElementById('load-more-button');
    const comicsContainer = document.getElementById('comics-container'); // Thêm dòng này để tham chiếu đến container chứa comics
    
    let favoriteComics = [];
    let comicsPerPage = 12;
    let currentPage = 1;
    let totalPages = 1;

    // Gắn sự kiện nhấn vào link "Yêu Thích"
    favoriteLink.addEventListener('click', async (event) => {
        event.preventDefault();

        // Xóa các dữ liệu còn lại từ danh mục và nút "Xem thêm nhiều truyện"
        clearPreviousData();

        // Kiểm tra token
        let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        if (!token) {
            // Nếu không có token, hiển thị thông báo yêu cầu đăng nhập
            showAlert('Vui lòng đăng nhập để sử dụng trang yêu thích.', 'danger');
            return;
        }

        await fetchFavoriteComics(token);
    });

    // Hàm xóa các dữ liệu còn lại
    function clearPreviousData() {
        collectionList.innerHTML = ''; // Xóa truyện hiện tại trong danh sách
        paginationContainer.innerHTML = ''; // Xóa phân trang hiện tại
        comicsContainer.innerHTML = ''; // Xóa các truyện hiện có trong comics-container
        loadMoreButton.style.display = 'none'; // Ẩn nút "Xem thêm nhiều truyện"
    }

    // Hàm lấy danh sách truyện yêu thích của người dùng
    async function fetchFavoriteComics(token) {
        try {
            const response = await fetch('http://localhost:8000/v1/user/favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const comicIds = data.map(item => item.comicId);

                // Lấy chi tiết các truyện dựa trên comicIds
                const comicDetailsPromises = comicIds.map(id => fetch(`http://localhost:3000/api/comics/${id}`).then(res => res.json()));
                favoriteComics = await Promise.all(comicDetailsPromises);
                
                totalPages = Math.ceil(favoriteComics.length / comicsPerPage);
                createPagination(); // Tạo phân trang cho danh sách truyện yêu thích
                displayComics(currentPage); // Hiển thị các truyện yêu thích của trang đầu tiên
            } else {
                console.error('Lỗi khi lấy danh sách truyện yêu thích:', response.statusText);
                showAlert("Không thể lấy danh sách truyện yêu thích.", "danger");
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            showAlert("Đã xảy ra lỗi khi lấy danh sách truyện yêu thích.", "danger");
        }
    }

    // Hàm hiển thị các truyện yêu thích
    function displayComics(page) {
        const start = (page - 1) * comicsPerPage;
        const end = start + comicsPerPage;
        const comicsToDisplay = favoriteComics.slice(start, end);

        collectionList.innerHTML = ''; // Xóa các phần tử hiện tại

        comicsToDisplay.forEach(comic => {
            const box = document.createElement('div');
            box.className = 'col-md-6 col-lg-4 col-xl-3 p-2';

            box.innerHTML = `
                <div class="collection-img position-relative">
                    <img src="${comic.imageUrl}" class="w-100 img-fluid custom-img" alt="${comic.title}">
                </div>
                <div class="text-center">
                    <div class="rating mt-3">
                        ${generateRatingHtml(comic.rating || 0)}
                    </div>
                    <p class="text-capitalize fw-bold">${comic.title}</p>
                    <span class="fw-bold d-block">
                        <a href="doc_ngay.html?id=${comic._id}" class="btn btn-primary mt-3">Đọc ngay</a>
                    </span>
                </div>
            `;
            collectionList.appendChild(box);
        });
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

    // Tạo phân trang
    function createPagination() {
        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination');

        // Nút Previous
        const prevPageItem = document.createElement('li');
        prevPageItem.classList.add('page-item');
        prevPageItem.innerHTML = `<a class="page-link" href="#" id="prev-page">Previous</a>`;
        prevPageItem.addEventListener('click', () => {
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
            pageItem.addEventListener('click', () => {
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
        nextPageItem.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayComics(currentPage);
                updatePagination();
            }
        });
        paginationList.appendChild(nextPageItem);

        paginationContainer.innerHTML = ''; // Xóa phân trang hiện tại
        paginationContainer.appendChild(paginationList);
    }

    // Cập nhật phân trang
    function updatePagination() {
        const pageItems = paginationContainer.querySelectorAll('.page-item');
        pageItems.forEach(item => item.classList.remove('active'));
        if (pageItems[currentPage]) {
            pageItems[currentPage].classList.add('active');
        }
    }

    // Hàm hiển thị thông báo
    function showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertBox.style.zIndex = 9999;
        alertBox.innerHTML = `
            <strong>${message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        document.body.appendChild(alertBox);

        setTimeout(() => {
            alertBox.remove();
        }, 3000);
    }
});
