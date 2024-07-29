
// Hiển thị tổng quan mặc định khi trang tải
// window.onload = function() {
//     showSection('tongquan');
// };

function showSection(section) {
    // Ẩn tất cả các phần
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.add('hidden'));

    // Hiện phần được chọn
    const selectedSection = document.getElementById(section);
    selectedSection.classList.remove('hidden');

    // Ẩn modal khi chuyển sang phần khác
    const editModal = document.getElementById("editModal");
    editModal.style.display = 'none';
}

// Hàm để hiển thị modal
function showEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = 'flex'; // Hiển thị modal
}

// Hàm để đóng modal
function closeEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = 'none';
}

// Thêm sự kiện đóng modal khi nhấn nút đóng
const closeModalButton = document.querySelector(".close");
closeModalButton.addEventListener("click", closeEditModal);

