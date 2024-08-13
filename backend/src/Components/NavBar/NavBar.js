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

// Kiểm tra trạng thái đăng nhập và cập nhật giao diện
document.addEventListener('DOMContentLoaded', function() {
    const accountMenuText = document.querySelector('.user-account-box .user-pic:nth-child(2)');
    const logoutLink = document.querySelector('.sub-menu-link:last-child p');

    if (accountMenuText && logoutLink) {
        checkLoginStatus();
    } else {
        console.error("Required DOM elements not found");
    }
});

async function checkLoginStatus() {
    let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    // Kiểm tra token có tồn tại và in ra để kiểm tra
    console.log("Token:", token);

    const accountMenuText = document.querySelector('.user-account-box .user-pic:nth-child(2)');
    const logoutLink = document.querySelector('.sub-menu-link:last-child p');

    // Kiểm tra giá trị của token
    if (!token) {
        console.log("No token found in localStorage or sessionStorage");
        accountMenuText.textContent = "Tài khoản";
        logoutLink.textContent = "Login";
        logoutLink.parentElement.href = "/frontend/pages/login.html";
        return;
    }

    console.log("Token:", token);

    // Kiểm tra xem token có hết hạn không
    const decodedToken = parseJwt(token);
    let date = new Date();

    if (decodedToken && decodedToken.exp < date.getTime() / 1000) {
        console.log("Token expired, refreshing...");
        try {
            token = await refreshToken(); 
        } catch (error) {
            console.error("Could not refresh token:", error);
            handleLogout(false);  
            return;
        }
    }

    // Gọi API để lấy thông tin người dùng với token mới
    try {
        const user = await fetchUserData(token);
        console.log("User data:", user);
        if (user && user.username) {
                accountMenuText.textContent = `Hi ${user.username}`;
                accountMenuText.textContent = `Hi ${user.username}`;
                // Thay đổi "Login" thành "Logout"
            accountMenuText.textContent = `Hi ${user.username}`;
                // Thay đổi "Login" thành "Logout"
            logoutLink.textContent = "Logout";
            logoutLink.parentElement.href = "#";
            logoutLink.parentElement.addEventListener('click', function(event) {
                event.preventDefault();
                handleLogout(true);
            });
        }
    } catch (err) {
        console.error("Error fetching user data:", err);
        alert("Có lỗi xảy ra khi lấy thông tin người dùng.");
        handleLogout(false);  // Đăng xuất nếu không thể lấy thông tin người dùng
    }
}

async function fetchUserData(token) {
    try {
        const response = await fetch("http://localhost:8000/v1/user/me", {
            method: "GET",
            headers: {
                "Token": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const userData = await response.json();
            return userData;
        } else if (response.status === 401) {
            console.error("Unauthorized: Invalid token.");
            throw new Error("Unauthorized");
        } else {
            throw new Error("Failed to fetch user data");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

// Hàm xử lý đăng xuất
async function handleLogout(redirect) {
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
            const accountMenuText = document.querySelector('.user-account-box .user-pic:nth-child(2)');
            const logoutLink = document.querySelector('.sub-menu-link:last-child p');

            accountMenuText.textContent = "Tài khoản";
            logoutLink.textContent = "Login";
            logoutLink.parentElement.href = "/frontend/pages/login.html"; 
            logoutLink.parentElement.removeEventListener('click', function(event) {
                event.preventDefault();
                handleLogout(true);
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
