// Authentication Logic
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

// Show Signup Form
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

// Show Login Form
showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Login Functionality
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('Login successful:', user);
            // Redirect to main app or show success message
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Login error:', errorCode, errorMessage);
            // Show error message to user
        });
});

// Signup Functionality
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        console.error('Passwords do not match');
        // Show error message to user
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log('Signup successful:', user);
            // Redirect to main app or show success message
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Signup error:', errorCode, errorMessage);
            // Show error message to user
        });
});