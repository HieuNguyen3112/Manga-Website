document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const usernameInput = document.getElementById("userName");
  const passwordInput = document.getElementById("password");
  const repasswordInput = document.getElementById("repassword");
  const registerForm = document.getElementById("formRegister");

  const dispatch = (action) => {
    console.log("Dispatching action:", action);
    // Implement your dispatch logic here
  };

  const navigate = (url) => {
    window.location.href = url;
  };

  const registerUser = async (user, dispatch, navigate) => {
    try {
      const response = await fetch("http://localhost:3000/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Registration successful:", result);
        navigate("/frontend/pages/login.html");
      } else {
        console.error("Registration failed:", result.message);
        alert(result.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;
    const repassword = repasswordInput.value;

    const userNameError = document.getElementById("userNameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const rePasswordError = document.getElementById("rePasswordError");

    userNameError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";
    rePasswordError.style.display = "none";

    const userPattern = /^[A-Za-z][A-Za-z\d]{7,19}$/;
    if (!userPattern.test(username)) {
      userNameError.style.display = "block";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      emailError.style.display = "block";
      return;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    if (!passwordPattern.test(password)) {
      passwordError.style.display = "block";
      return;
    }

    if (password !== repassword) {
      rePasswordError.style.display = "block";
      return;
    }

    const newUser = {
      email: email,
      password: password,
      username: username,
    };

    registerUser(newUser, dispatch, navigate);
  });

  document.getElementById("showpassword").addEventListener("change", function () {
    const password = document.getElementById("password");
    const repassword = document.getElementById("repassword");
    if (this.checked) {
      password.type = "text";
      repassword.type = "text";
    } else {
      password.type = "password";
      repassword.type = "password";
    }
  });
});
