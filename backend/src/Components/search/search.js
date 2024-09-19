document.addEventListener('DOMContentLoaded', function () {
    // Khai báo biến cho số lượng truyện trên mỗi trang
    const comicsPerPage = 12;
    let totalPages = 1;
    let currentPage = 1;

    // Khai báo biến để kiểm soát trạng thái của thanh tìm kiếm
    let isSearchVisible = false;

    // Lưu trữ bố cục ban đầu để phục hồi sau khi xóa tìm kiếm
    const initialLayout = document.getElementById('comics-container').innerHTML;

    document.getElementById('searchIcon').addEventListener('click', () => {
        const searchBarContainer = document.getElementById('searchBarContainer');
        
        if (isSearchVisible) {
            searchBarContainer.style.display = 'none';
            isSearchVisible = false;
        } else {
            searchBarContainer.style.display = 'flex';
            document.getElementById('searchInput').focus(); // Đặt focus vào thanh tìm kiếm khi hiện lên
            isSearchVisible = true;
        }
    });

    // Ẩn thanh tìm kiếm khi nhấp ra ngoài
    document.addEventListener('click', function(event) {
        const searchBarContainer = document.getElementById('searchBarContainer');
        const searchIcon = document.getElementById('searchIcon');
        
        if (isSearchVisible && !searchBarContainer.contains(event.target) && !searchIcon.contains(event.target)) {
            searchBarContainer.style.display = 'none';
            isSearchVisible = false;
        }
    });

    // Sự kiện khi người dùng gõ trong ô tìm kiếm
    document.getElementById('searchInput').addEventListener('input', async () => {
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            try {
                const response = await fetch(`http://localhost:3000/api/comics/search?search=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const comics = await response.json();
                if (comics.length > 0) {
                    totalPages = Math.ceil(comics.length / comicsPerPage);
                    clearPreviousData(); // Xóa các dữ liệu cũ trước khi hiển thị kết quả tìm kiếm
                    displaySearchResults(comics, 1); // Hiển thị kết quả từ trang 1
                } else {
                    clearPreviousData(); // Xóa kết quả tìm kiếm hiện tại nếu không tìm thấy
                }
            } catch (error) {
                console.error('Lỗi khi tìm kiếm:', error);
            }
        } else {
            resetToInitialLayout(); // Phục hồi bố cục ban đầu nếu ô tìm kiếm rỗng
        }
    });

    // Sự kiện khi người dùng nhấn Enter trong ô tìm kiếm
    document.getElementById('searchInput').addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            const query = document.getElementById('searchInput').value.trim();
            if (query) {
                try {
                    const response = await fetch(`http://localhost:3000/api/comics/search?search=${encodeURIComponent(query)}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const comics = await response.json();
                    if (comics.length === 0) {
                        displayNoResultsMessage(); // Hiển thị thông báo không tìm thấy truyện khi nhấn Enter
                    }
                } catch (error) {
                    console.error('Lỗi khi tìm kiếm:', error);
                }
            } else {
                window.location.reload(); // Refresh lại trang để hiển thị bố cục ban đầu
            }
        }
    });

    function clearPreviousData() {
        const comicsContainer = document.getElementById('comics-container');
        const paginationContainer = document.getElementById('pagination-container');
        const loadMoreButton = document.getElementById('load-more-button');

        if (comicsContainer) {
            comicsContainer.innerHTML = ''; // Xóa các kết quả cũ trong comicsContainer
        }
        if (paginationContainer) {
            paginationContainer.innerHTML = ''; // Xóa phân trang hiện tại nếu phần tử tồn tại
        }
        if (loadMoreButton) {
            loadMoreButton.style.display = 'none'; // Ẩn nút "Xem thêm nhiều truyện" nếu phần tử tồn tại
        }
    }

    function createComicElement(comic) {
        return `
            <div class="col-2 p-2">
                <div class="comic-card position-relative" data-read-link="doc_ngay.html?id=${comic._id}">
                    <img src="${comic.imageUrl}" class="w-100 img-fluid custom-img" alt="${comic.title}" style="cursor: pointer;">
                    <div class="comic-overlay position-absolute p-2">
                        <h5 class="comic-title">${comic.title}</h5>
                        <a href="doc_ngay.html?id=${comic._id}" class="btn btn-primary btn-sm">Đọc truyện</a>
                    </div>
                </div>
            </div>
        `;
    }

    function displaySearchResults(comics, page) {
        const comicsContainer = document.getElementById('comics-container');
        if (!comicsContainer) return; // Thoát nếu phần tử không tồn tại
    
        const start = (page - 1) * comicsPerPage;
        const end = start + comicsPerPage;
        const comicsToDisplay = comics.slice(start, end);
    
        // Thêm hoạt ảnh mượt mà cho quá trình hiển thị kết quả
        comicsContainer.classList.add('fade'); // Thêm hiệu ứng fade
        comicsContainer.classList.add('comics-container'); // Thêm lớp tạo khoảng cách
        comicsContainer.style.opacity = 0; // Đặt opacity ban đầu để hoạt ảnh bắt đầu từ đây
    
        setTimeout(() => {
            let row = '<div class="row gx-0 gy-3">'; // Thêm hàng để chứa các truyện
            comicsToDisplay.forEach((comic, index) => {
                row += createComicElement(comic);
                // Nếu đủ 6 truyện thì đóng hàng và mở hàng mới
                if ((index + 1) % 6 === 0) {
                    row += '</div><div class="row gx-0 gy-3">';
                }
            });
            row += '</div>'; // Đóng hàng cuối cùng
    
            comicsContainer.innerHTML = row; // Cập nhật nội dung
            comicsContainer.style.opacity = 1; // Đặt opacity về 1 sau khi cập nhật xong
            addHoverAndClickEvents(); // Thêm các sự kiện hover và click vào mỗi truyện
        }, 200); // Độ trễ để hoạt ảnh mượt mà hơn
    }
    

    // Hàm hiển thị thông báo không tìm thấy kết quả và tự động refresh trang
    function displayNoResultsMessage() {
        const noResultsModal = new bootstrap.Modal(document.getElementById('noResultsModal'));
        noResultsModal.show();

        setTimeout(() => {
            window.location.reload();
        }, 5000); // Trang sẽ tự động refresh sau 5 giây
    }

    // Thêm các sự kiện hover và click vào mỗi truyện
    function addHoverAndClickEvents() {
        document.querySelectorAll('.comic-card').forEach(comicCard => {
            const overlay = comicCard.querySelector('.comic-overlay');
            const readLink = comicCard.dataset.readLink;

            // Hiển thị overlay khi di chuột vào
            comicCard.addEventListener('mouseenter', () => {
                $(overlay).fadeIn(200);
            });

            // Ẩn overlay khi di chuột ra
            comicCard.addEventListener('mouseleave', () => {
                $(overlay).fadeOut(200);
            });

            // Điều hướng đến trang chi tiết khi nhấn vào ảnh
            comicCard.querySelector('img').addEventListener('click', () => {
                window.location.href = readLink;
            });

            // Điều hướng đến trang chi tiết khi nhấn vào thẻ chứa
            comicCard.addEventListener('click', () => {
                window.location.href = readLink;
            });
        });
    }
});
