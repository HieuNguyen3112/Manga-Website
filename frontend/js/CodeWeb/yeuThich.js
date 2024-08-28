document.addEventListener('DOMContentLoaded', () => {
    const favoriteLink = document.querySelector('.nav-link[href="#special"]');
    const comicsContainer = document.getElementById('comics-container');
    let favoriteComics = [];
    let comicsPerPage = 6; // Set to 6 comics per row
    let currentPage = 1;
    let totalPages = 1;

    // Event listener for the "Favorite" link
    favoriteLink.addEventListener('click', async (event) => {
        event.preventDefault();

        // Kiểm tra token
        let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        if (!token) {
            // Show a message if no token is found
            showAlert('Vui lòng đăng nhập để sử dụng trang yêu thích.', 'danger');
            return;
        }

        await fetchFavoriteComics(token);
    });

    // Function to fetch the user's favorite comics
    async function fetchFavoriteComics(token) {
        try {
            const response = await fetch('http://localhost:8000/v1/user/favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const comicIds = data.map(item => item.comicId);

                // Fetch details of comics based on comicIds
                const comicDetailsPromises = comicIds.map(id => fetch(`http://localhost:3000/api/comics/${id}`).then(res => res.json()));
                favoriteComics = await Promise.all(comicDetailsPromises);

                // Check if the favoriteComics array is empty
                if (favoriteComics.length === 0) {
                    // Display alert if no favorite comics without clearing the page content
                    showAlert('Bạn chưa có truyện yêu thích nào, hãy thêm truyện yêu thích trước khi truy cập mục này.', 'warning');
                    return;
                }

                totalPages = Math.ceil(favoriteComics.length / comicsPerPage);
                clearPreviousData(); // Clear only if there are comics to show
                displayComics(currentPage); // Display the favorite comics on the first page
            } else {
                console.error('Error fetching favorite comics:', response.statusText);
                showAlert("Không thể lấy danh sách truyện yêu thích.", "danger");
            }
        } catch (error) {
            console.error('An error occurred:', error);
            showAlert("Đã xảy ra lỗi khi lấy danh sách truyện yêu thích.", "danger");
        }
    }

    // Function to clear existing data
    function clearPreviousData() {
        comicsContainer.innerHTML = ''; // Clear current comics in comics-container
    }

    // Function to display favorite comics
    function displayComics(page) {
        const start = (page - 1) * comicsPerPage;
        const end = start + comicsPerPage;
        const comicsToDisplay = favoriteComics.slice(start, end);

        const row = document.createElement('div');
        row.classList.add('row', 'gx-2', 'gy-4'); // Create a row with spacing

        comicsToDisplay.forEach(comic => {
            const comicElement = document.createElement('div');
            comicElement.className = 'col-md-2 p-2'; // Each comic takes up 1/6 of the row
            comicElement.innerHTML = `
                <div class="comic-card position-relative">
                    <img src="${comic.imageUrl}" class="comic-image" alt="${comic.title}" style="cursor: pointer;">
                    <div class="comic-overlay position-absolute p-2 bg-dark text-white rounded" style="display: none; background-color: rgba(0, 0, 0, 0.7); border-radius: 5px;">
                        <h5 class="comic-title">${comic.title}</h5>
                        <a href="doc_ngay.html?id=${comic._id}" class="btn btn-primary btn-sm">Đọc truyện</a>
                    </div>
                </div>
            `;
            row.appendChild(comicElement);
        });

        comicsContainer.appendChild(row);

        addHoverAndClickEvents();
    }

    // Function to add hover and click events
    function addHoverAndClickEvents() {
        document.querySelectorAll('.comic-card').forEach(comicCard => {
            const overlay = comicCard.querySelector('.comic-overlay');

            // Show overlay on hover
            comicCard.addEventListener('mouseenter', () => {
                $(overlay).fadeIn(200);
            });

            // Hide overlay when not hovering
            comicCard.addEventListener('mouseleave', () => {
                $(overlay).fadeOut(200);
            });

            // Navigate to details page when clicking on the image
            comicCard.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') { // Prevent navigation conflict when clicking the "Read" button
                    const readLink = e.currentTarget.querySelector('a').href;
                    window.location.href = readLink;
                }
            });
        });
    }

    // Function to display alerts
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
});
