document.addEventListener('DOMContentLoaded', function() {
    // Lấy comicId từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const comicId = urlParams.get('id');

    if (comicId) {
        // Gọi API để lấy danh sách các chương dựa trên comicId
        fetch(`http://localhost:3000/api/chapters?comicId=${comicId}`)
            .then(response => response.json())
            .then(chapters => {
                const chaptersContainer = document.querySelector('.works-chapter-list');
                chaptersContainer.innerHTML = ''; // Xóa nội dung cũ

                // Duyệt qua từng chương và thêm vào danh sách
                chapters.forEach(chapter => {
                    const chapterItem = document.createElement('div');
                    chapterItem.className = 'works-chapter-item';
                    
                    const chapterName = document.createElement('div');
                    chapterName.className = 'name-chap';
                    const chapterLink = document.createElement('a');
                    chapterLink.href = chapter.content; // Sử dụng đường dẫn PDF từ MongoDB
                    chapterLink.target = '_blank'; // Mở file PDF trong tab mới
                    chapterLink.textContent = chapter.chapterTitle;
                    chapterName.appendChild(chapterLink);
                    
                    const chapterTime = document.createElement('div');
                    chapterTime.className = 'time-chap';
                    const uploadDate = new Date(chapter.uploadDate);
                    chapterTime.textContent = uploadDate.toLocaleDateString('vi-VN');

                    chapterItem.appendChild(chapterName);
                    chapterItem.appendChild(chapterTime);

                    chaptersContainer.appendChild(chapterItem);
                });
            })
            .catch(error => console.error('Lỗi khi lấy danh sách chương:', error));
    } else {
        console.error('Thiếu comic ID trong URL');
    }
});
