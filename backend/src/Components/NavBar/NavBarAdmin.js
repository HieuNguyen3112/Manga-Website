// Hàm làm mới token
async function refreshToken() {
    try {
        const response = await fetch('http://localhost:8000/v1/auth/refresh', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Token refreshed:", data.accessToken);
            saveToken(data.accessToken);  // Lưu token mới ngay sau khi làm mới
            return data.accessToken;  // Trả về token mới
        } else {
            console.error("Failed to refresh token");
            throw new Error("Failed to refresh token");
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}

// Hàm giải mã JWT token
function parseJwt(token) {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Kiểm tra trạng thái đăng nhập và cập nhật giao diện admin
document.addEventListener('DOMContentLoaded', function() {
    const accountMenuText = document.querySelector('.account-box .account-info .account-name');
    const logoutLink = document.querySelector('.account-box .logout-link');

    if (accountMenuText && logoutLink) {
        checkAdminLoginStatus();
    } else {
        console.error("Required DOM elements not found");
    }
});

async function checkAdminLoginStatus() {
    let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    // Kiểm tra token có tồn tại và in ra để kiểm tra
    console.log("Token:", token);

    const accountMenuText = document.querySelector('.account-box .account-info .account-name');
    const logoutLink = document.querySelector('.account-box .logout-link');

    // Kiểm tra giá trị của token
    if (!token) {
        console.log("No token found in localStorage or sessionStorage");
        accountMenuText.textContent = "Admin";
        logoutLink.textContent = "Login";
        logoutLink.href = "/frontend/pages/login.html";
        return;
    }

    // Kiểm tra xem token có hết hạn không
    const decodedToken = parseJwt(token);
    let date = new Date();

    if (decodedToken && decodedToken.exp < date.getTime() / 1000) {
        console.log("Token expired, refreshing...");
        try {
            token = await refreshToken(); 
        } catch (error) {
            console.error("Could not refresh token:", error);
            handleAdminLogout(false);  
            return;
        }
    }

    // Gọi API để lấy thông tin admin với token mới
    try {
        const user = await fetchAdminData(token);
        console.log("Admin data:", user);
        if (user && user.username) {
            accountMenuText.textContent = `Hi ${user.username}`;
            logoutLink.textContent = "Logout";
            logoutLink.href = "#";
            logoutLink.addEventListener('click', function(event) {
                event.preventDefault();
                handleAdminLogout(true);
            });
        }
    } catch (err) {
        console.error("Error fetching admin data:", err);
        alert("Có lỗi xảy ra khi lấy thông tin admin.");
        handleAdminLogout(false);  // Đăng xuất nếu không thể lấy thông tin admin
    }
}

async function fetchAdminData(token) {
    try {
        const response = await fetch("http://localhost:8000/v1/user", { 
            method: "GET",
            headers: {
                "Token": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const adminData = await response.json();
            return adminData;
        } else if (response.status === 401) {
            console.error("Unauthorized: Invalid token.");
            throw new Error("Unauthorized");
        } else {
            throw new Error("Failed to fetch admin data");
        }
    } catch (error) {
        console.error("Error fetching admin data:", error);
        throw error;
    }
}

// Hàm xử lý đăng xuất admin
async function handleAdminLogout(redirect) {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await fetch('http://localhost:8000/v1/auth/logout', {
            method: 'POST',
            headers: {
                'Token': `Bearer ${token}`, 
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            console.log("Logged out successfully");

            // Xóa token từ localStorage và sessionStorage
            localStorage.removeItem("accessToken");
            sessionStorage.removeItem("accessToken");

            // Cập nhật giao diện sau khi đăng xuất
            const accountMenuText = document.querySelector('.account-box .account-info .account-name');
            const logoutLink = document.querySelector('.account-box .logout-link');

            accountMenuText.textContent = "Admin";
            logoutLink.textContent = "Login";
            logoutLink.href = "/frontend/pages/login.html"; 
            logoutLink.removeEventListener('click', function(event) {
                event.preventDefault();
                handleAdminLogout(true);
            });

            // Giữ lại người dùng ở trang truyện chính hoặc chuyển hướng
            if (redirect) {
                window.location.href = "/frontend/Trang_truyen.html";
            }

        } else if (response.status === 401) {
            console.error("Unauthorized: Invalid token during logout.");
            alert("Bạn không có quyền để thực hiện thao tác này.");
        } else {
            console.error("Logout failed");
            alert("Đăng xuất thất bại, vui lòng thử lại.");
        }
    } catch (error) {
        console.error("Error logging out:", error);
        alert("Đã xảy ra lỗi khi đăng xuất.");
    }
}

// Hàm lưu token sau khi người dùng đăng nhập thành công
function saveToken(accessToken) {
    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        console.log("Token saved:", accessToken);
    } else {
        console.error("Failed to save token: Token is null or undefined");
    }
}
