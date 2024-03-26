import { toast } from './utilities.js';

const loginButton = document.getElementById('loginButtonMain');
const registerButton = document.getElementById('registerButton');

const base_url = 'http://localhost:5005';
const defaultOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
}
const http = {
    get: get,
    post: post,
};

function get(url) {
    return fetch(`${base_url}${url}`, {
        ...defaultOptions,
        headers: {
            ...defaultOptions.headers,
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    })
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => console.error('Error:', error));
}

function post(url, data) {
    return fetch(`${base_url}${url}`, {
        ...defaultOptions,
        method: 'POST',
        headers: {
            ...defaultOptions.headers,
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.error('Error:', error));
}

const requestFunc = {
    login: login,
    register: register,
    getThreadDetails: getThreadDetails,
    submitCreatedThread: submitCreatedThread,
}

function submitCreatedThread(data) {
    http.post('/thread', data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                console.log('thread created:', response);
                toast('Thread created', 'success');
                setTimeout(() => { window.location.hash = '#/home'; }, 700);
            }
        })

}
function login(data) {
    http.post("/auth/login", data)
        .then(response => {
            console.log('login success:', response);
            if (response.error) {
                throw new Error(response.error);
            } else {
                const token = response.token;
                window.localStorage.setItem('token', token);
                toast('Login success', 'success');
                loginButton.classList.add('hidden');
                logoutButton.classList.remove('hidden');
                setTimeout(() => {
                    location.hash = "#/home";
                }, 700);
            }
        })
        .catch(error => { toast(error, 'error') });
}
function register(data) {
    http.post("/auth/register", data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                console.log('register success:', response);
                const token = response.token;
                window.localStorage.setItem('token', token);
                toast('Register success', 'success');
                setTimeout(() => {
                    location.hash = "#/home";
                }, 700);
            }
        })
        .catch(error => { toast(error, 'error') });
}

function getThreadDetails() {
    return http.get('/threads?start=0')
        .then(data => {
            console.log("threads:", data);
            const threadDetailPromises = data.map((threadId) => {
                return http.get(`/thread?id=${threadId}`);
            });
            return Promise.all(threadDetailPromises);
        });
}

export { requestFunc };