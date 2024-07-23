// Lấy các phần tử từ trang
const formRegister = document.getElementById("formRegister");
const userNameElement = document.getElementById("userName");
const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const rePasswordElement = document.getElementById("rePassword");

// Các phần tử hiển thị lỗi
const userNameError = document.getElementById("userNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const rePasswordError = document.getElementById("rePasswordError");

// Sự kiện submit form đăng kí tài khoản
formRegister.addEventListener("submit", function(ev) {
    // Ngăn chặn trang load lại
    ev.preventDefault();

    // Kiểm tra giá trị input
    let isValid = true;

    if (!userNameElement.value) {
        userNameError.style.display = "block";
        isValid = false;
    } else {
        userNameError.style.display = "none";
    }

    if (!emailElement.value) {
        emailError.style.display = "block";
        isValid = false;
    } else {
        emailError.style.display = "none";
    }

    if (!passwordElement.value) {
        passwordError.style.display = "block";
        isValid = false;
    } else {
        passwordError.style.display = "none";
    }

    if (!rePasswordElement.value || rePasswordElement.value !== passwordElement.value) {
        rePasswordError.style.display = "block";
        isValid = false;
    } else {
        rePasswordError.style.display = "none";
    }

    // Nếu tất cả các trường đều hợp lệ, tiếp tục gửi form (hoặc thực hiện hành động khác)
    if (isValid) {
        // Thực hiện hành động khi form hợp lệ (ví dụ: gửi form, gọi API, v.v.)
        console.log("Form hợp lệ, thực hiện hành động tiếp theo...");
    }
});
