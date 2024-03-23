const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const goRegisterButton = document.getElementById('goRegisterButton');
const backLoginButton = document.getElementById('backLoginButton');
const forgetPasswordButton = document.getElementById('forgetPasswordButton');

var navButtons = document.querySelectorAll('.login-registerNav');


function login() {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const data = {
        email,
        password,
    };
    window.http.post("/auth/login", data)
        .then(response => {
            console.log('login success:', response);
            location.hash = "#/home";
        })
        .catch(error => { console.error('Error:', error) });

}
loginForm.addEventListener('submit', login);

function register() {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    //* validate email
    if (!emailPattern.test(email)) {
        alert('Enter a valid email address.');
        return;
    }

    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    //* validate password
    if (password !== confirmPassword) {
        alert('Password and confirm password do not match, please try again.');
        return;
    }

    const name = document.getElementById('registerUsername').value;
    //* validate username
    if (name.length < 1 || name.length > 20) {
        alert('Enter a valid username between 1 and 20 characters.');
        return;
    }
    const data = {
        email,
        password,
        name,
    };
    window.http.post("/auth/register", data)
        .then(response => {
            console.log('register success:', response);
            location.hash = "#/home";
        })
        .catch(error => { console.error('Error:', error) });
}
registerForm.addEventListener('submit', register);

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

//todo: 这里的弹窗关闭按钮为确认，不是关闭或X，问一下要不要修改
function showAlert() {
    alert('This feature is not available yet.');
}
forgetPasswordButton.onclick = showAlert;