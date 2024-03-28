import { toast } from './utilities.js';
import { renderThreadContent } from './homePage.js';

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
    put: put,
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

function put(url, data) {
    return fetch(`${base_url}${url}`, {
        ...defaultOptions,
        method: 'PUT',
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

function deleteMethod(url, data) {
    return fetch(`${base_url}${url}`, {
        ...defaultOptions,
        method: 'DELETE',
        headers: {
            ...defaultOptions.headers,
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(data),
    })
}

const requestFunc = {
    login: login,
    register: register,
    getThreadDetails: getThreadDetails,
    submitCreatedThread: submitCreatedThread,
    getUserDetails: getUserDetails,
    updateThread: updateThread,
    likeThread: likeThread,
    watchThread: watchThread,
    deleteThread: deleteThread,
    createNewComment: createNewComment,
    getComments: getComments,
    deleteComment: deleteComment,
    likeComment: likeComment,
    editComment: editComment,
}

function editComment(data) {
    return http.put('/comment', data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                console.log('comment edited:', response);
                toast('Comment edited', 'success');
            }
        }).catch(error => { toast(error, 'error') })

}

function deleteComment(data) {
    return deleteMethod('/comment', data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                // console.log('comment deleted:', response);
                toast('Comment deleted', 'success');
            }
        }).catch(error => { toast(error, 'error') })
}

function likeComment(data) {
    return http.put('/comment/like', data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                console.log('comment liked:', response);
                return response;
            }
        }).catch(error => { console.log('error:', error); toast(error, 'error') })
}

function getComments(threadId) {
    return http.get(`/comments?threadId=${threadId}`)
        .then((comments) => {
            // console.log('comments:', comments);
            return comments;
        })
}

function createNewComment(data) {
    return http.post('/comment', data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                // console.log('comment created:', response);
                return response;
            }
        }).catch(error => { console.log('error:', error); toast(error, 'error') })
}
function deleteThread(data) {
    return deleteMethod('/thread', data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                console.log('thread deleted:', response);
                toast('Thread deleted', 'success');
            }
        }).catch(error => { toast(error, 'error') })

}

function updateThread(data) {
    http.put('/thread', data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                console.log('thread updated:', response);
                const threadId = data.id;
                location.hash = `#home?threadId=${threadId}`;
                console.log('threadId:', threadId);
                toast('Thread updated', 'success');
            }
        }).catch(error => { toast(error, 'error') })
}

function likeThread(data) {
    return http.put('/thread/like', data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                console.log('thread liked:', response);
                return response;
            }
        }).catch(error => { console.log('error:', error); toast(error, 'error') })

}

function watchThread(data) {
    return http.put('/thread/watch', data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                console.log('thread watched:', response);
                return response;
            }
        }).catch(error => { console.log('error:', error); toast(error, 'error') })

}

function submitCreatedThread(data) {
    http.post('/thread', data)
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            } else {
                console.log('thread created:', response);
                const threadId = response.id;
                location.hash = `#home?threadId=${threadId}`;
                toast('Thread created', 'success');
                // console.log('threadId:', threadId);

            }
        }).catch(error => { toast(error, 'error') })
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
                const userId = response.userId;
                getUserDetails(userId)
                    .then(userDetails => {
                        window.localStorage.setItem('userInfo', JSON.stringify(userDetails));
                        toast('Login success', 'success');
                        loginButton.classList.add('hidden');
                        logoutButton.classList.remove('hidden');
                        setTimeout(() => {
                            location.hash = "#home";
                        }, 700);
                    });
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
                const userId = response.userId;
                getUserDetails(userId)
                    .then(userDetails => {
                        window.localStorage.setItem('userInfo', JSON.stringify(userDetails));
                        toast('Register success', 'success');
                        loginButton.classList.add('hidden');
                        logoutButton.classList.remove('hidden');
                        setTimeout(() => {
                            location.hash = "#home";
                        }, 700);
                    });
            }
        })
        .catch(error => { toast(error, 'error') });
}

// function getThreadDetails() {
//     return http.get('/threads?start=0')
//         .then(data => {
//             console.log("threads:", data);
//             const threadDetailPromises = data.map((threadId) => {
//                 return http.get(`/thread?id=${threadId}`);
//             });
//             return Promise.all(threadDetailPromises);
//         });
// }

function getThreadDetails(start = 0) {
    return http.get(`/threads?start=${start}`)
        .then(data => {
            // console.log("threads:", data);
            if (data.length === 0) {
                return [];
            } else {
                const threadDetailPromises = data.map((threadId) => {
                    return http.get(`/thread?id=${threadId}`);
                });
                return Promise.all(threadDetailPromises)
                    .then(threadDetails => {
                        return getThreadDetails(start + data.length)
                            .then(nextThreadDetails => {
                                return [...threadDetails, ...nextThreadDetails];
                            });
                    });
            }
        });
}

function getUserDetails(usrerId) {
    return http.get(`/user?userId=${usrerId}`)
        .then(userDetails => {
            return userDetails;
        })
        .catch(error => console.error('Error:', error));
}

export { requestFunc };