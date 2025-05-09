let idOfNext = "";
let selectedMovie = "";
let randomMovie;
const playBtn = document.getElementById("playBtn");
const likeBtn = document.getElementById("likeBtn");
const backBtn = document.getElementById("back");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

// Toast notification system
function createToast(message, type = 'success') {
  // Remove any existing toasts
  const existingToasts = document.querySelectorAll('.toast-notification');
  existingToasts.forEach(toast => {
    document.body.removeChild(toast);
  });
  
  // Create toast container
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  
  // Create toast content
  const icon = document.createElement('div');
  icon.className = 'toast-icon';
  
  if (type === 'success') {
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" fill="currentColor"/></svg>';
  } else if (type === 'error') {
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/></svg>';
  }
  
  const messageElement = document.createElement('div');
  messageElement.className = 'toast-message';
  messageElement.textContent = message;
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => {
    document.body.removeChild(toast);
  };
  
  // Assemble toast
  toast.appendChild(icon);
  toast.appendChild(messageElement);
  toast.appendChild(closeBtn);
  document.body.appendChild(toast);
  
  // Auto dismiss after 5 seconds
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 500);
    }
  }, 5000);
  
  return toast;
}

// Login and Registration Modal Functions
function createLoginModal() {
  // Create modal overlay with animation
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  
  // Create modal header with decoration
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  
  // Add decorative elements
  const headerDecoration = document.createElement('div');
  headerDecoration.className = 'header-decoration';
  headerDecoration.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C9.2 2 7 4.2 7 7V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8H17V7C17 4.2 14.8 2 12 2ZM12 4C13.7 4 15 5.3 15 7V8H9V7C9 5.3 10.3 4 12 4ZM12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13Z" fill="currentColor"/></svg>';
  
  const modalTitle = document.createElement('h2');
  modalTitle.textContent = 'Login';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-modal';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => {
    // Add closing animation
    modal.style.opacity = '0';
    modal.style.transform = 'translateY(-20px)';
    modalOverlay.style.opacity = '0';
    
    // Remove after animation completes
    setTimeout(() => {
      if (document.body.contains(modalOverlay)) {
        document.body.removeChild(modalOverlay);
      }
    }, 300);
  };
  
  modalHeader.appendChild(headerDecoration);
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeBtn);
  
  // Create form with enhanced styling
  const form = document.createElement('form');
  form.className = 'auth-form';
  
  // Username input with icon
  const usernameGroup = document.createElement('div');
  usernameGroup.className = 'form-group';
  
  const usernameLabel = document.createElement('label');
  usernameLabel.textContent = 'Username';
  usernameLabel.htmlFor = 'login-username';
  
  const usernameWrapper = document.createElement('div');
  usernameWrapper.className = 'input-wrapper';
  
  const usernameIcon = document.createElement('div');
  usernameIcon.className = 'input-icon';
  usernameIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/></svg>';
  
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.id = 'login-username';
  usernameInput.placeholder = 'Enter your username';
  usernameInput.required = true;
  
  usernameWrapper.appendChild(usernameIcon);
  usernameWrapper.appendChild(usernameInput);
  
  usernameGroup.appendChild(usernameLabel);
  usernameGroup.appendChild(usernameWrapper);
  
  // Password input with icon
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'form-group';
  
  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password';
  passwordLabel.htmlFor = 'login-password';
  
  const passwordWrapper = document.createElement('div');
  passwordWrapper.className = 'input-wrapper';
  
  const passwordIcon = document.createElement('div');
  passwordIcon.className = 'input-icon';
  passwordIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM18 8H17V6C17 3.2 14.8 1 12 1C9.2 1 7 3.2 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM8.9 6C8.9 4.3 10.3 2.9 12 2.9C13.7 2.9 15.1 4.3 15.1 6V8H8.9V6ZM18 20H6V10H18V20Z" fill="currentColor"/></svg>';
  
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'login-password';
  passwordInput.placeholder = 'Enter your password';
  passwordInput.required = true;
  
  // Add password toggle
  const passwordToggle = document.createElement('div');
  passwordToggle.className = 'password-toggle';
  passwordToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C15.79 6 19.17 8.13 20.82 11.5C19.17 14.87 15.79 17 12 17C8.21 17 4.83 14.87 3.18 11.5C4.83 8.13 8.21 6 12 6ZM12 4C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 11.5C21.27 7.11 17 4 12 4ZM12 9C13.38 9 14.5 10.12 14.5 11.5C14.5 12.88 13.38 14 12 14C10.62 14 9.5 12.88 9.5 11.5C9.5 10.12 10.62 9 12 9ZM12 7C9.52 7 7.5 9.02 7.5 11.5C7.5 13.98 9.52 16 12 16C14.48 16 16.5 13.98 16.5 11.5C16.5 9.02 14.48 7 12 7Z" fill="currentColor"/></svg>';
  passwordToggle.onclick = () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      passwordToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C15.79 6 19.17 8.13 20.82 11.5C20.23 12.72 19.4 13.77 18.41 14.62L19.82 16.03C21.21 14.8 22.31 13.26 23 11.5C21.27 7.11 17 4 12 4C10.73 4 9.51 4.2 8.36 4.57L10.01 6.22C10.66 6.09 11.32 6 12 6ZM2 3.27L4.28 5.55L4.73 6C3.08 7.3 1.78 9.28 1 11.5C2.73 15.89 7 19 12 19C13.55 19 15.03 18.7 16.38 18.16L16.81 18.59L19.73 21.51L21 20.24L3.27 2.5L2 3.27ZM7.53 8.8L9.08 10.35C9.03 10.73 9 11.11 9 11.5C9 13.98 10.79 16 13 16C13.38 16 13.77 15.97 14.14 15.92L15.7 17.48C14.85 17.81 13.95 18 13 18C9.24 18 6.13 15.04 6.13 11.5C6.13 10.54 6.32 9.64 6.65 8.8L7.53 8.8ZM12.42 11.59L15.03 14.21C14.99 14.24 14.94 14.26 14.9 14.29C14.55 14.43 14.18 14.5 13.8 14.5C11.72 14.5 10.03 13.03 10.03 11.21C10.03 10.79 10.1 10.39 10.24 10.03C10.26 9.99 10.29 9.95 10.32 9.91L12.42 11.59Z" fill="currentColor"/></svg>';
    } else {
      passwordInput.type = 'password';
      passwordToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C15.79 6 19.17 8.13 20.82 11.5C19.17 14.87 15.79 17 12 17C8.21 17 4.83 14.87 3.18 11.5C4.83 8.13 8.21 6 12 6ZM12 4C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 11.5C21.27 7.11 17 4 12 4ZM12 9C13.38 9 14.5 10.12 14.5 11.5C14.5 12.88 13.38 14 12 14C10.62 14 9.5 12.88 9.5 11.5C9.5 10.12 10.62 9 12 9ZM12 7C9.52 7 7.5 9.02 7.5 11.5C7.5 13.98 9.52 16 12 16C14.48 16 16.5 13.98 16.5 11.5C16.5 9.02 14.48 7 12 7Z" fill="currentColor"/></svg>';
    }
  };
  
  passwordWrapper.appendChild(passwordIcon);
  passwordWrapper.appendChild(passwordInput);
  passwordWrapper.appendChild(passwordToggle);
  
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordWrapper);
  
  // Add "Remember me" checkbox
  const rememberGroup = document.createElement('div');
  rememberGroup.className = 'form-group checkbox-group';
  
  const rememberWrapper = document.createElement('label');
  rememberWrapper.className = 'checkbox-wrapper';
  
  const rememberCheckbox = document.createElement('input');
  rememberCheckbox.type = 'checkbox';
  rememberCheckbox.id = 'remember-me';
  
  const checkmark = document.createElement('span');
  checkmark.className = 'checkmark';
  
  const rememberText = document.createTextNode('Remember me');
  
  rememberWrapper.appendChild(rememberCheckbox);
  rememberWrapper.appendChild(checkmark);
  rememberWrapper.appendChild(rememberText);
  
  rememberGroup.appendChild(rememberWrapper);
  
  // Submit button with animation
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'auth-submit';
  submitBtn.textContent = 'Login';
  
  // Form submission handler
  form.onsubmit = (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
      createToast('Please fill in all fields', 'error');
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Logging in...';
    
    // API call to backend
    fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then(data => {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Show success visual effect
      modal.classList.add('success-animation');
      
      setTimeout(() => {
        createToast('Login successful! Welcome back.', 'success');
        // Close with animation
        modal.style.opacity = '0';
        modal.style.transform = 'translateY(-20px)';
        modalOverlay.style.opacity = '0';
        
        setTimeout(() => {
          if (document.body.contains(modalOverlay)) {
            document.body.removeChild(modalOverlay);
          }
          updateAuthButtons();
        }, 300);
      }, 600);
    })
    .catch(error => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
      createToast(`Login failed: ${error.message}`, 'error');
    });
  };
  
  // Assemble form
  form.appendChild(usernameGroup);
  form.appendChild(passwordGroup);
  form.appendChild(rememberGroup);
  form.appendChild(submitBtn);
  
  // Add "Don't have an account?" link
  const signupLink = document.createElement('div');
  signupLink.className = 'auth-link';
  signupLink.innerHTML = "Don't have an account? <a href='#'>Sign up</a>";
  
  signupLink.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    document.body.removeChild(modalOverlay);
    const registerModal = createRegisterModal();
    document.body.appendChild(registerModal);
  });
  
  form.appendChild(signupLink);
  
  // Assemble modal
  modal.appendChild(modalHeader);
  modal.appendChild(form);
  modalOverlay.appendChild(modal);
  
  return modalOverlay;
}

