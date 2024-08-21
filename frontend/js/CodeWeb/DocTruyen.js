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

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
    }
});
