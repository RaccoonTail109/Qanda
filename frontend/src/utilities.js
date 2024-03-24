export function toast(message, type) {
    var toastContainer = document.getElementById("popToast");
    var toastBody = toastContainer.querySelector(".toast-body");
    var closeButton = toastContainer.querySelector(".btn-close");

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

    var toast = new bootstrap.Toast(toastContainer, { delay: 5000 });
    toast.show();
}

export function clearNode(node) {
    //* equal to node.innerHTML = '';
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}