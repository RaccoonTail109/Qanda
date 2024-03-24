import { toast } from './utilities.js';
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');

const goRegisterButton = document.getElementById('goRegisterButton');
const backLoginButton = document.getElementById('backLoginButton');
const forgetPasswordButton = document.getElementById('forgetPasswordButton');


function login() {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    //* validate email
    if (!emailPattern.test(email)) {
        toast('Please enter a valid email address.', 'error');
        return;
    }
    const password = document.getElementById('loginPassword').value;
    const data = {
        email,
        password,
    };
    window.requestFunc.login(data);

}
loginButton.addEventListener('click', login);

function register() {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    //* validate email
    if (!emailPattern.test(email)) {
        toast('Please enter a valid email address.', 'error');
        return;
    }

    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    //* validate password
    if (password !== confirmPassword) {
        toast('Passwords do not match.', 'error');
        return;
    }

    const name = document.getElementById('registerUsername').value;
    //* validate username
    if (name.length < 1 || name.length > 20) {
        toast('Please enter a username between 1 and 20 characters.', 'error');
        return;
    }
    const data = {
        email,
        password,
        name,
    };
    window.requestFunc.register(data);
}
registerButton.addEventListener('click', register);

function goRegisterPage() {
    const registerPage = document.getElementById('onlyRegisterBox');
    const loginPage = document.getElementById('onlyLoginBox');
    registerPage.classList.remove('hidden');
    loginPage.classList.add('hidden');

}
goRegisterButton.onclick = goRegisterPage;

function backLoginPage() {
    const registerPage = document.getElementById('onlyRegisterBox');
    const loginPage = document.getElementById('onlyLoginBox');
    registerPage.classList.add('hidden');
    loginPage.classList.remove('hidden');

}
backLoginButton.onclick = backLoginPage;

function showAlert() {
    toast('Please contact the administrator to reset your password.', "info");
}
forgetPasswordButton.onclick = showAlert;