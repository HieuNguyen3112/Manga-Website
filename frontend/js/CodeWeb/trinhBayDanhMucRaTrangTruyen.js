document.addEventListener('DOMContentLoaded', async () => {
    const categoriesUrl = 'http://localhost:3000/api/categories'; // Đường dẫn API lấy danh mục
    const comicsUrl = 'http://localhost:3000/api/comics'; // Đường dẫn API lấy truyện

    // Fetch danh mục từ API
    async function fetchCategories() {
        const response = await fetch(categoriesUrl);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    }

    // Fetch truyện từ API
    async function fetchComics() {
        const response = await fetch(comicsUrl);
        if (!response.ok) throw new Error('Failed to fetch comics');
        return await response.json();
    }

    // Tạo phần tử HTML cho từng truyện
    function createComicElement(comic) {
        return `
             <div class="col-md-2 p-2">
                                    <div class="comic-card position-relative">
                                    <img src="${comic.imageUrl}" class="comic-image" alt="${comic.title}">
                            <div class="comic-overlay position-absolute p-2">
                                        <h5 class="comic-title">${comic.title}</h5>
                        <a href="doc_ngay.html?id=${comic._id}" class="btn btn-primary btn-sm">Đọc sách</a>
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

    // Hiển thị danh mục và các truyện tương ứng
    async function displayCategoriesAndComics() {
        try {
            const categories = await fetchCategories();
            const comics = await fetchComics(); // Fetch all comics once
            
            clearPreviousData(); // Xóa các dữ liệu cũ trước khi thêm mới
            
            // Iterate over each category and filter comics that include the category ID
            const categorySections = categories.map(category => {
                const comicsInCategory = comics.filter(comic => comic.category.includes(category._id));
                return createCategorySection(category, comicsInCategory);
            });

            document.getElementById('comics-container').innerHTML = categorySections.join('');
            addScrollEvents();
            addHoverAndClickEvents();
        } catch (error) {
            console.error('Error loading categories and comics:', error);
        }
    }

    displayCategoriesAndComics();
});
