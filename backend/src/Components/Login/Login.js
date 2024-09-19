document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const usernameInput = document.getElementById("userName");
  const passwordInput = document.getElementById("password");

  const dispatch = (action) => {
    console.log("Dispatching action:", action);
    // Implement your dispatch logic here
  };

  const navigate = (url) => {
    window.location.href = url;
  };

  const loginUser = async (user, dispatch, navigate) => {
    try {
      const response = await fetch("http://localhost:3000/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Login successful:", result);

        // Lưu token vào localStorage hoặc sessionStorage
        if (result.accessToken) {
          saveToken(result.accessToken);
        }

        if (result.admin) { 
          navigate("/frontend/pages/admin.html");
        } else {
          navigate("/frontend/Trang_truyen.html");
        }
        dispatch({ type: "LOGIN_SUCCESS", payload: result });
      } else {
        console.error("Login failed:", result.message);
        alert(result.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      dispatch({ type: "LOGIN_FAILURE", payload: error });
    }
  };

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    const newUser = {
      username: username,
      password: password,
    };

    loginUser(newUser, dispatch, navigate);
  });
});

// Hàm lưu token sau khi người dùng đăng nhập thành công
function saveToken(accessToken) {
  // Lưu token vào localStorage hoặc sessionStorage
  localStorage.setItem("accessToken", accessToken);
  // sessionStorage.setItem("accessToken", accessToken); // Nếu muốn sử dụng sessionStorage thay vì localStorage
}
