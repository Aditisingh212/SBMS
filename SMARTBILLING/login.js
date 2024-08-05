// Function to check password validity
function isValidPassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        password.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecialChar
    );
}

// Handle user registration
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!isValidPassword(password)) {
        alert(
            'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.'
        );
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        alert('User already exists!');
        return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please log in.');
    window.location.href = 'index.html';
});

// Handle user login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        localStorage.setItem('loggedInUser', email);
        alert('Login successful!');
        window.location.href = 'index1.html';
    } else {
        alert('Invalid email or password!');
    }
});

// Handle user logout
document.getElementById('logout')?.addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    window.location.href = 'index.html';
});