function createRegisterModal() {
  // Similar structure as loginModal but with register fields
  // Create modal overlay with animation
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  
  // Create modal header with decoration
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  
  // Add decorative elements
  const headerDecoration = document.createElement('div');
  headerDecoration.className = 'header-decoration';
  headerDecoration.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 12C17.21 12 19 10.21 19 8C19 5.79 17.21 4 15 4C12.79 4 11 5.79 11 8C11 10.21 12.79 12 15 12ZM15 6C16.1 6 17 6.9 17 8C17 9.1 16.1 10 15 10C13.9 10 13 9.1 13 8C13 6.9 13.9 6 15 6ZM15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14ZM9 18C9.22 17.28 12.31 16 15 16C17.7 16 20.8 17.29 21 18H9ZM6 15V12H9V10H6V7H4V10H1V12H4V15H6Z" fill="currentColor"/></svg>';
  
  const modalTitle = document.createElement('h2');
  modalTitle.textContent = 'Register';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-modal';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => {
    // Add closing animation
    modal.style.opacity = '0';
    modal.style.transform = 'translateY(-20px)';
    modalOverlay.style.opacity = '0';
    
    // Remove after animation completes
    setTimeout(() => {
      if (document.body.contains(modalOverlay)) {
        document.body.removeChild(modalOverlay);
      }
    }, 300);
  };
  
  modalHeader.appendChild(headerDecoration);
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeBtn);
  
  // Create form with enhanced styling
  const form = document.createElement('form');
  form.className = 'auth-form';
  
  // Username input with icon
  const usernameGroup = document.createElement('div');
  usernameGroup.className = 'form-group';
  
  const usernameLabel = document.createElement('label');
  usernameLabel.textContent = 'Username';
  usernameLabel.htmlFor = 'register-username';
  
  const usernameWrapper = document.createElement('div');
  usernameWrapper.className = 'input-wrapper';
  
  const usernameIcon = document.createElement('div');
  usernameIcon.className = 'input-icon';
  usernameIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/></svg>';
  
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.id = 'register-username';
  usernameInput.placeholder = 'Choose a username';
  usernameInput.required = true;
  
  usernameWrapper.appendChild(usernameIcon);
  usernameWrapper.appendChild(usernameInput);
  
  usernameGroup.appendChild(usernameLabel);
  usernameGroup.appendChild(usernameWrapper);
  
  // Email input with icon
  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';
  
  const emailLabel = document.createElement('label');
  emailLabel.textContent = 'Email';
  emailLabel.htmlFor = 'register-email';
  
  const emailWrapper = document.createElement('div');
  emailWrapper.className = 'input-wrapper';
  
  const emailIcon = document.createElement('div');
  emailIcon.className = 'input-icon';
  emailIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/></svg>';
  
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'register-email';
  emailInput.placeholder = 'Enter your email';
  emailInput.required = true;
  
  emailWrapper.appendChild(emailIcon);
  emailWrapper.appendChild(emailInput);
  
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailWrapper);
  
  // Password input with icon
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'form-group';
  
  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password';
  passwordLabel.htmlFor = 'register-password';
  
  const passwordWrapper = document.createElement('div');
  passwordWrapper.className = 'input-wrapper';
  
  const passwordIcon = document.createElement('div');
  passwordIcon.className = 'input-icon';
  passwordIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM18 8H17V6C17 3.2 14.8 1 12 1C9.2 1 7 3.2 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM8.9 6C8.9 4.3 10.3 2.9 12 2.9C13.7 2.9 15.1 4.3 15.1 6V8H8.9V6ZM18 20H6V10H18V20Z" fill="currentColor"/></svg>';
  
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'register-password';
  passwordInput.placeholder = 'Create a password';
  passwordInput.required = true;
  
  // Add password toggle
  const passwordToggle = document.createElement('div');
  passwordToggle.className = 'password-toggle';
  passwordToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C15.79 6 19.17 8.13 20.82 11.5C19.17 14.87 15.79 17 12 17C8.21 17 4.83 14.87 3.18 11.5C4.83 8.13 8.21 6 12 6ZM12 4C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 11.5C21.27 7.11 17 4 12 4ZM12 9C13.38 9 14.5 10.12 14.5 11.5C14.5 12.88 13.38 14 12 14C10.62 14 9.5 12.88 9.5 11.5C9.5 10.12 10.62 9 12 9ZM12 7C9.52 7 7.5 9.02 7.5 11.5C7.5 13.98 9.52 16 12 16C14.48 16 16.5 13.98 16.5 11.5C16.5 9.02 14.48 7 12 7Z" fill="currentColor"/></svg>';
  passwordToggle.onclick = () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      passwordToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C15.79 6 19.17 8.13 20.82 11.5C20.23 12.72 19.4 13.77 18.41 14.62L19.82 16.03C21.21 14.8 22.31 13.26 23 11.5C21.27 7.11 17 4 12 4C10.73 4 9.51 4.2 8.36 4.57L10.01 6.22C10.66 6.09 11.32 6 12 6ZM2 3.27L4.28 5.55L4.73 6C3.08 7.3 1.78 9.28 1 11.5C2.73 15.89 7 19 12 19C13.55 19 15.03 18.7 16.38 18.16L16.81 18.59L19.73 21.51L21 20.24L3.27 2.5L2 3.27ZM7.53 8.8L9.08 10.35C9.03 10.73 9 11.11 9 11.5C9 13.98 10.79 16 13 16C13.38 16 13.77 15.97 14.14 15.92L15.7 17.48C14.85 17.81 13.95 18 13 18C9.24 18 6.13 15.04 6.13 11.5C6.13 10.54 6.32 9.64 6.65 8.8L7.53 8.8ZM12.42 11.59L15.03 14.21C14.99 14.24 14.94 14.26 14.9 14.29C14.55 14.43 14.18 14.5 13.8 14.5C11.72 14.5 10.03 13.03 10.03 11.21C10.03 10.79 10.1 10.39 10.24 10.03C10.26 9.99 10.29 9.95 10.32 9.91L12.42 11.59Z" fill="currentColor"/></svg>';
    } else {
      passwordInput.type = 'password';
      passwordToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C15.79 6 19.17 8.13 20.82 11.5C19.17 14.87 15.79 17 12 17C8.21 17 4.83 14.87 3.18 11.5C4.83 8.13 8.21 6 12 6ZM12 4C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 11.5C21.27 7.11 17 4 12 4ZM12 9C13.38 9 14.5 10.12 14.5 11.5C14.5 12.88 13.38 14 12 14C10.62 14 9.5 12.88 9.5 11.5C9.5 10.12 10.62 9 12 9ZM12 7C9.52 7 7.5 9.02 7.5 11.5C7.5 13.98 9.52 16 12 16C14.48 16 16.5 13.98 16.5 11.5C16.5 9.02 14.48 7 12 7Z" fill="currentColor"/></svg>';
    }
  };
  
  passwordWrapper.appendChild(passwordIcon);
  passwordWrapper.appendChild(passwordInput);
  passwordWrapper.appendChild(passwordToggle);
  
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordWrapper);
  
  // Submit button with animation
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'auth-submit';
  submitBtn.textContent = 'Create Account';
  
  // Form submission handler
  form.onsubmit = (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !email || !password) {
      createToast('Please fill in all fields', 'error');
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Creating Account...';
    
    // API call to backend
    fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    })
    .then(data => {
      // Show success visual effect
      modal.classList.add('success-animation');
      
      setTimeout(() => {
        createToast('Registration successful! Please login with your new account.', 'success');
        // Close with animation
        modal.style.opacity = '0';
        modal.style.transform = 'translateY(-20px)';
        modalOverlay.style.opacity = '0';
        
        setTimeout(() => {
          if (document.body.contains(modalOverlay)) {
            document.body.removeChild(modalOverlay);
          }
          // Open login modal
          const loginModal = createLoginModal();
          document.body.appendChild(loginModal);
        }, 300);
      }, 600);
    })
    .catch(error => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
      createToast(`Registration failed: ${error.message}`, 'error');
    });
  };
  
  // Assemble form
  form.appendChild(usernameGroup);
  form.appendChild(emailGroup);
  form.appendChild(passwordGroup);
  form.appendChild(submitBtn);
  
  // Add "Already have an account?" link
  const loginLink = document.createElement('div');
  loginLink.className = 'auth-link';
  loginLink.innerHTML = "Already have an account? <a href='#'>Log in</a>";
  
  loginLink.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    document.body.removeChild(modalOverlay);
    const loginModal = createLoginModal();
    document.body.appendChild(loginModal);
  });
  
  form.appendChild(loginLink);
  
  // Assemble modal
  modal.appendChild(modalHeader);
  modal.appendChild(form);
  modalOverlay.appendChild(modal);
  
  return modalOverlay;
}

