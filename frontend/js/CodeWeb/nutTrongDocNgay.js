document.addEventListener('DOMContentLoaded', () => {
    const readFromStartButton = document.querySelector('.li01 a');
    const subscribeButton = document.querySelector('.li02 a');
    const likeButton = document.querySelector('.li03 a');

    let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    // Hàm hiển thị thông báo
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

    // Hàm kiểm tra đăng nhập và hiển thị thông báo nếu chưa đăng nhập
    function checkLoginAndExecute(callback) {
        if (!token) {
            showAlert('Vui lòng đăng nhập để thực hiện chức năng này.', 'danger');
        } else {
            callback();
        }
    }

    // Nút "Đọc từ đầu"
    readFromStartButton.addEventListener('click', (event) => {
        event.preventDefault();
        checkLoginAndExecute(async () => {
            const comicId = new URLSearchParams(window.location.search).get('id');
            if (!comicId) {
                showAlert('Không tìm thấy mã truyện.', 'danger');
                return;
            }
            try {
                const response = await fetch(`http://localhost:3000/api/chapters?comicId=${comicId}`);
                const chapters = await response.json();
                if (chapters.length > 0) {
                    // Hiển thị chương đầu tiên trong modal
                    const chapterContent = document.getElementById('chapterContent');
                    chapterContent.src = chapters[0].content; // Chèn đường dẫn chương vào iframe
                    const chapterModal = new bootstrap.Modal(document.getElementById('chapterModal'));
                    chapterModal.show(); // Hiển thị modal
                } else {
                    showAlert('Không có chương nào cho truyện này.', 'danger');
                }
            } catch (error) {
                console.error('Lỗi khi tải chương:', error);
                showAlert('Đã xảy ra lỗi khi tải chương đầu tiên.', 'danger');
            }
        });
    });

    // Nút "Theo dõi"
    subscribeButton.addEventListener('click', (event) => {
        event.preventDefault();
        checkLoginAndExecute(async () => {
            const comicId = new URLSearchParams(window.location.search).get('id');
            try {
                const favoriteResponse = await fetch(`http://localhost:3000/v1/user/favorites`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': `Bearer ${token}` // Đảm bảo rằng token được gửi đúng cách
                    }
                });

                if (favoriteResponse.ok) {
                    const favoriteComics = await favoriteResponse.json();
                    const isFavorite = favoriteComics.some(item => item.comicId === comicId);

                    if (isFavorite) {
                        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
                        confirmModal.show();

                        document.getElementById('confirmDelete').addEventListener('click', async () => {
                            confirmModal.hide();
                            const unfollowResponse = await fetch(`http://localhost:3000/v1/user/favorites/remove`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Token': `Bearer ${token}`
                                },
                                body: JSON.stringify({ comicId })
                            });

                            if (unfollowResponse.ok) {
                                showAlert('Bạn đã hủy theo dõi truyện này.', 'info');
                            } else {
                                showAlert('Không thể hủy theo dõi truyện.', 'danger');
                            }
                        });
                    } else {
                        const response = await fetch(`http://localhost:3000/v1/user/favorites/add`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Token': `Bearer ${token}`
                            },
                            body: JSON.stringify({ comicId })
                        });

                        if (response.ok) {
                            showAlert('Truyện đã được thêm vào danh sách yêu thích của bạn.', 'success');
                        } else {
                            showAlert('Không thể thêm truyện vào danh sách yêu thích.', 'danger');
                        }
                    }
                } else {
                    showAlert('Không thể kiểm tra trạng thái theo dõi.', 'danger');
                }
            } catch (error) {
                console.error('Lỗi khi theo dõi:', error);
                showAlert('Đã xảy ra lỗi khi thêm vào danh sách yêu thích.', 'danger');
            }
        });
    });

    // Nút "Thích"
    likeButton.addEventListener('click', (event) => {
        event.preventDefault();
        checkLoginAndExecute(async () => {
            const comicId = new URLSearchParams(window.location.search).get('id');
            try {
                const comicData = await fetch(`http://localhost:3000/api/comics/${comicId}`).then(res => res.json());
                const likes = comicData.likes || 0;
                const isLiked = likeButton.classList.contains('liked');

                if (!isLiked) {
                    await fetch(`http://localhost:3000/api/comics/${comicId}/like`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Token': `Bearer ${token}`
                        }
                    });
                    likeButton.classList.add('liked');
                    likeButton.querySelector('i').classList.add('text-primary');
                    showAlert('Bạn đã thích truyện này.', 'success');
                } else {
                    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
                    confirmModal.show();

                    document.getElementById('confirmDelete').addEventListener('click', async () => {
                        confirmModal.hide();
                        await fetch(`http://localhost:3000/api/comics/${comicId}/dislike`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Token': `Bearer ${token}`
                            }
                        });
                        likeButton.classList.remove('liked');
                        likeButton.querySelector('i').classList.remove('text-primary');
                        showAlert('Bạn đã hủy thích truyện này.', 'info');
                    });
                }
            } catch (error) {
                console.error('Lỗi khi xử lý lượt thích:', error);
                showAlert('Đã xảy ra lỗi khi xử lý lượt thích.', 'danger');
            }
        });
    });
});
