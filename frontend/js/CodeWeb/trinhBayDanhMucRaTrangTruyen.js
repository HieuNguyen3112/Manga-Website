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
            <div class="col-md-3">
                <div class="comic-card">
                    <img src="${comic.imageUrl}" class="img-fluid" alt="${comic.title}">
                    <h5 class="mt-2">${comic.title}</h5>
                </div>
            </div>
        `;
    }

    // Tạo phần tử HTML cho mỗi danh mục
    function createCategorySection(category, comics) {
        const comicsHtml = comics.map(createComicElement).join('');
        return `
            <section class="category-section mb-5">
                <h3 class="category-title">${category.name}</h3>
                <div class="row g-2 flex-nowrap category-comics overflow-auto">
                    ${comicsHtml}
                </div>
                <div class="d-flex justify-content-between mt-2">
                    <button class="btn btn-light prev-btn">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="btn btn-light next-btn">
                        <i class="fas fa-chevron-right"></i>
                    </button>
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

    // Hiển thị danh mục và các truyện tương ứng
    async function displayCategoriesAndComics() {
        try {
            const categories = await fetchCategories();
            const categorySections = await Promise.all(categories.map(async category => {
                const comics = await fetchComicsByCategory(category._id);
                return createCategorySection(category, comics);
            }));
            document.getElementById('comics-container').innerHTML = categorySections.join('');
            addScrollEvents();
        } catch (error) {
            console.error('Error loading categories and comics:', error);
        }
    }

    displayCategoriesAndComics();
});