function updateAuthButtons() {
  const token = localStorage.getItem('token');
  
  if (token) {
    loginBtn.textContent = 'Logout';
    registerBtn.style.display = 'none';
    
    // Change login button behavior to logout
    loginBtn.onclick = () => {
      localStorage.removeItem('token');
      updateAuthButtons();
      createToast('You have been logged out successfully.', 'success');
    };
  } else {
    loginBtn.textContent = 'Login';
    registerBtn.style.display = 'inline-block';
    
    // Reset login button behavior
    loginBtn.onclick = () => {
      const loginModal = createLoginModal();
      document.body.appendChild(loginModal);
    };
  }
}

function getGeneres() {
  const urlToFetch =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=2735099ea2587a2d66c564ef37de1d3b";
  const xhr = new XMLHttpRequest();
  xhr.open("GET", urlToFetch, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const jsonResponse = JSON.parse(this.responseText);
      //   console.log( jsonResponse.genres[0].id);
      //   console.log(typeof jsonResponse);
      populateGenreDropdow(jsonResponse.genres);
    }
  };
  xhr.send();
}

// populate the drop down menu
function populateGenreDropdow(genresObj) {
  const select = document.getElementById("genres");
  // console.log(genresObj);
  for (const genreItem of genresObj) {
    let option = document.createElement("option");
    option.value = genreItem.id;
    option.text = genreItem.name;
    select.appendChild(option);
    // console.log(genreItem)
  }
}

