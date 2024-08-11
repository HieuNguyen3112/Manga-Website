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
            console.log("Token refreshed:", data);
            return data; // Trả về token mới
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
    checkLoginStatus();
});

async function checkLoginStatus() {
    let token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    // Kiểm tra token có tồn tại và in ra để kiểm tra
    console.log("Token:", token);

    const accountMenuText = document.querySelector('.user-account-box .user-pic:nth-child(2)');
    const logoutLink = document.querySelector('.sub-menu-link:last-child p');

    if (token) {
        // Kiểm tra xem token có hết hạn không
        const decodedToken = parseJwt(token);
        let date = new Date();

        if (decodedToken.exp < date.getTime() / 1000) {
            console.log("Token expired, refreshing...");
            try {
                const data = await refreshToken();
                token = data.accessToken;  // Sử dụng token mới
                saveToken(token);  // Lưu token mới
            } catch (error) {
                console.error("Could not refresh token:", error);
                handleLogout();  // Đăng xuất nếu không làm mới token được
                return;  // Thoát nếu không làm mới token được
            }
        }

        // Gọi API để lấy thông tin người dùng với token mới (nếu đã làm mới)
        fetchUserData(token).then(user => {
            console.log("User data:", user);
            if (user && user.username) {
                // Hiển thị tên người dùng
                accountMenuText.textContent = `Hi ${user.username}`;
                // Thay đổi "Login" thành "Logout"
                logoutLink.textContent = "Logout";
                logoutLink.parentElement.href = "#";
                logoutLink.parentElement.addEventListener('click', function(event) {
                    event.preventDefault();
                    handleLogout();
                });
            }
        }).catch(err => {
            console.error("Error fetching user data:", err);
            alert("Có lỗi xảy ra khi lấy thông tin người dùng.");
            handleLogout();  // Đăng xuất nếu không thể lấy thông tin người dùng
        });
    } else {
        logoutLink.textContent = "Login";
        logoutLink.parentElement.href = "/frontend/pages/login.html"; 
    }
}

async function fetchUserData(token) {
    try {
        const response = await fetch("http://localhost:8000/v1/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
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
function handleLogout() {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    alert("Bạn đã đăng xuất thành công.");
    window.location.reload();
}

// Hàm lưu token sau khi người dùng đăng nhập thành công
function saveToken(accessToken) {
    localStorage.setItem("accessToken", accessToken);
}
