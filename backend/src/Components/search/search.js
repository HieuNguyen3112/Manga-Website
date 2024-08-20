document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        try {
            // Đảm bảo rằng URL API khớp với route server
            const response = await fetch(`http://localhost:3000/api/comics/search?search=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const comics = await response.json();
            displaySearchResults(comics);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
        }
    }
});

function displaySearchResults(comics) {
    const collectionDiv = document.querySelector('.collection-list');
    collectionDiv.innerHTML = ''; // Xóa các kết quả cũ

    comics.forEach(comic => {
        const comicHtml = `
            <div class="col-md-6 col-lg-4 col-xl-3 p-2">
                <div class="collection-img position-relative">
                    <img src="${comic.image}" class="w-100 img-fluid custom-img">
                </div>
                <div class="text-center">
                    <div class="rating mt-3">
                        ${'<span class="text-primary"><i class="fas fa-star"></i></span>'.repeat(comic.rating)}
                    </div>
                    <div class="text-center">
                        <p class="text-capitalize fw-bold">${comic.title}</p>
                        <span class="fw-bold d-block">
                            <a href="/doc_ngay.html?id=${comic._id}" class="btn btn-primary mt-3">Đọc ngay</a>
                            <a href="#" class="btn btn-primary mt-3"><i class="fa-regular fa-heart"></i></a>
                        </span>
                    </div>
                </div>
            </div>
        `;
        collectionDiv.insertAdjacentHTML('beforeend', comicHtml);
    });

    // Đóng modal sau khi hiển thị kết quả
    const modalElement = document.getElementById('searchModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }
}
