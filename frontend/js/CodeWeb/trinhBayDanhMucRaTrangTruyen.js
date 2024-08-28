document.addEventListener('DOMContentLoaded', async () => {
    const categoriesUrl = 'http://localhost:3000/api/categories'; // Đường dẫn API lấy danh mục
    const comicsUrl = 'http://localhost:3000/api/comics'; // Đường dẫn API lấy truyện

    // Fetch danh mục từ API
    async function fetchCategories() {
        const response = await fetch(categoriesUrl);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    }

    // Fetch truyện theo danh mục từ API
    async function fetchComicsByCategory(categoryId) {
        const response = await fetch(`${comicsUrl}?category=${categoryId}`);
        if (!response.ok) throw new Error('Failed to fetch comics');
        return await response.json();
    }

    // Tạo phần tử HTML cho từng truyện
    function createComicElement(comic) {
        return `
            <div class="col-md-2 p-2">
                <div class="comic-card text-center position-relative" data-read-link="doc_ngay.html?id=${comic._id}">
                    <img src="${comic.imageUrl}" class="img-fluid comic-image" alt="${comic.title}">
                    <h5 class="mt-2 comic-title">${comic.title}</h5>
                    <div class="comic-info-overlay position-absolute p-3 bg-dark text-white rounded" style="bottom: 0; left: 0; right: 0; display: none; z-index: 2;">
                        <h6>${comic.title}</h6>
                        <p>${comic.description || 'Không có mô tả.'}</p>
                        <button class="btn btn-primary btn-sm mt-2">Đọc sách</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Xóa dữ liệu trước khi thêm mới
    function clearPreviousData() {
        const comicsContainer = document.getElementById('comics-container');
        comicsContainer.innerHTML = ''; // Xóa các phần tử cũ
    }

    // Tạo phần tử HTML cho mỗi danh mục
    function createCategorySection(category, comics) {
        const comicsHtml = comics.map(createComicElement).join('');
        return `
            <section class="category-section mb-5 position-relative">
                <h3 class="category-title">${category.name}</h3>
                <div class="d-flex justify-content-between mt-2 position-relative">
                    <button class="btn btn-light prev-btn position-absolute" style="z-index: 3;">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="btn btn-light next-btn position-absolute" style="z-index: 3;">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="row gx-2 flex-nowrap category-comics overflow-hidden">
                    ${comicsHtml}
                </div>
            </section>
        `;
    }

    // Thêm sự kiện cuộn ngang cho các danh mục
    function addScrollEvents() {
        document.querySelectorAll('.category-section').forEach(section => {
            const container = section.querySelector('.category-comics');
            section.querySelector('.prev-btn').addEventListener('click', () => {
                container.scrollLeft -= container.offsetWidth;
            });
            section.querySelector('.next-btn').addEventListener('click', () => {
                container.scrollLeft += container.offsetWidth;
            });
        });
    }

    // Thêm sự kiện khi người dùng di chuột vào và nhấn vào một truyện
    function addHoverAndClickEvents() {
        document.querySelectorAll('.comic-card').forEach(comicCard => {
            const overlay = comicCard.querySelector('.comic-info-overlay');
            
            comicCard.addEventListener('mouseenter', () => {
                $(overlay).fadeIn(200); // Hiển thị modal mượt mà khi di chuột vào
            });

            comicCard.addEventListener('mouseleave', () => {
                $(overlay).fadeOut(200); // Ẩn modal mượt mà khi di chuột ra
            });

            comicCard.addEventListener('click', () => {
                const readLink = comicCard.dataset.readLink;
                window.location.href = readLink; // Điều hướng đến trang chi tiết truyện
            });
        });
    }

    // Khi người dùng nhấp vào một truyện, modal sẽ mở ra với nội dung tương ứng
    function openComicModal(comic) {
        document.getElementById('comicModalLabel').innerText = comic.title;
        document.getElementById('comicModalImage').src = comic.imageUrl;
        document.getElementById('comicModalDescription').innerText = comic.description;
        document.getElementById('comicModalLink').href = `doc_ngay.html?id=${comic._id}`;
        
        // Mở modal
        const modalElement = document.getElementById('comicModal');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    }


    // Hiển thị danh mục và các truyện tương ứng
    async function displayCategoriesAndComics() {
        try {
            const categories = await fetchCategories();
            clearPreviousData(); // Xóa các dữ liệu cũ trước khi thêm mới
            const categorySections = await Promise.all(categories.map(async category => {
                const comics = await fetchComicsByCategory(category._id);
                return createCategorySection(category, comics);
            }));
            document.getElementById('comics-container').innerHTML = categorySections.join('');
            addScrollEvents();
            addHoverAndClickEvents();
        } catch (error) {
            console.error('Error loading categories and comics:', error);
        }
    }

    displayCategoriesAndComics();
});
