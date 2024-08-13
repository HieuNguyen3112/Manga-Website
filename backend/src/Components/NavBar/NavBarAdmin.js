// Kiểm tra trạng thái đăng nhập và cập nhật giao diện admin
document.addEventListener('DOMContentLoaded', function() {
    const accountMenuText = document.querySelector('.user-dropdown .additional-buttons span');
    const logoutButton = document.querySelector('.user-dropdown .additional-buttons button:last-child');

    if (accountMenuText && logoutButton) {
        checkAdminLoginStatus(accountMenuText, logoutButton);
    } else {
        console.error("Required DOM elements not found");
    }
});

async function checkAdminLoginStatus(accountMenuText, logoutButton) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.log("No token found in localStorage");
        window.location.href = "/frontend/pages/login.html"; // Điều hướng đến trang đăng nhập nếu không có token
        return;
    }

    console.log("Token:", token); // In token ra console

    try {
        const user = await fetchAdminData(token);
        console.log("Admin data:", user);

        if (user && user.username) {
            accountMenuText.textContent = `Chào ${user.username}`;
            logoutButton.style.display = "inline-block"; // Hiện nút logout khi có token
            logoutButton.onclick = async function(event) {
                event.preventDefault();
                await handleAdminLogout(true);
            };
        } else {
            console.error("User data not found or invalid.");
            handleAdminLogout(true); // Đăng xuất nếu không lấy được thông tin người dùng
        }
    } catch (err) {
        console.error("Error fetching admin data:", err);
        alert("Có lỗi xảy ra khi lấy thông tin admin.");
        handleAdminLogout(true); // Đăng xuất và điều hướng nếu không thể lấy thông tin admin
    }
}

async function fetchAdminData(token) {
    const response = await fetch('http://localhost:8000/v1/user/me', { 
        method: "GET",
        headers: {
            "Token": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            console.error("Unauthorized: Invalid token.");
            throw new Error("Unauthorized");
        } else {
            throw new Error("Failed to fetch admin data");
        }
    }

    const data = await response.json();

    // Kiểm tra xem data có chứa thông tin user hợp lệ không
    if (!data || !data.username) {
        throw new Error("Invalid user data");
    }

    return data;
}

async function handleAdminLogout(redirect) {
    const token = localStorage.getItem("accessToken");

    try {
        const response = await fetch('http://localhost:8000/v1/auth/logout', {
            method: 'POST',
            headers: {
                "Token": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            console.log("Logged out successfully");

            // Xóa token từ localStorage
            localStorage.removeItem("accessToken");

            // Điều hướng sau khi đăng xuất
            if (redirect) {
                window.location.href = "/frontend/Trang_truyen.html"; // Điều hướng đến trang login
            }

        } else {
            console.error("Logout failed");
            alert("Đăng xuất thất bại, vui lòng thử lại.");
        }
    } catch (error) {
        console.error("Error logging out:", error);
        alert("Đã xảy ra lỗi khi đăng xuất.");
    }
}
