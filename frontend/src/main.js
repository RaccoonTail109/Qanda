import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import { clearNode } from './utilities.js';

const loginButton = document.getElementById('loginButtonMain');
const logoutButton = document.getElementById('logoutButton');
const homeSideNav = document.getElementById('homeSideNav');
const threadSideNav = document.getElementById('threadSideNav');
const userSideNav = document.getElementById('userSideNav');

function showMainPage(targetPage) {
    const mainPage = document.getElementById('mainContainer');
    const loginPage = document.getElementById('loginContainer');
    const footer = document.querySelector('#footer');
    // show the main page and hide the login page
    mainPage.classList.remove('hidden');
    loginPage.classList.add('hidden');
    // footer.classList.remove('hidden');
    //show the target page
    const targetPageElement = document.querySelector(`#${targetPage}Page`);
    const homePage = document.getElementById('homePage');
    const threadPage = document.getElementById('threadPage');
    const userPage = document.getElementById('userPage');
    // hide all pages
    homePage.classList.add('hidden');
    threadPage.classList.add('hidden');
    userPage.classList.add('hidden');
    // show the target page
    targetPageElement.classList.remove('hidden');
    if (targetPage === 'home') {
        window.requestFunc.getThreadDetails()
            .then((threadsDetails) => {
                console.log("threadsDetails:", threadsDetails);
                const homePage = document.getElementById('homePage');
                clearNode(homePage);
                threadsDetails.forEach((thread) => {
                    const threadElement = document.createElement('div');
                    threadElement.innerHTML = `
                    <h3>${thread.title}</h3>
                    <p>${thread.content}</p>
                    `;
                    homePage.appendChild(threadElement);
                });
            });
    }
}

function showLoginPage() {
    //show the login page and hide the main page
    const mainPage = document.getElementById('mainContainer');
    const loginPage = document.getElementById('loginContainer');
    const footer = document.querySelector('#footer');
    mainPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
    // footer.classList.add('hidden');
    // hideLoadingPage();
}

loginButton.addEventListener('click', () => {
    location.hash = "#/login";
    showLoginPage();
});

function hideLoadingPage() {
    const loadingPage = document.getElementById('loadingIconPage');
    loadingPage.style.display = 'none';
}
function showLoadingPage() {
    const loadingPage = document.getElementById('loadingIconPage');
    loadingPage.style.display = 'block';
}

window.addEventListener('hashchange', function () {
    if (
        window.location.hash === '#/login'
    ) {
        //load the login page
        showLoginPage();
    } else if (window.location.hash === '' || window.location.hash === '#/home') {
        homeSideNav.classList.remove('active');
        threadSideNav.classList.remove('active');
        userSideNav.classList.remove('active');

        homeSideNav.classList.add('active');
        showMainPage('home');
    }
    else {
        //load the target page
        const targetPage = window.location.hash.split('/')[1];
        const targetSideNav = document.getElementById(`${targetPage}SideNav`);
        homeSideNav.classList.remove('active');
        threadSideNav.classList.remove('active');
        userSideNav.classList.remove('active');
        targetSideNav.classList.add('active');
        showMainPage(targetPage);
    }
});

window.addEventListener('load', function () {
    setTimeout(hideLoadingPage, 500);
    if (
        window.location.hash === '#/login'
    ) {
        //load the login page
        showLoginPage();
    } else if (window.location.hash === '' || window.location.hash === '#/home') {
        showMainPage('home');

    } else {
        //load the target page
        const targetPage = window.location.hash.split('/')[1];
        showMainPage(targetPage);
    }
});

logoutButton.addEventListener('click', () => {
    window.localStorage.removeItem('token');
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    location.hash = "#/login";
});