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
});

// Hiển thị modal chỉnh sửa
function showEditModal() {
    const editModal = document.getElementById("editModal");
    if (editModal) {
        editModal.style.display = 'flex';
    }
}

// Đóng modal chỉnh sửa
function closeEditModal() {
    const editModal = document.getElementById("editModal");
    if (editModal) {
        editModal.style.display = 'none';
    }
}

// Hiển thị modal xóa
function showDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.display = 'flex';
    }
}

// Đóng modal xóa
function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.display = 'none';
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
