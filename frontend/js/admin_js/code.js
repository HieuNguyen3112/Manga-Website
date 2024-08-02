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

    // Ẩn modal khi chuyển sang phần khác
    const editModal = document.getElementById("editModal");
    if (editModal) {
        editModal.style.display = 'none';
    }
    const deleteModal = document.getElementById("deleteModal");
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }
}
// Hàm để hiển thị modal
function showEditModal() {
    const editModal = document.getElementById("editModal");
    if (editModal) {
        editModal.style.display = 'flex'; // Hiển thị modal
    }
}

// Hàm để đóng modal
function closeEditModal() {
    const editModal = document.getElementById("editModal");
    if (editModal) {
        editModal.style.display = 'none';
    }
}

// Thêm sự kiện đóng modal khi nhấn nút đóng
const closeModalButton = document.querySelector(".close");
if (closeModalButton) {
    closeModalButton.addEventListener("click", closeEditModal);
}

function showDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }
}

function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }
}

// Thêm sự kiện đóng modal khi nhấn nút đóng
const confirmButton = document.getElementById('confirmDelete');
const cancelButton = document.getElementById('cancelDelete');

if (confirmButton) {
    confirmButton.onclick = () => {
        // Thêm mã xóa truyện ở đây
        closeDeleteModal();
    };
}

if (cancelButton) {
    cancelButton.onclick = closeDeleteModal;
}

// Đóng modal khi nhấn bên ngoài modal
// window.onclick = function(event) {
//     const deleteModal = document.getElementById('deleteModal');
//     if (event.target == deleteModal) {
//         deleteModal.style.display = 'none';
//     }
// }

// Thêm sự kiện cho nút truyện để mở rộng hoặc thu gọn submenu
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
