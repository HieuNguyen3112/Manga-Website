document.addEventListener('DOMContentLoaded', () => {
    const favoriteLink = document.querySelector('.nav-link[href="#special"]');
    let favoriteComics = [];
    let comicsPerPage = 6; // Set to 6 comics per row
    let currentPage = 1;
    let totalPages = 1;

    if (!favoriteLink) {
        return;
    }

    // Event listener for the "Favorite" link
    favoriteLink.addEventListener('click', (event) => {
        event.preventDefault();

        // Điều hướng đến trang yeuThich.html
        window.location.href = '/frontend/yeuThich.html';
    });

    // Kiểm tra xem trang hiện tại có phải là yeuThich.html hay không
    if (window.location.pathname.includes('yeuThich.html')) {
        handleFavoriteClick(); // Tải danh sách truyện yêu thích
    }

    async function handleFavoriteClick() {
        // Check token
        let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        if (!token) {
            // Show alert if no token found
            showAlert('Vui lòng đăng nhập để sử dụng trang yêu thích.', 'danger');
            return;
        }

        await fetchFavoriteComics(token);
    }

    // Function to fetch the user's favorite comics
    async function fetchFavoriteComics(token) {
        try {
            const response = await fetch('http://localhost:3000/v1/user/favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const comicIds = data.map(item => item.comicId);

                // Fetch details of comics based on comicIds
                const comicDetailsPromises = comicIds.map(id => fetch(`http://localhost:3000/api/comics/${id}`).then(res => res.json()));
                favoriteComics = await Promise.all(comicDetailsPromises);

                if (favoriteComics.length === 0) {
                    showAlert('Bạn chưa có truyện yêu thích nào, hãy thêm truyện yêu thích trước khi truy cập mục này.', 'warning');
                    return;
                }

                totalPages = Math.ceil(favoriteComics.length / comicsPerPage);

                // Get or create favoritesContainer
                let favoritesContainer = document.getElementById('favorites-container');
                if (!favoritesContainer) {
                    favoritesContainer = document.createElement('div');
                    favoritesContainer.id = 'favorites-container';
                    document.body.appendChild(favoritesContainer);
                }

                clearPreviousData(favoritesContainer);

                // Tạo phần tử title và thêm class cho nó
                const titleElement = document.createElement('h2');
                titleElement.innerText = 'Truyện Yêu Thích Của bạn';
                titleElement.style.color = 'white';
                titleElement.classList.add('title-container', 'my-4');
                titleElement.style.textAlign = 'left'; 
                favoritesContainer.appendChild(titleElement);

                displayComics(currentPage, favoritesContainer);
            } else {
                console.error('Error fetching favorite comics:', response.statusText);
                showAlert("Không thể lấy danh sách truyện yêu thích.", "danger");
            }
        } catch (error) {
            console.error('An error occurred:', error);
            showAlert("Đã xảy ra lỗi khi lấy danh sách truyện yêu thích.", "danger");
        }
    }

    function clearPreviousData(container) {
        container.innerHTML = '';
    }

    function displayComics(page, container) {
        const start = (page - 1) * comicsPerPage;
        const end = start + comicsPerPage;
        const comicsToDisplay = favoriteComics.slice(start, end);

        comicsToDisplay.forEach(comic => {
            const comicElement = document.createElement('div');
            comicElement.className = 'col-md-2 p-2';
            comicElement.innerHTML = `
                <div class="comic-card position-relative">
                    <img src="${comic.imageUrl}" class="comic-image" alt="${comic.title}" style="cursor: pointer;">
                    <div class="comic-overlay position-absolute p-2 bg-dark text-white rounded" style="display: none; background-color: rgba(0, 0, 0, 0.7); border-radius: 5px;">
                        <h5 class="comic-title">${comic.title}</h5>
                        <a href="doc_ngay.html?id=${comic._id}" class="btn btn-primary btn-sm">Đọc truyện</a>
                    </div>
                </div>
            `;
            container.appendChild(comicElement);
        });

        addHoverAndClickEvents();
    }

    function addHoverAndClickEvents() {
        document.querySelectorAll('.comic-card').forEach(comicCard => {
            const overlay = comicCard.querySelector('.comic-overlay');

            comicCard.addEventListener('mouseenter', () => {
                $(overlay).fadeIn(200);
            });

            comicCard.addEventListener('mouseleave', () => {
                $(overlay).fadeOut(200);
            });

            comicCard.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') {
                    const readLink = e.currentTarget.querySelector('a').href;
                    window.location.href = readLink;
                }
            });
        });
    }

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
