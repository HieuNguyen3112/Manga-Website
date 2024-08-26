document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const comicId = urlParams.get('id');

    if (comicId) {
        fetch(`http://localhost:3000/api/chapters?comicId=${comicId}`)
            .then(response => response.json())
            .then(chapters => {
                const chaptersContainer = document.querySelector('.works-chapter-list');
                chaptersContainer.innerHTML = ''; 

                chapters.forEach(chapter => {
                    const chapterItem = document.createElement('div');
                    chapterItem.className = 'works-chapter-item';

                    const chapterName = document.createElement('div');
                    chapterName.className = 'name-chap';
                    const chapterLink = document.createElement('a');
                    chapterLink.href = "#";
                    chapterLink.textContent = chapter.chapterTitle;
                    chapterName.appendChild(chapterLink);

                    const chapterTime = document.createElement('div');
                    chapterTime.className = 'time-chap';
                    const uploadDate = new Date(chapter.uploadDate);
                    chapterTime.textContent = uploadDate.toLocaleDateString('vi-VN');

                    chapterItem.appendChild(chapterName);
                    chapterItem.appendChild(chapterTime);

                    chaptersContainer.appendChild(chapterItem);

                    // Thêm sự kiện click cho chapterLink để mở modal
                    chapterLink.addEventListener('click', function(event) {
                        event.preventDefault();

                        let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
                        if (token) {
                            // Nếu có token, mở modal để đọc chương
                            createReadModal(chapter.content);
                        } else {
                            showAlert('Vui lòng đăng nhập để đọc truyện.', 'danger');
                        }
                    });
                });
            })
            .catch(error => console.error('Lỗi khi lấy danh sách chương:', error));
    } else {
        console.error('Thiếu comic ID trong URL');
    }

    function showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertBox.style.zIndex = 9999;
        alertBox.innerHTML = `
            <strong>${message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertBox);
        setTimeout(() => {
            alertBox.remove();
        }, 3000);
    }

    function createReadModal(contentUrl) {
        const modalHtml = `
            <div class="modal fade" id="readModal" tabindex="-1" aria-labelledby="readModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="readModalLabel">Đọc Truyện</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <iframe src="${contentUrl}" width="100%" height="600px"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('readModal'));
        modal.show();
    }
});
