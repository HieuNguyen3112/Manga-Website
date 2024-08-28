document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Lấy comicId từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const comicId = urlParams.get('id');

        if (!comicId) {
            console.error('Không tìm thấy ID truyện!');
            return;
        }

        // Gửi yêu cầu đến API để lấy tất cả các truyện
        const response = await fetch('http://localhost:3000/api/comics');
        const comics = await response.json();

        // Tìm truyện có ID khớp với comicId
        const comic = comics.find(comic => comic._id === comicId);

        if (!comic) {
            console.error('Không tìm thấy thông tin truyện với ID:', comicId);
            return;
        }

        // Cập nhật tiêu đề truyện
        const titleElement = document.querySelector('.title-fluid');
        if (titleElement) {
            titleElement.textContent = comic.title;
        }

        // Cập nhật hình ảnh
        const imageElement = document.querySelector('.main_image img');
        if (imageElement) {
            imageElement.src = comic.imageUrl;
        }

        // Cập nhật tác giả
        const authorElement = document.querySelector('.author .col-xs-9');
        if (authorElement) {
            authorElement.textContent = comic.author;
        }

        // Cập nhật trạng thái
        const statusElement = document.querySelector('.status .col-xs-9');
        if (statusElement) {
            statusElement.textContent = comic.status;
        }

        // Cập nhật số lượt thích
        const likesElement = document.querySelector('.number-like');
        if (likesElement) {
            likesElement.textContent = comic.likes || 0;  // Nếu không có likes, hiển thị 0
        }

        // Cập nhật số lượt xem
        const viewsElement = document.querySelector('.fa-eye').nextElementSibling;
        if (viewsElement) {
            viewsElement.textContent = comic.views || 0;  // Nếu không có lượt xem, hiển thị 0
        }

        // Cập nhật mô tả
        const descriptionElement = document.querySelector('.gioi_thieu + div');
        if (descriptionElement) {
            descriptionElement.innerHTML = comic.description; // Sử dụng innerHTML để giữ định dạng HTML
        }

        // Đặt hình ảnh truyện làm background cho toàn bộ trang với lớp phủ đen mờ
        if (comic.imageUrl) {
            document.body.style.backgroundImage = `url(${comic.imageUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            
            // Thêm lớp phủ đen mờ
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.zIndex = '-1';
            document.body.appendChild(overlay);
        }

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');
    const collectionList = document.getElementById('collection-list');

    const FAVORITES_KEY = 'favoriteComics';

    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:3000/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const categories = await response.json();
            const categoryList = document.querySelector('#theloaiDropdown + .dropdown-menu');

            categoryList.innerHTML = '';

            categories.forEach(category => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.className = 'dropdown-item';
                link.href = `The_loai.html?categoryId=${category._id}`;
                link.textContent = category.name;
                listItem.appendChild(link);
                categoryList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    await fetchCategories();

    async function fetchComics(categoryId) {
        try {
            const url = `http://localhost:3000/api/comics?category=${categoryId}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch comics');
            }

            const comics = await response.json();
            collectionList.innerHTML = ''; // Clear previous content

            if (comics.length === 0) {
                collectionList.innerHTML = '<p class="text-center">Không có truyện nào thuộc thể loại này.</p>';
                return;
            }

            // Lọc các truyện có categoryId nằm trong mảng category
            const filteredComics = comics.filter(comic => comic.category.includes(categoryId));

            if (filteredComics.length === 0) {
                collectionList.innerHTML = '<p class="text-center">Không có truyện nào thuộc thể loại này.</p>';
                return;
            }

            filteredComics.forEach(comic => {
                const itemHtml = `
    <div class="col-md-3">
        <div class="card">
            <img src="${comic.imageUrl}" class="card-img-top" alt="${comic.title}">
            <div class="card-body">
                <h5 class="card-title">${comic.title}</h5>
                <a href="doc_ngay.html?id=${comic._id}" class="btn btn-primary">Đọc truyện</a>
            </div>
        </div>
    </div>`;
                collectionList.innerHTML += itemHtml;
            });
        } catch (error) {
            console.error('Error fetching comics:', error);
        }
    }


    async function fetchFeaturedComics(categoryId) {
        try {
            const url = `http://localhost:3000/api/comics?category=${categoryId}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch featured comics');
            }

            const featuredComics = await response.json();
            carouselInner.innerHTML = '';
            carouselIndicators.innerHTML = '';

            if (featuredComics.length === 0) {
                carouselInner.innerHTML = '<p class="text-center">Không có truyện nào thuộc thể loại này.</p>';
                return;
            }

            const filteredComics = featuredComics.filter(comic => comic.category.includes(categoryId));

            filteredComics.forEach((comic, index) => {
                const isActive = index === 0 ? 'active' : '';

                const itemHtml = `
        <div class="carousel-item ${isActive}" style="background-image: url('${comic.imageUrl}')">
            <div class="carousel-text">
                <h5>${comic.title}</h5>
                <p>${comic.description}</p>
                <div class="button-group">
                    <a href="doc_ngay.html?id=${comic._id}" class="btn btn-primary">Đọc ngay</a>
                    <button class="btn btn-outline-light favorite-btn" data-comic-id="${comic._id}" onclick="toggleFavorite('${comic._id}')">Yêu thích</button>
                </div>
            </div>
            <img src="${comic.imageUrl}" class="carousel-image d-block" alt="${comic.title}">
        </div>`;
                carouselInner.innerHTML += itemHtml;

                const indicatorHtml = `
        <button type="button" data-bs-target="#comicCarousel" data-bs-slide-to="${index}" class="${isActive}" aria-label="Slide ${index + 1}"></button>`;
                carouselIndicators.innerHTML += indicatorHtml;
            });

            updateFavoriteButtons();
        } catch (error) {
            console.error('Error fetching featured comics:', error);
        }
    }

    function getFavorites() {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    }

    function saveFavorites(favorites) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }

    function toggleFavorite(comicId) {
        let favorites = getFavorites();
        if (favorites.includes(comicId)) {
            favorites = favorites.filter(id => id !== comicId);
        } else {
            favorites.push(comicId);
        }
        saveFavorites(favorites);
        updateFavoriteButtons();
    }

    function updateFavoriteButtons() {
        const favorites = getFavorites();
        document.querySelectorAll('.favorite-btn').forEach(button => {
            const comicId = button.getAttribute('data-comic-id');
            if (favorites.includes(comicId)) {
                button.classList.add('active');
                button.textContent = 'Đã yêu thích';
            } else {
                button.classList.remove('active');
                button.textContent = 'Yêu thích';
            }
        });
    }

    function updateActiveItem() {
        const items = carouselInner.querySelectorAll('.carousel-item');
        items.forEach((item) => {
            const textElement = item.querySelector('.carousel-text');
            const imageElement = item.querySelector('.carousel-image');
            if (textElement && imageElement) {
                textElement.style.display = 'none';
                imageElement.style.display = 'none';
            }
        });

        const activeItem = carouselInner.querySelector('.carousel-item.active');
        const activeText = activeItem.querySelector('.carousel-text');
        const activeImage = activeItem.querySelector('.carousel-image');
        if (activeText && activeImage) {
            activeText.style.display = 'block';
            activeImage.style.display = 'block';
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');

    if (categoryId) {
        await fetchFeaturedComics(categoryId);
        await fetchComics(categoryId);
    } else {
        console.error("Không có categoryId trong URL.");
    }

    const carousel = document.getElementById('comicCarousel');
    carousel.addEventListener('slid.bs.carousel', function () {
        updateActiveItem();
    });

});