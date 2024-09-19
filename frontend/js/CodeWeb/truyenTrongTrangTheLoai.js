document.addEventListener('DOMContentLoaded', async () => {
    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');
    const collectionList = document.getElementById('comics-container');

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

            // Create a row and add comics in columns
            let row = '<div class="row gx-3 gy-3">'; // Create a new row with spacing
            filteredComics.forEach((comic, index) => {
                row += `
                    <div class="col-2 p-2"> <!-- Create column with col-2 for each comic -->
                        <div class="comic-card position-relative">
                            <img src="${comic.imageUrl}" class="comic-image" alt="${comic.title}">
                            <div class="comic-overlay position-absolute p-2">
                                <h5 class="comic-title">${comic.title}</h5>
                                <a href="doc_ngay.html?id=${comic._id}" class="btn btn-primary btn-sm">Đọc sách</a>
                            </div>
                        </div>
                    </div>
                `;

                // Close the row and open a new row after every 6 comics
                if ((index + 1) % 6 === 0) {
                    row += '</div><div class="row gx-3 gy-3">';
                }
            });
            row += '</div>'; // Close the last row

            collectionList.innerHTML = row; // Update the content with the new layout
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
