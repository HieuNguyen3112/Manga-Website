// Hiển thị tổng quan mặc định khi trang tải
window.onload = function() {
    showSection('tongquan');
};

// Hàm để hiển thị hoặc ẩn các phần
function showSection(section) {
    // Ẩn tất cả các phần
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.add('hidden'));

    // Hiện phần được chọn
    const selectedSection = document.getElementById(section);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }

    // Ẩn các modal khi chuyển sang phần khác
    closeEditModal();
    closeDeleteModal();
    closeAddChapterModal();
    closeEditChapterModal();
    closeDeleteChapterModal();
}

// Đảm bảo modal bị ẩn khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    const editModal = document.getElementById("editModal");
    if (editModal) {
        editModal.style.display = 'none';
    }

    const deleteModal = document.getElementById("deleteModal");
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }

    const addChapterModal = document.getElementById("addChapterModal");
    if (addChapterModal) {
        addChapterModal.style.display = 'none';
    }

    const editChapterModal = document.getElementById("editChapterModal");
    if (editChapterModal) {
        editChapterModal.style.display = 'none';
    }

    const deleteChapterModal = document.getElementById("deleteChapterModal");
    if (deleteChapterModal) {
        deleteChapterModal.style.display = 'none';
    }
});
function closeEditModal() {
    const editModal = document.getElementById("editModal");
    if (editModal) {
        editModal.style.display = 'none';
    }
}
function closeDeleteModal() {
    const deleteModal = document.getElementById("deleteModal");
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }
}

// Hiển thị modal chỉnh sửa chương
function showEditChapterModal() {
    const editChapterModal = document.getElementById("editChapterModal");
    if (editChapterModal) {
        editChapterModal.style.display = 'flex';
    }
}

// Đóng modal chỉnh sửa chương
function closeEditChapterModal() {
    const editChapterModal = document.getElementById("editChapterModal");
    if (editChapterModal) {
        editChapterModal.style.display = 'none';
    }
}

// Hiển thị modal xóa chương
function showDeleteChapterModal() {
    const deleteChapterModal = document.getElementById('deleteChapterModal');
    if (deleteChapterModal) {
        deleteChapterModal.style.display = 'flex';
    }
}

// Đóng modal xóa chương
function closeDeleteChapterModal() {
    const deleteChapterModal = document.getElementById('deleteChapterModal');
    if (deleteChapterModal) {
        deleteChapterModal.style.display = 'none';
    }
}

// Hiển thị modal thêm chương
function showAddChapterModal() {
    const modal = document.getElementById('addChapterModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Đóng modal thêm chương
function closeAddChapterModal() {
    const modal = document.getElementById('addChapterModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Sự kiện cho nút đóng của các modal
document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', () => {
        closeEditModal();
        closeDeleteModal();
        closeAddChapterModal();
        closeEditChapterModal();
        closeDeleteChapterModal();
    });
});

// Đóng modal khi nhấn bên ngoài modal
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
};

// Sự kiện mở rộng hoặc thu gọn submenu
document.querySelector('.toggle-menu').addEventListener('click', function(event) {
    event.preventDefault();
    const submenu = document.querySelector('.submenu');
    const arrow = document.querySelector('.arrow');

    if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
        arrow.classList.remove('down');
        arrow.classList.add('up');
    } else {
        submenu.classList.add('hidden');
        arrow.classList.remove('up');
        arrow.classList.add('down');
    }
});

// Hiển thị dropdown người dùng
document.addEventListener('DOMContentLoaded', function() {
    var userDropdown = document.querySelector('.user-dropdown span');
    var dropdownContent = document.querySelector('.dropdown-content');

    userDropdown.addEventListener('click', function() {
        dropdownContent.classList.toggle('show');
    });

    // Đóng dropdown khi nhấp ra ngoài
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.user-dropdown span')) {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    });
});

// Cập nhật thông tin thống kê khi tải trang
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/stats');
        const stats = await response.json();

        document.querySelector('#total-comics').textContent = stats.totalComics;
        document.querySelector('#total-likes').textContent = stats.totalLikes;
        document.querySelector('#total-views').textContent = stats.totalViews;
        document.querySelector('#total-members').textContent = stats.totalMembers;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
    }
});
