document.addEventListener('DOMContentLoaded', () => {
    const favoriteLink = document.querySelector('.nav-link[href="#special"]');
    const collectionList = document.querySelector('.collection-list');
    const paginationContainer = document.getElementById('pagination-container');
    let favoriteComics = [];

    // Gắn sự kiện nhấn vào link "Yêu Thích"
    favoriteLink.addEventListener('click', async (event) => {
        event.preventDefault();
        await fetchFavoriteComics();
    });

    // Hàm lấy danh sách truyện yêu thích của người dùng
    async function fetchFavoriteComics() {
        let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

        try {
            const response = await fetch('http://localhost:8000/v1/user/favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': `Bearer ${token}`
                }
            });

            if (response.ok) {
                favoriteComics = await response.json();
                displayComics(favoriteComics);
            } else {
                console.error('Lỗi khi lấy danh sách truyện yêu thích:', response.statusText);
                alert("Không thể lấy danh sách truyện yêu thích.");
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            alert("Đã xảy ra lỗi khi lấy danh sách truyện yêu thích.");
        }
    }

    // Hàm hiển thị các truyện yêu thích
    function displayComics(comics) {
        collectionList.innerHTML = ''; // Xóa các phần tử hiện tại

        comics.forEach(comicData => {
            const comic = comicData.comicId; // Truy cập đối tượng comic
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
                        <a href="#" class="btn btn-primary mt-3 favorite-btn active" data-comic-id="${comic._id}">
                            <i class="fa-regular fa-heart"></i>
                        </a>
                    </span>
                </div>
            `;
            collectionList.appendChild(box);
        });

        paginationContainer.style.display = 'none'; // Ẩn phân trang vì tất cả các truyện yêu thích đều được hiển thị
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
});
