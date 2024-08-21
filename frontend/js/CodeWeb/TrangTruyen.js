document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Lấy dữ liệu truyện từ API
        const response = await fetch('http://localhost:3000/api/comics');
        const comics = await response.json();

        // Kiểm tra dữ liệu trả về
        if (!comics || comics.length === 0) {
            console.error('Không có dữ liệu truyện nào!');
            return;
        }

        // Chọn phần tử HTML để thêm nội dung
        const collectionList = document.querySelector('.collection-list');

        // Lấy tất cả các khung dữ liệu mẫu
        const sampleBoxes = Array.from(collectionList.children);

        // Cập nhật khung dữ liệu với dữ liệu động
        comics.forEach((comic, index) => {
            if (index < sampleBoxes.length) {
                // Cập nhật các khung dữ liệu mẫu với nội dung
                sampleBoxes[index].innerHTML = `
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
                            <a href="#" class="btn btn-primary mt-3 "><i class="fa-regular fa-heart"></i></a>
                        </span>
                    </div>
                `;
            } else {
                // Nếu số lượng truyện lớn hơn số khung, thêm khung mới
                const newBox = document.createElement('div');
                newBox.classList.add('col-md-6', 'col-lg-4', 'col-xl-3', 'p-2');
                newBox.innerHTML = `
                    <div class="collection-img position-relative">
                        <img src="${comic.image}" class="w-100 img-fluid custom-img" alt="${comic.title}">
                        ${comic.status === 'Đang cập nhật' ? '<span class="position-absolute bg-primary text-white d-flex align-items-center justify-content-center">New</span>' : ''}
                    </div>
                    <div class="text-center">
                        <div class="rating mt-3">
                            ${generateRatingHtml(comic.rating)}
                        </div>
                        <p class="text-capitalize fw-bold">${comic.title}</p>
                        <span class="fw-bold d-block">
                            <a href="doc_ngay.html?id=${comic._id}" class="btn btn-primary mt-3">Đọc ngay</a>
                            <a href="#" class="btn btn-primary mt-3 "><i class="fa-regular fa-heart"></i></a>
                        </span>
                    </div>
                `;
                collectionList.appendChild(newBox);
            }
        });

        // Xóa các khung trống còn lại nếu số lượng truyện ít hơn số khung
        if (comics.length < sampleBoxes.length) {
            for (let i = comics.length; i < sampleBoxes.length; i++) {
                collectionList.removeChild(sampleBoxes[i]);
            }
        }

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
    }
});

// Hàm để tạo HTML cho đánh giá sao
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
