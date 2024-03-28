import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import { clearNode, toast, getThreadId } from './utilities.js';
import { requestFunc } from './request.js';
import { getModifiedThreadsDetails, renderThreadsList, renderThreadContent, renderEmptyThreadContent } from './homePage.js';

const loginButton = document.getElementById('loginButtonMain');
const logoutButton = document.getElementById('logoutButton');
const homeSideNav = document.getElementById('homeSideNav');
const threadSideNav = document.getElementById('threadSideNav');
const userSideNav = document.getElementById('userSideNav');
const createThreadButton = document.getElementById('createThreadIconButton');
const createComeBackButton = document.getElementById("createComeBackButton");

function hideLoadingPage() {
    const loadingPage = document.getElementById('loadingIconPage');
    loadingPage.style.display = 'none';
}

function showMainPage(targetPage) {
    const mainPage = document.getElementById('mainContainer');
    const loginPage = document.getElementById('loginContainer');
    const createThreadPage = document.getElementById('createPage');
    const editThreadPage = document.getElementById('editPage');
    const footer = document.querySelector('#footer');
    // show the main page and hide the login page
    mainPage.classList.remove('hidden');
    createThreadPage.classList.add('hidden');
    editThreadPage.classList.add('hidden');
    loginPage.classList.add('hidden');
    // footer.classList.remove('hidden');
    //show the target page
    const [pageName] = targetPage.split('?');
    const targetPageElement = document.querySelector(`#${pageName}Page`);
    const homePage = document.getElementById('homePage');
    const threadPage = document.getElementById('threadPage');
    const userPage = document.getElementById('userPage');

    // hide all pages
    homePage.classList.add('hidden');
    threadPage.classList.add('hidden');
    userPage.classList.add('hidden');
    // show the target page
    targetPageElement.classList.remove('hidden');
    if (pageName === 'home') {
        requestFunc.getThreadDetails()
            .then((threadsDetails) => {
                const threadListContainer = document.querySelector('.threadListContainer');
                clearNode(threadListContainer);
                getModifiedThreadsDetails(threadsDetails)
                    .then(() => {
                        renderThreadsList(window.__ThreadDetails__, threadListContainer);

                        const threadIdDict = getThreadId();
                        // console.log(threadIdDict);
                        const threadId = threadIdDict?.threadId;

                        if (threadId) {
                            renderThreadContent(threadId);
                        } else {
                            renderEmptyThreadContent();
                        }
                    })
            });
    }
}

function showLoginPage() {
    //show the login page and hide the main page
    const mainPage = document.getElementById('mainContainer');
    const loginPage = document.getElementById('loginContainer');
    const createThreadPage = document.getElementById('createPage');
    const editThreadPage = document.getElementById('editPage');
    mainPage.classList.add('hidden');
    createThreadPage.classList.add('hidden');
    editThreadPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
}

function showCreateThreadPage() {
    const mainPage = document.getElementById('mainContainer');
    const loginPage = document.getElementById('loginContainer');
    const createThreadPage = document.getElementById('createPage');
    const editThreadPage = document.getElementById('editPage');

    mainPage.classList.add('hidden');
    loginPage.classList.add('hidden');
    editThreadPage.classList.add('hidden');
    createThreadPage.classList.remove('hidden');
}

function showEditThreadPage() {
    const mainPage = document.getElementById('mainContainer');
    const loginPage = document.getElementById('loginContainer');
    const createThreadPage = document.getElementById('createPage');
    const editThreadPage = document.getElementById('editPage');

    mainPage.classList.add('hidden');
    loginPage.classList.add('hidden');
    createThreadPage.classList.add('hidden');
    editThreadPage.classList.remove('hidden');
}



loginButton.addEventListener('click', () => {
    location.hash = "#login";
    showLoginPage();
});


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

    const loadingPage = document.getElementById('loadingIconPage');
    loadingPage.style.display = 'block';

    const pageHash = window.location.hash.split('?')[0];
    if (
        pageHash === '#login'
    ) {
        //load the login page
        showLoginPage();
    } else if (pageHash === '' || pageHash === '#home') {
        homeSideNav.classList.remove('active');
        threadSideNav.classList.remove('active');
        userSideNav.classList.remove('active');

        homeSideNav.classList.add('active');
        showMainPage('home');
    } else if (pageHash === '#create') {
        showCreateThreadPage();
    } else if (pageHash === '#edit') {
        showEditThreadPage();
    } else {
        //load the target page
        const targetPage = pageHash.substring(1);
        const targetSideNav = document.getElementById(`${targetPage}SideNav`);
        homeSideNav.classList.remove('active');
        threadSideNav.classList.remove('active');
        userSideNav.classList.remove('active');
        targetSideNav.classList.add('active');
        showMainPage(targetPage);
    }
    setTimeout(() => { hideLoadingPage() }, 500);
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
        window.location.hash === '#login'
    ) {
        //load the login page
        showLoginPage();
    } else if (window.location.hash === '' || window.location.hash === '#home') {
        showMainPage('home');
    } else if (window.location.hash === '#create') {
        showCreateThreadPage();
    } else if (window.location.hash === '#edit') {
        showEditThreadPage();
    } else {
        //load the target page
        const targetPage = window.location.hash.substring(1);
        showMainPage(targetPage);
    }
});

logoutButton.addEventListener('click', () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('userInfo');
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    location.hash = "#login";
    toast('Logout success', 'success');
});

function goCreateThreadPage() {
    window.location.hash = "#create";
}
createThreadButton.addEventListener('click', goCreateThreadPage);

function backHomePage() {
    window.location.hash = "#home";
}
createComeBackButton.addEventListener('click', backHomePage);