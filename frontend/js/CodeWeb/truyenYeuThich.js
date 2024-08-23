async function toggleFavoriteComic(comicId) {
    try {
        // Lấy token từ localStorage hoặc sessionStorage
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

        // Nếu không có token thì yêu cầu người dùng đăng nhập
        if (!token) {
            alert("Vui lòng đăng nhập để thêm truyện vào danh sách yêu thích.");
            return;
        }

        // Giải mã token để lấy userId
        const decodedToken = parseJwt(token);
        const userId = decodedToken?.id; // Lấy id từ token đã giải mã

        if (!userId) {
            alert("Không thể xác định người dùng. Vui lòng thử lại.");
            return;
        }

        const response = await fetch('http://localhost:8000/v1/user/favorites/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': `Bearer ${token}`, 
            },
            body: JSON.stringify({ userId, comicId }),
        });

        if (!response.ok) {
            throw new Error('Có lỗi xảy ra trong quá trình xử lý yêu cầu.');
        }

        const data = await response.json();
        console.log('Danh sách truyện yêu thích được cập nhật:', data.favoriteComics);

        // Cập nhật UI sau khi thêm/xóa truyện yêu thích
        updateFavoriteIcon(comicId, data.isFavorite);

        // Cập nhật số lượng truyện yêu thích trên biểu tượng trái tim
        updateFavoriteCount(data.favoriteComics.length);

    } catch (err) {
        console.error('Lỗi khi thêm truyện vào danh sách yêu thích:', err);
    }
}

// Hàm giải mã token JWT
function parseJwt(token) {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Cập nhật biểu tượng yêu thích
function updateFavoriteIcon(comicId, isFavorite) {
    const iconElement = document.querySelector(`[data-comic-id="${comicId}"] i.fa-heart`);
    if (iconElement) {
        if (isFavorite) {
            iconElement.classList.add('text-danger'); // Đổi màu thành đỏ khi yêu thích
        } else {
            iconElement.classList.remove('text-danger'); // Trả lại màu ban đầu khi bỏ yêu thích
        }
    }
}

// Cập nhật số lượng truyện yêu thích trên biểu tượng trái tim
function updateFavoriteCount(count) {
    const heartBadge = document.querySelector('.btn1 .badge');
    if (heartBadge) {
        heartBadge.textContent = count;
    }
}

// Thêm sự kiện click cho các nút yêu thích
document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const comicId = this.dataset.comicId;
        toggleFavoriteComic(comicId);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Gắn sự kiện sau khi trang tải xong
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const comicId = this.dataset.comicId;
            toggleFavoriteComic(comicId);
        });
    });
});
