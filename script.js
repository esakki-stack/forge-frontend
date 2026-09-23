/* ==========================================================================
   FORGE COMPLAINT PORTAL UI SYSTEM - JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEventListeners();
});

// Storage key for user database in demo mode
const USERS_DB_KEY = 'forge_users_db';
const ACTIVE_USER_KEY = 'forge_active_user';

// State Management
let currentTab = 'login';

/**
 * Initialize Theme Switcher (Dark / Light)
 */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('forge_theme') || localStorage.getItem('nexus_theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('forge_theme', newTheme);
            showToast(`Switched to ${newTheme} mode`, 'info');
        });
    }
}

/**
 * Initialize Input Event Listeners for Real-time Password Evaluation
 */
function initEventListeners() {
    const regPasswordInput = document.getElementById('reg-password');
    const regConfirmPasswordInput = document.getElementById('reg-confirm-password');

    if (regPasswordInput) {
        regPasswordInput.addEventListener('input', () => {
            evaluatePasswordStrength(regPasswordInput.value);
            if (regConfirmPasswordInput.value.length > 0) {
                checkPasswordMatch();
            }
        });
    }

    if (regConfirmPasswordInput) {
        regConfirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }
}

/**
 * Tab Switching Handler (Log In <-> Create Account)
 */
function switchTab(tabName) {
    currentTab = tabName;
    
    const loginTabBtn = document.getElementById('tab-login');
    const registerTabBtn = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const successView = document.getElementById('success-view');

    // Hide success view if open
    successView.style.display = 'none';

    if (tabName === 'login') {
        loginTabBtn.classList.add('active');
        registerTabBtn.classList.remove('active');
        
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else if (tabName === 'register') {
        registerTabBtn.classList.add('active');
        loginTabBtn.classList.remove('active');
        
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

/**
 * Toggle Password Visibility (Eye Icon)
 */
function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');

    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * REAL-TIME STRONG PASSWORD EVALUATOR
 */
function evaluatePasswordStrength(password) {
    // Rules definitions
    const rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Update Checklist UI
    updateRuleUI('rule-length', rules.length);
    updateRuleUI('rule-uppercase', rules.uppercase);
    updateRuleUI('rule-lowercase', rules.lowercase);
    updateRuleUI('rule-number', rules.number);
    updateRuleUI('rule-special', rules.special);

    // Score calculation
    let passedRulesCount = Object.values(rules).filter(Boolean).length;
    
    // Additional entropy bonus for longer passwords
    if (password.length >= 12 && passedRulesCount >= 4) {
        passedRulesCount = 5;
    }

    const strengthLabel = document.getElementById('strength-label');
    const bars = [
        document.getElementById('bar-1'),
        document.getElementById('bar-2'),
        document.getElementById('bar-3'),
        document.getElementById('bar-4')
    ];

    // Reset bar colors
    bars.forEach(bar => {
        if (bar) bar.style.backgroundColor = '';
    });

    if (password.length === 0) {
        strengthLabel.textContent = 'Enter Password';
        strengthLabel.style.color = 'var(--text-muted)';
        return;
    }

    let levelText = '';
    let levelColor = '';
    let activeBarsCount = 0;

    switch (passedRulesCount) {
        case 0:
        case 1:
            levelText = 'Very Weak';
            levelColor = 'var(--strength-weak)';
            activeBarsCount = 1;
            break;
        case 2:
            levelText = 'Weak';
            levelColor = 'var(--strength-weak)';
            activeBarsCount = 1;
            break;
        case 3:
            levelText = 'Fair';
            levelColor = 'var(--strength-fair)';
            activeBarsCount = 2;
            break;
        case 4:
            levelText = 'Good';
            levelColor = 'var(--strength-good)';
            activeBarsCount = 3;
            break;
        case 5:
            levelText = 'Strong & Secure';
            levelColor = 'var(--strength-strong)';
            activeBarsCount = 4;
            break;
    }

    // Apply strength labels & bar highlights
    strengthLabel.textContent = levelText;
    strengthLabel.style.color = levelColor;

    for (let i = 0; i < activeBarsCount; i++) {
        if (bars[i]) {
            bars[i].style.backgroundColor = levelColor;
        }
    }
}

/**
 * Update Individual Rule Checklist Item
 */
function updateRuleUI(ruleId, isValid) {
    const el = document.getElementById(ruleId);
    if (!el) return;

    const icon = el.querySelector('.rule-icon');

    if (isValid) {
        el.classList.add('valid');
        icon.className = 'rule-icon fa-solid fa-circle-check';
    } else {
        el.classList.remove('valid');
        icon.className = 'rule-icon fa-solid fa-circle-xmark';
    }
}

/**
 * Check Password Matching Status
 */
function checkPasswordMatch() {
    const pass = document.getElementById('reg-password').value;
    const confirmPass = document.getElementById('reg-confirm-password').value;
    const statusEl = document.getElementById('match-status');

    if (!confirmPass) {
        statusEl.textContent = '';
        statusEl.className = 'match-status';
        return false;
    }

    if (pass === confirmPass) {
        statusEl.innerHTML = '<i class="fa-solid fa-check"></i> Passwords match';
        statusEl.className = 'match-status matched';
        return true;
    } else {
        statusEl.innerHTML = '<i class="fa-solid fa-xmark"></i> Passwords do not match';
        statusEl.className = 'match-status mismatched';
        return false;
    }
}

/**
 * Handle Login Form Submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const submitBtn = document.getElementById('login-submit-btn');

    clearErrors();

    let isValid = true;

    if (!usernameInput.value.trim()) {
        showFieldError('login-username-err', 'Please enter your username, email, or Ticket ID');
        isValid = false;
    }

    if (!passwordInput.value) {
        showFieldError('login-password-err', 'Please enter your password');
        isValid = false;
    }

    if (!isValid) return;

    // Show button loading spinner
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate API delay
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || localStorage.getItem('nexus_users_db') || '[]');
        const userFound = users.find(u => u.username.toLowerCase() === usernameInput.value.trim().toLowerCase());

        // For demo convenience: if user is not in database, we allow login with demo session
        const fullName = userFound ? `${userFound.firstname} ${userFound.lastname}` : usernameInput.value.trim();
        const username = userFound ? userFound.username : usernameInput.value.trim();

        showSuccessScreen(fullName, username);
        showToast(`Welcome to Forge Complaint Portal, ${fullName}!`, 'success');
    }, 1100);
}

/**
 * Handle Registration Form Submission
 */
function handleRegister(event) {
    event.preventDefault();

    const firstnameInput = document.getElementById('reg-firstname');
    const lastnameInput = document.getElementById('reg-lastname');
    const usernameInput = document.getElementById('reg-username');
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('reg-confirm-password');
    const termsCheckbox = document.getElementById('terms-agree');
    const submitBtn = document.getElementById('register-submit-btn');

    clearErrors();

    let isValid = true;

    if (!firstnameInput.value.trim()) {
        showFieldError('reg-firstname-err', 'First name required');
        isValid = false;
    }

    if (!lastnameInput.value.trim()) {
        showFieldError('reg-lastname-err', 'Last name required');
        isValid = false;
    }

    if (!usernameInput.value.trim()) {
        showFieldError('reg-username-err', 'Username or complainant handle required');
        isValid = false;
    } else if (usernameInput.value.trim().length < 3) {
        showFieldError('reg-username-err', 'Handle must be at least 3 characters');
        isValid = false;
    }

    // Evaluate Password Strength requirement
    const pass = passwordInput.value;
    const isStrongEnough = pass.length >= 8 && 
                           /[A-Z]/.test(pass) && 
                           /[a-z]/.test(pass) && 
                           /[0-9]/.test(pass) && 
                           /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!pass) {
        showFieldError('reg-password-err', 'Password is required');
        isValid = false;
    } else if (!isStrongEnough) {
        showFieldError('reg-password-err', 'Password must satisfy all criteria listed below');
        showToast('Please create a secure password meeting all criteria', 'error');
        isValid = false;
    }

    // Password match check
    if (pass !== confirmPasswordInput.value) {
        showFieldError('reg-confirm-err', 'Passwords must match exactly');
        isValid = false;
    }

    // Terms agreement check
    if (!termsCheckbox.checked) {
        showFieldError('terms-err', 'You must agree to the Grievance Charter & Policy');
        isValid = false;
    }

    if (!isValid) return;

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Save User into Local Database Simulation
        const newUser = {
            firstname: firstnameInput.value.trim(),
            lastname: lastnameInput.value.trim(),
            username: usernameInput.value.trim(),
            createdAt: new Date().toISOString()
        };

        const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
        users.push(newUser);
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

        const fullName = `${newUser.firstname} ${newUser.lastname}`;
        showSuccessScreen(fullName, newUser.username);
        showToast('Complainant profile created successfully!', 'success');
    }, 1300);
}

