document.addEventListener('DOMContentLoaded', async () => {
    const comicsPerPage = 12; // Số truyện mỗi trang
    const collectionList = document.querySelector('.collection-list');
    const paginationContainer = document.getElementById('pagination-container');

    let currentPage = 1;
    let totalPages = 1;
    let comics = [];
    let favoriteComics = [];

    // Fetch user data including favorites
    async function fetchUserData() {
        let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

        try {
            const response = await fetch("http://localhost:8000/v1/user/me", {
                method: "GET",
                headers: {
                    "Token": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const userData = await response.json();
                favoriteComics = userData.favoriteComics.map(fav => fav.comicId);
            } else {
                console.error("Failed to fetch user data.");
                throw new Error("Failed to fetch user data.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    // Fetch comics from API
    async function fetchComics() {
        try {
            const response = await fetch('http://localhost:3000/api/comics'); // API endpoint
            const data = await response.json();
            if (!data || data.length === 0) {
                console.error('No comics data available!');
                return;
            }
            comics = data;
            totalPages = Math.ceil(comics.length / comicsPerPage);
            createPagination();
            displayComics(currentPage);
            setupFavoriteButtons(); // Setup favorite buttons after displaying comics
        } catch (error) {
            console.error('Error fetching comics data:', error);
        }
    }

    // Display comics for the current page
    function displayComics(page) {
        const start = (page - 1) * comicsPerPage;
        const end = start + comicsPerPage;
        const comicsToDisplay = comics.slice(start, end);

        collectionList.innerHTML = ''; // Clear current elements

        comicsToDisplay.forEach(comic => {
            const box = document.createElement('div');
            box.className = 'col-md-6 col-lg-4 col-xl-3 p-2';

            const isFavorited = favoriteComics.includes(comic._id) ? 'active' : '';

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
                        <a href="#" class="btn btn-primary mt-3 favorite-btn ${isFavorited}" data-comic-id="${comic._id}"><i class="fa-regular fa-heart"></i></a>
                    </span>
                </div>
            `;
            collectionList.appendChild(box);
        });

        updatePagination();
        setupFavoriteButtons(); // Ensure favorite button event setup
    }

    // Pagination setup
    function createPagination() {
        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination');

        // Previous button
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

        // Page number buttons
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

        // Next button
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

        paginationContainer.innerHTML = ''; // Clear current pagination
        paginationContainer.appendChild(paginationList);
    }

    // Update pagination state
    function updatePagination() {
        const pageItems = paginationContainer.querySelectorAll('.page-item');
        pageItems.forEach(item => item.classList.remove('active'));
        if (pageItems[currentPage]) {
            pageItems[currentPage].classList.add('active');
        }
    }

    // Generate HTML for rating stars
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

    // Setup favorite button events
    function setupFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');

        favoriteButtons.forEach(button => {
            button.removeEventListener('click', handleFavoriteButtonClick); // Prevent duplicate listeners
            button.addEventListener('click', handleFavoriteButtonClick);
        });
    }

    // Handle favorite button click
    async function handleFavoriteButtonClick(event) {
        event.preventDefault();
    
        let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    
        if (!token) {
            showAlert("Vui lòng đăng nhập để sử dụng chức năng này!", "danger");
            return;
        }
    
        const button = event.currentTarget;
        const comicId = button.getAttribute('data-comic-id');
        const isFavorite = button.classList.contains('active');
    
        try {
            if (isFavorite) {
                // Hiển thị hộp thoại xác nhận
                showConfirmation("Truyện này đã có trong danh sách yêu thích. Bạn có muốn xoá không?", async () => {
                    await removeFavorite(comicId, token);
                    button.classList.remove('active');
                    showAlert("Đã xoá truyện yêu thích thành công!", "success");
                });
            } else {
                await addFavorite(comicId, token);
                button.classList.add('active');
                showAlert("Thêm truyện yêu thích thành công!", "success");
            }
        } catch (error) {
            console.error("Lỗi khi xử lý yêu thích:", error);
            showAlert("Có lỗi xảy ra khi xử lý yêu thích!", "danger");
        }
    }
    

    // Add comic to favorites
    async function addFavorite(comicId, token) {
        const response = await fetch('http://localhost:8000/v1/user/favorites/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': `Bearer ${token}`
            },
            body: JSON.stringify({ comicId })
        });

        if (!response.ok) {
            throw new Error("Không thể thêm truyện vào danh sách yêu thích.");
        }

        const data = await response.json();
        favoriteComics.push(comicId); // Add to local list
        return data;
    }

    // Remove comic from favorites
    async function removeFavorite(comicId, token) {
        const response = await fetch('http://localhost:8000/v1/user/favorites/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Token': `Bearer ${token}`
            },
            body: JSON.stringify({ comicId })
        });

        if (!response.ok) {
            throw new Error("Không thể xoá truyện khỏi danh sách yêu thích.");
        }

        const data = await response.json();
        favoriteComics = favoriteComics.filter(favId => favId !== comicId); // Remove from local list
        return data;
    }

    // Show alert message
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

    // Hiển thị hộp thoại xác nhận
    function showConfirmation(message, onConfirm) {
        const confirmationBox = document.createElement('div');
        confirmationBox.className = `modal fade`;
        confirmationBox.tabIndex = '-1';
        confirmationBox.setAttribute('aria-labelledby', 'exampleModalLabel');
        confirmationBox.setAttribute('aria-hidden', 'true');
        confirmationBox.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Xác nhận</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${message}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary confirm-btn">Xác nhận</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(confirmationBox);
        const modal = new bootstrap.Modal(confirmationBox);
        modal.show();

        confirmationBox.querySelector('.confirm-btn').addEventListener('click', () => {
            onConfirm();
            modal.hide();
        });

        confirmationBox.addEventListener('hidden.bs.modal', () => {
            confirmationBox.remove();
        });
    }


    await fetchUserData(); // Fetch user data including favorites
    fetchComics();
});