// function to clear the current movie
function clearCurrentMovie() {
  const moviePosterDiv = document.getElementById("moviePoster");
  const movieTextDiv = document.getElementById("movieText");
  moviePosterDiv.innerHTML = "";
  movieTextDiv.innerHTML = "";
  // document.getElementsByTagName("h1").innerHTML = ""
}

function showRandomMovie() {
  const movieInfo = document.getElementById("movieInfo");
  if (movieInfo.childNodes.length > 0) {
    // console.log(movieInfo.childNodes.length);
    clearCurrentMovie();
  }
  getMovies();
}

// function to get the movies when the gdropdown is clicked
function getMovies() {
  const selectedGenre = getSlectedGenre();
  // console.log(selectedGenre);
  const urlToFetch = `https://api.themoviedb.org/3/discover/movie?api_key=2735099ea2587a2d66c564ef37de1d3b&with_genres=${selectedGenre}`;
  console.log(urlToFetch);
  const xhr = new XMLHttpRequest();
  xhr.open("GET", urlToFetch, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const jsonResponse = JSON.parse(this.responseText);
      randomMovie = getRandomMovies(jsonResponse.results);
      // getMovieInfo(randomMovie);
      displayMovie(randomMovie);
      console.log(randomMovie);
    }
  };
  xhr.send();
}

