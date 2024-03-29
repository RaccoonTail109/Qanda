import { toast } from './utilities.js';
import { requestFunc } from './request.js';

const editComeBackButton = document.getElementById('editComeBackButton');
const submitEditThreadButton = document.getElementById('submitEditThreadButton');
const editPublicThreadCheckbox = document.getElementById('editPublicThreadCheckbox');

var editThreadTitleInput = document.getElementById('editThreadTitleInput');
var editThreadContentInput = document.getElementById('editThreadContentInput');

function clearEditTextarea() {
    editThreadTitleInput.value = '';
    editThreadContentInput.value = '';
    editPublicThreadCheckbox.checked = true
    const hashAdress = location.hash;
    const threadId = hashAdress.split('=')[1];
    location.hash = `#home?threadId=${threadId}`;
}
editComeBackButton.addEventListener('click', clearEditTextarea);

export function renderEditedDetails(title, content, isPublic) {
    editThreadTitleInput.value = title;
    editThreadContentInput.value = content;
    editPublicThreadCheckbox.checked = isPublic;
    editThreadTitleInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
    editThreadContentInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
    setTimeout(() => {
        editThreadTitleInput.dispatchEvent(new Event('input'));
        editThreadContentInput.dispatchEvent(new Event('input'));
    }, 100);
}

function EditThread() {
    event.preventDefault();
    const title = editThreadTitleInput.value;
    const content = editThreadContentInput.value;
    const isPublic = editPublicThreadCheckbox.checked;
    console.log("window.__CurrentThreadDetails__", window.__CurrentThreadDetails__);
    const threadId = window.__CurrentThreadDetails__.id;
    console.log("window.__CurrentThreadDetails__.id", window.__CurrentThreadDetails__.id);
    const lock = window.__CurrentThreadDetails__.lock;
    console.log("window.__CurrentThreadDetails__.lock", window.__CurrentThreadDetails__.lock);
    if (title.length === 0 || content.length === 0) {
        const toast = new bootstrap.Toast(toastEditError, {
            delay: 2000,
        });
        const toastBody = document.getElementById('toast-body-edit-error');
        toastBody.textContent = 'Title or content cannot be empty.';
        toast.show();
        return;
    }
    const data = {
        id: threadId,
        title,
        isPublic,
        lock,
        content,
    }

    requestFunc.updateThread(data);
    const toast = new bootstrap.Toast(toastSuccess, {
        delay: 2000,
    });
    const toastBody = document.getElementById('toast-body-success');
    toastBody.textContent = 'Thread updated successfully.';
    toast.show();
}
submitEditThreadButton.addEventListener('click', EditThread);