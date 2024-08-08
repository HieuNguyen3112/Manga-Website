document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formFogot');
    const userName = document.getElementById('userName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const repassword = document.getElementById('repassword');
    const showPasswordCheckbox = document.getElementById('showpassword');
    
    const userNameError = document.getElementById('userNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const rePasswordError = document.getElementById('rePasswordError');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        // Reset error messages
        userNameError.style.display = 'none';
        emailError.style.display = 'none';
        passwordError.style.display = 'none';
        rePasswordError.style.display = 'none';
        
        // Validate input
        const isValid = validateInput();
        
        if (isValid) {
            const formData = {
                userName: userName.value,
                email: email.value,
                password: password.value
            };
            
            // Send data to server
            fetch('/forgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Password reset successful!');
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
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
            userNameError.style.display = 'block';
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            emailError.style.display = 'block';
            isValid = false;
        }
        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        if (!passwordRegex.test(password.value)) {
            passwordError.style.display = 'block';
            isValid = false;
        }
        
        if (password.value !== repassword.value) {
            rePasswordError.style.display = 'block';
            isValid = false;
        }
        
        return isValid;
    }
});