// function to get the selcted genre
function getSlectedGenre() {
  const selectedGenre = document.getElementById("genres").value;
  return selectedGenre;
}

// function to get the random movie of that particular genre
function getRandomMovies(movies) {
  const randomIndex = Math.floor(Math.random() * movies.length);

  const randomMovie = movies[randomIndex];
  return randomMovie;
}

// function to display the movie
function displayMovie(movieInfo) {
  const moviePosterDiv = document.getElementById("moviePoster");
  const movieTextDiv = document.getElementById("movieText");
  // const likeBtn = document.getElementById("likeBtn");

  const moviePoster = createMoviePoster(movieInfo.poster_path);
  const titleHeader = createMovieTitle(movieInfo.original_title);
  const overviewText = createMovieOverview(movieInfo.overview);
  moviePosterDiv.appendChild(moviePoster);
  movieTextDiv.appendChild(titleHeader);
  movieTextDiv.appendChild(overviewText);
}

// function to create movie poster
function createMoviePoster(posterPath) {
  const moviePosterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;
  const posterImg = document.createElement("img");
  posterImg.setAttribute("src", moviePosterUrl);
  posterImg.setAttribute("id", "moviePoster");
  return posterImg;
}

// function to create movie title
function createMovieTitle(title) {
  const titleHeader = document.createElement("h1");
  titleHeader.setAttribute("id", "movieTitle");
  titleHeader.innerHTML = title;
  return titleHeader;
}

// function to create movie description
function createMovieOverview(overview) {
  const overviewParagraph = document.createElement("p");
  overviewParagraph.setAttribute("id", "movieOverview");
  overviewParagraph.innerHTML = overview;
  return overviewParagraph;
}

// function invoked then next movie will displayed
function nextMovie() {
  backBtn.disabled = false;
  selectedMovie = randomMovie;
  clearCurrentMovie();
  showRandomMovie();
}

// Initialize the page
getGeneres();
playBtn.addEventListener("click", showRandomMovie);
likeBtn.addEventListener("click", nextMovie);
backBtn.addEventListener("click", () => {
  clearCurrentMovie();
  console.log("backbtn", selectedMovie);
  displayMovie(selectedMovie);
});

// Set up authentication button handlers
loginBtn.addEventListener('click', () => {
  const loginModal = createLoginModal();
  document.body.appendChild(loginModal);
});

registerBtn.addEventListener('click', () => {
  const registerModal = createRegisterModal();
  document.body.appendChild(registerModal);
});

// Check if user is already logged in
updateAuthButtons();
