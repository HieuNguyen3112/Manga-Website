document.addEventListener('DOMContentLoaded', function () {
    const memberTableBody = document.getElementById('memberTableBody');

    async function fetchAllUsers() {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error("Không tìm thấy token, chuyển hướng đến trang chủ...");
            window.location.href = "/frontend/Trang_truyen.html";
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/v1/user', {
                method: 'GET',
                headers: {
                    'Token': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const users = await response.json();
                console.log(users); // Kiểm tra dữ liệu trả về từ API
                populateUserTable(users);
            } else {
                console.error('Lấy thông tin người dùng thất bại');
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    }

    function populateUserTable(users) {
        memberTableBody.innerHTML = '';  // Xóa nội dung hiện có
        users.forEach(user => {
            const row = document.createElement('tr');

            // Cột tên người dùng
            const usernameCell = document.createElement('td');
            usernameCell.textContent = user.username;
            row.appendChild(usernameCell);

            // Cột email
            const emailCell = document.createElement('td');
            emailCell.textContent = user.email;
            row.appendChild(emailCell);

            // Cột ngày đăng ký
            const registrationDateCell = document.createElement('td');
            if (user.createdAt) {
                const registrationDate = new Date(user.createdAt);
                if (!isNaN(registrationDate.getTime())) {
                    registrationDateCell.textContent = registrationDate.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                } else {
                    registrationDateCell.textContent = 'Không xác định';
                }
            } else {
                registrationDateCell.textContent = 'Không xác định';
            }
            row.appendChild(registrationDateCell);

            // Cột vai trò
            const roleCell = document.createElement('td');
            roleCell.textContent = user.admin && user.admin === true ? 'Admin' : 'Độc giả';
            row.appendChild(roleCell);

            memberTableBody.appendChild(row);
        });
    }

    fetchAllUsers();
});
