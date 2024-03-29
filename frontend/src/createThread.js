import { toast } from './utilities.js';
import { requestFunc } from './request.js';

const submitThreadButton = document.getElementById('submitThreadButton');
const publicThreadCheckbox = document.getElementById('publicThreadCheckbox');
const createComeBackButton = document.getElementById('createComeBackButton')
const createThreadIconButton = document.getElementById('createThreadIconButton');

const createThreadTitleInput = document.getElementById('createThreadTitleInput');
const createThreadContentInput = document.getElementById('createThreadContentInput');

function clearTextarea() {
    createThreadTitleInput.value = '';
    createThreadContentInput.value = '';
    publicThreadCheckbox.checked = true;
    createThreadTitleInput.style.height = "1.5em";
    createThreadContentInput.style.height = "1.5em";
}

createComeBackButton.addEventListener('click', clearTextarea);
createThreadIconButton.addEventListener('click', clearTextarea);

function submitThread() {
    event.preventDefault();
    const title = createThreadTitleInput.value;
    const content = createThreadContentInput.value;
    const isPublic = publicThreadCheckbox.checked;
    if (title.length === 0) {
        const toast = new bootstrap.Toast(toastCreateError, {
            delay: 2000,
        });
        const toastBody = document.getElementById('toast-body-create-error');
        toastBody.textContent = 'Title cannot be empty.';
        toast.show();
        return;
    } else if (content.length === 0) {
        const toast = new bootstrap.Toast(toastCreateError, {
            delay: 2000,
        });
        const toastBody = document.getElementById('toast-body-create-error');
        toastBody.textContent = 'Content cannot be empty.';
        toast.show();
        return;
    }
    const data = {
        title,
        content,
        isPublic,
    }

    requestFunc.submitCreatedThread(data);
    const toast = new bootstrap.Toast(toastSuccess, {
        delay: 2000,
    });
    const toastBody = document.getElementById('toast-body-success');
    toastBody.textContent = 'Thread created successfully.';
    toast.show();
}
submitThreadButton.addEventListener('click', submitThread);
