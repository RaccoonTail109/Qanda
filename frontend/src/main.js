import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

// 获取所有的页面元素
const homePage = document.getElementById('homePage');
const threadPage = document.getElementById('threadPage');
const userPage = document.getElementById('userPage');
const loginContainer = document.getElementById('loginContainer');
const mainContainer = document.getElementById('mainContainer');

// 获取登录按钮和导航条中的登录链接
const loginButton = document.getElementById('login');
const loginLink = document.querySelector('a[href="#/login"]');

// 显示页面函数
function showPage(pageElement) {
    // 隐藏所有页面
    homePage.classList.add('hidden');
    threadPage.classList.add('hidden');
    userPage.classList.add('hidden');
    loginContainer.classList.add('hidden');
    mainContainer.classList.remove('hidden');

    // 显示指定页面
    pageElement.classList.remove('hidden');
}

// 处理导航条点击事件函数
function handleNavClick(event) {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        const hash = event.target.getAttribute('href');

        switch (hash) {
            case '#/home':
                showPage(homePage);
                break;
            case '#/thread':
                showPage(threadPage);
                break;
            case '#/user':
                showPage(userPage);
                break;
            case '#/login':
                showPage(loginContainer);
                mainContainer.classList.add('hidden');
                break;
        }
    }
}

// 处理登录按钮点击事件函数
function handleLoginClick() {
    showPage(homePage);
    loginLink.classList.add('hidden');
}

// 初始化函数
function init() {
    // 默认显示主页
    showPage(homePage);

    // 添加事件监听器
    document.querySelector('nav').addEventListener('click', handleNavClick);
    loginButton.addEventListener('click', handleLoginClick);
}

// 调用初始化函数
init();

