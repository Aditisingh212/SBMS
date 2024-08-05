// const sideMenu= document.querySelector('aside');
// const menuBtn= document.querySelector('#menu_bar');
// const closeBtn=document.querySelector('#close_btn');


// const themeToggler=document.querySelector('.theme-toggler')
// menuBtn.addEventListener('click',()=>{
//     sideMenu.style.display="none";
// })
const sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu_bar');
const closeBtn = document.querySelector('#close_btn');

const themeToggler = document.querySelector('.theme-toggler');

// Toggle side menu visibility
menuBtn.addEventListener('click', () => {
    if (sideMenu.style.display === "none" || sideMenu.style.display === "") {
        sideMenu.style.display = "block"; // or "flex" depending on your layout
    } else {
        sideMenu.style.display = "none";
    }
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = "none";
});


themeToggler.addEventListener('click', ()=>{
    
    
    document.body.classList.toggle('dark-theme-variables')
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active')
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active')


})


document.getElementById('menu_bar').addEventListener('click', function() {
    const sidebar = document.querySelector('aside');
    sidebar.classList.toggle('active');
});


// 

// Handle user registration
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

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
    window.location.href = 'login.html';
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
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password!');
    }
});

// Handle user logout
document.getElementById('logout')?.addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    window.location.href = 'login.html';
});
