document.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const comicId = urlParams.get('id');

        if (!comicId) {
            console.error('Không tìm thấy ID truyện!');
            return;
        }

        const response = await fetch(`http://localhost:3000/api/comics/${comicId}`);
        const comic = await response.json();

        if (!comic || !comic.title) {
            console.error('Không tìm thấy thông tin truyện');
            return;
        }

        // Thay thế nội dung nếu phần tử tồn tại
        const titleElement = document.querySelector('.title-fluid');
        if (titleElement) {
            titleElement.textContent = comic.title;
        }

        const imageElement = document.querySelector('.main_image img');
        if (imageElement) {
            imageElement.src = comic.image;
        }

        const authorElement = document.querySelector('.author .col-xs-9');
        if (authorElement) {
            authorElement.textContent = comic.author;
        }

        const statusElement = document.querySelector('.status .col-xs-9');
        if (statusElement) {
            statusElement.textContent = comic.status;
        }

        const likesElement = document.querySelector('.number-like');
        if (likesElement) {
            likesElement.textContent = comic.likes || 0;
        }

        const viewsElement = document.querySelector('.fa-eye').nextElementSibling;
        if (viewsElement) {
            viewsElement.textContent = comic.views || 0;
        }

        const descriptionElement = document.querySelector('.gioi_thieu + div');
        if (descriptionElement) {
            descriptionElement.textContent = comic.description;
        }

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
    }
});
