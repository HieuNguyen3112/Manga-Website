document.addEventListener('DOMContentLoaded', async () => {
    const comicsPerPage = 12;
    const collectionList = document.querySelector('.collection-list');
    const comicsContainer = document.getElementById('comics-container');

    let currentPage = 1;
    let totalPages = 1;
    let comics = [];
    let favoriteComics = [];

    // Xóa dữ liệu hiện tại
    function clearData() {
        collectionList.innerHTML = '';
        comicsContainer.innerHTML = ''; // Xóa danh mục hiện tại
    }

    // Fetch user data including favorites
    async function fetchUserData() {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        
        if (!token) {
            console.warn("No token found. User is not logged in.");
            showAlert("Vui lòng đăng nhập để xem thông tin cá nhân.", "warning");
            return; 
        }
    
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
            showAlert("Đã xảy ra lỗi khi lấy thông tin người dùng. Vui lòng thử lại sau.", "danger");
        }
    }

    // Fetch categories from API
    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:3000/api/categories');

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const categories = await response.json();
            console.log('Categories data:', categories);
            const categoryList = document.querySelector('#theloaiDropdown + .dropdown-menu');

            categoryList.innerHTML = '';

            categories.forEach(category => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.className = 'dropdown-item';
                link.href = '#';
                link.setAttribute('data-category-id', category._id);
                link.textContent = category.name;
                listItem.appendChild(link);
                categoryList.appendChild(listItem);

                link.addEventListener('click', async (event) => {
                    event.preventDefault();
                    clearData(); // Xóa dữ liệu trước khi tải danh mục mới
                    console.log(`Selected category: ${category._id}`);
                    currentPage = 1;
                    await fetchComics(category._id);
                });
            });

            const allItem = document.createElement('li');
            const allLink = document.createElement('a');
            allLink.className = 'dropdown-item';
            allLink.href = '#';
            allLink.textContent = 'Tất cả';
            allItem.appendChild(allLink);
            categoryList.insertBefore(allItem, categoryList.firstChild);

            allLink.addEventListener('click', async (event) => {
                event.preventDefault();
                clearData(); // Xóa dữ liệu trước khi tải toàn bộ danh mục
                console.log('Selected all categories');
                currentPage = 1;
                await fetchComics();
            });

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    // Fetch comics from API
    async function fetchComics(categoryId = null) {
        try {
            const url = categoryId ? `http://localhost:3000/api/comics?category=${categoryId}` : 'http://localhost:3000/api/comics';
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error('Failed to fetch comics');
            }
    
            const data = await response.json();
            if (!data || data.length === 0) {
                console.warn('No comics found!');
                collectionList.innerHTML = '<p class="text-center text-muted">Không tìm thấy truyện nào.</p>';
                return;
            }
    
            comics = data;
            if (comics.length === 0) {
                collectionList.innerHTML = '<p class="text-center text-muted">Không có truyện nào trong thể loại này.</p>';
                return;
            }
    
            totalPages = Math.ceil(comics.length / comicsPerPage);
            displayComics(currentPage);
            setupFavoriteButtons();
        } catch (error) {
            console.error('Error fetching comics:', error);
            collectionList.innerHTML = '<p class="text-center text-danger">Không thể tải truyện.</p>';
        }
    }

    // Display comics for the current page
    function displayComics(comics) {
        const comicsContainer = document.querySelector('.collection-list');
        comicsContainer.innerHTML = '';
    
        comics.forEach(comic => {
            const comicElement = document.createElement('div');
            comicElement.classList.add('col-md-6', 'col-lg-4', 'col-xl-2', 'p-2');  // Mỗi hàng 5 truyện
            
            comicElement.innerHTML = `
                <div class="collection-img position-relative">
                    <img src="${comic.image}" class="img-fluid custom-img" alt="${comic.title}">
                    ${comic.status === 'new' ? '<span class="position-absolute bg-primary text-white d-flex align-items-center justify-content-center">New</span>' : ''}
                </div>
                <div class="text-center mt-2">
                    <p class="text-capitalize fw-bold mb-1">${comic.title}</p>
                    <a href="doc_ngay.html?id=${comic.id}" class="btn btn-primary">Đọc ngay</a>
                </div>
            `;
            comicsContainer.appendChild(comicElement);
        });
    
        // Ẩn thanh cuộn ngang
        document.querySelector('.row.g-0').style.overflowX = 'hidden';
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
            button.removeEventListener('click', handleFavoriteButtonClick);
            button.addEventListener('click', handleFavoriteButtonClick);
        });
    }

    // Handle favorite button click
    async function handleFavoriteButtonClick(event) {
        event.preventDefault();

        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

        if (!token) {
            showAlert("Vui lòng đăng nhập để sử dụng chức năng này!", "danger");
            return;
        }

        const button = event.currentTarget;
        const comicId = button.getAttribute('data-comic-id');
        const isFavorite = button.classList.contains('active');

        try {
            if (isFavorite) {
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

        favoriteComics.push(comicId);
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

        favoriteComics = favoriteComics.filter(favId => favId !== comicId);
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

    // Tải dữ liệu người dùng và danh mục khi trang tải lên
    await fetchUserData();
    await fetchCategories();
});
