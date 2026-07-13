const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
}); 

// ---- Redirect to home page on Sign in / Sign up ----
const signInBtn = document.getElementById("signInBtn");
const signUpBtn = document.getElementById("signUpBtn");

signInBtn.addEventListener('click', () => {
  window.location.href = "index.html"; // apna home page ka sahi naam yahan daalo
});

signUpBtn.addEventListener('click', () => {
  window.location.href = "index.html"; // apna home page ka sahi naam yahan daalo
});