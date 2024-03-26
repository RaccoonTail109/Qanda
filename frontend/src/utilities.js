export function toast(message, type) {
    var toastContainer = document.getElementById("popToast");
    var toastBody = toastContainer.querySelector(".toast-body");
    var closeButton = toastContainer.querySelector(".btn-close");
    console.log("entering toast");
    toastBody.textContent = message;

    if (type === 'success') {
        toastContainer.classList.remove('text-bg-primary');
        toastContainer.classList.remove('text-bg-danger');
        toastContainer.classList.add('text-bg-success');
    } else if (type === 'error') {
        toastContainer.classList.remove('text-bg-primary');
        toastContainer.classList.remove('text-bg-success');
        toastContainer.classList.add('text-bg-danger');
    } else if (type === 'info') {
        toastContainer.classList.remove('text-bg-danger');
        toastContainer.classList.remove('text-bg-success');
        toastContainer.classList.add('text-bg-primary');
    }

    var toast = new bootstrap.Toast(toastContainer, { delay: 2000 });
    toast.show();
}

export function clearNode(node) {
    //* remove all child nodes
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

var createTitleTextarea = document.querySelector('.createThreadTitleInput');
var createThreadContentInput = document.querySelector('.createThreadContentInput');
createTitleTextarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});
createThreadContentInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

export function getThreadId() {
    var hash = location.hash;
    var query = hash.split('?')[1];
    var queryDict = {};
    if (query) {
        query.split('&').forEach(function (item) {
            var [key, value] = item.split('=');
            queryDict[key] = value;
        });
    }
    return queryDict
}