document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formForgot');
    const userName = document.getElementById('userName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const repassword = document.getElementById('repassword');
    const showPasswordCheckbox = document.getElementById('showpassword');
    
    const userNameError = document.getElementById('userNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const rePasswordError = document.getElementById('rePasswordError');

    // Kiểm tra nếu các phần tử tồn tại trước khi sử dụng chúng
    if (!form || !userName || !email || !password || !repassword || !showPasswordCheckbox) {
        console.error("One or more form elements not found.");
        return;
    }
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        // Reset error messages
        hideErrors();
        
        // Validate input
        if (validateInput()) {
            const formData = {
                userName: userName.value.trim(),
                email: email.value.trim(),
                newPassword: password.value.trim()
            };
            
            // Gửi dữ liệu tới máy chủ để xử lý
            fetch('http://localhost:8000/v1/auth/forgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json().then(data => ({ status: response.status, data })))
            .then(({ status, data }) => {
                if (status !== 200) {
                    throw new Error(data.message || 'Unknown error occurred');
                }
                alert('Password reset successful!');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error: ' + error.message);
            });
        }
    });

    showPasswordCheckbox.addEventListener('change', function () {
        const type = showPasswordCheckbox.checked ? 'text' : 'password';
        password.type = type;
        repassword.type = type;
    });

    function validateInput() {
        let isValid = true;
        
        if (userName.value.trim() === '') {
            displayError(userNameError, 'Username is required');
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            displayError(emailError, 'Invalid email format');
            isValid = false;
        }
        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        if (!passwordRegex.test(password.value.trim())) {
            displayError(passwordError, 'Password must be 8-20 characters long, contain letters and numbers');
            isValid = false;
        }
        
        if (password.value.trim() !== repassword.value.trim()) {
            displayError(rePasswordError, 'Passwords do not match');
            isValid = false;
        }
        
        return isValid;
    }

    function hideErrors() {
        if (userNameError) userNameError.style.display = 'none';
        if (emailError) emailError.style.display = 'none';
        if (passwordError) passwordError.style.display = 'none';
        if (rePasswordError) rePasswordError.style.display = 'none';
    }

    function displayError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }
});