/**
 * Display Field Validation Errors
 */
function showFieldError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;
}

function clearErrors() {
    const errors = document.querySelectorAll('.error-msg');
    errors.forEach(e => e.textContent = '');
}

/**
 * Render Success Dashboard Demo Screen
 */
function showSuccessScreen(fullName, username) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const successView = document.getElementById('success-view');

    loginForm.classList.remove('active');
    registerForm.classList.remove('active');

    // Generate Initials
    const names = fullName.trim().split(' ');
    let initials = names[0] ? names[0][0].toUpperCase() : 'C';
    if (names.length > 1 && names[1]) {
        initials += names[1][0].toUpperCase();
    }

    document.getElementById('user-avatar-initials').textContent = initials;
    document.getElementById('user-display-name').textContent = fullName;
    document.getElementById('user-display-username').textContent = `@${username.replace('@', '')}`;

    successView.style.display = 'flex';
    successView.classList.add('active');
}

/**
 * Logout Handler
 */
function handleLogout() {
    const successView = document.getElementById('success-view');
    successView.style.display = 'none';
    successView.classList.remove('active');

    switchTab('login');
    showToast('Signed out from Forge Portal', 'info');
}

/**
 * Forgot Password Trigger
 */
function handleForgotPassword(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    if (username) {
        showToast(`Recovery link sent for ${username}`, 'info');
    } else {
        showToast('Please enter your username, email, or Ticket ID first', 'error');
    }
}

/**
 * Terms Modal Controller
 */
function showTermsModal(e) {
    if (e) e.preventDefault();
    document.getElementById('terms-modal').classList.add('active');
}

function closeTermsModal(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('terms-modal').classList.remove('active');
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
        <i class="toast-icon ${iconClass}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
