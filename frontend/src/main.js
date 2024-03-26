import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import { clearNode, toast } from './utilities.js';
import { requestFunc } from './request.js';

const loginButton = document.getElementById('loginButtonMain');
const logoutButton = document.getElementById('logoutButton');
const homeSideNav = document.getElementById('homeSideNav');
const threadSideNav = document.getElementById('threadSideNav');
const userSideNav = document.getElementById('userSideNav');
const createThreadButton = document.getElementById('createThreadIconButton');
const createComeBackButton = document.getElementById("createComeBackButton");

function showMainPage(targetPage) {
    const mainPage = document.getElementById('mainContainer');
    const loginPage = document.getElementById('loginContainer');
    const createThreadPage = document.getElementById('createPage');
    const footer = document.querySelector('#footer');
    // show the main page and hide the login page
    mainPage.classList.remove('hidden');
    createThreadPage.classList.add('hidden');
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
        requestFunc.getThreadDetails()
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
    const createThreadPage = document.getElementById('createPage');
    const footer = document.querySelector('#footer');
    mainPage.classList.add('hidden');
    createThreadPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
    // footer.classList.add('hidden');
    // hideLoadingPage();
}
function showCreateThreadPage() {
    const mainPage = document.getElementById('mainContainer');
    const loginPage = document.getElementById('loginContainer');
    const createThreadPage = document.getElementById('createPage');

    mainPage.classList.add('hidden');
    loginPage.classList.add('hidden');
    createThreadPage.classList.remove('hidden');
}

loginButton.addEventListener('click', () => {
    location.hash = "#/login";
    showLoginPage();
});

function hideLoadingPage() {
    const loadingPage = document.getElementById('loadingIconPage');
    loadingPage.style.display = 'none';
}

window.addEventListener('hashchange', function () {
    const token = window.localStorage.getItem('token');

    if (token) {
        // If the user is logged in, show the logout button and hide the login button
        loginButton.classList.add('hidden');
        logoutButton.classList.remove('hidden');
    } else {
        // If the user is not logged in, show the login button and hide the logout button
        loginButton.classList.remove('hidden');
        logoutButton.classList.add('hidden');
    }

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
    } else if (window.location.hash === '#/create') {
        showCreateThreadPage();
    } else {
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
    const token = window.localStorage.getItem('token');

    if (token) {
        // If the user is logged in, show the logout button and hide the login button
        loginButton.classList.add('hidden');
        logoutButton.classList.remove('hidden');
    } else {
        // If the user is not logged in, show the login button and hide the logout button
        loginButton.classList.remove('hidden');
        logoutButton.classList.add('hidden');
    }

    setTimeout(hideLoadingPage, 500);

    if (
        window.location.hash === '#/login'
    ) {
        //load the login page
        showLoginPage();
    } else if (window.location.hash === '' || window.location.hash === '#/home') {
        showMainPage('home');
    } else if (window.location.hash === '#/create') {
        showCreateThreadPage();
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
    toast('Logout success', 'success');
});

function goCreateThreadPage() {
    window.location.hash = "#/create";
}
createThreadButton.addEventListener('click', goCreateThreadPage);

function backHomePage() {
    window.location.hash = "#/home";
}
createComeBackButton.addEventListener('click', backHomePage);