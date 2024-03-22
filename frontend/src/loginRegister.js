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
    fetch("http://localhost:5005/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('login success:', data);
        });
    // location.hash = "#/home";
}
loginForm.addEventListener('submit', login);

//? 为什么这里成功注册后database.json里没有username?
function register() {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const username = document.getElementById('registerUsername').value;
    const data = {
        email,
        password,
        username,
    };
    fetch("http://localhost:5005/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('register success:', data);
        });
    // location.hash = "#/home";
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