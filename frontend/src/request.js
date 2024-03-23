const base_url = 'http://localhost:5005';
const defaultOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
}

function get(url) {
    return fetch(`${base_url}${url}`, {
        ...defaultOptions,
    })
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => console.error('Error:', error));
}

function post(url, data) {
    return fetch(`${base_url}${url}`, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => result)
        .catch(error => console.error('Error:', error));
}

const http = {
    get: get,
    post: post,
};

window.http = http;