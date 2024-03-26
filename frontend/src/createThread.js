import { toast } from './utilities.js';
import { requestFunc } from './request.js';
const submitThreadButton = document.getElementById('submitThreadButton');
const publicThreadCheckbox = document.getElementById('publicThreadCheckbox');
const createComeBackButton = document.getElementById('createComeBackButton');

const createThreadTitleInput = document.getElementById('createThreadTitleInput');
const createThreadContentInput = document.getElementById('createThreadContentInput');

function clearTextarea() {
    createThreadTitleInput.value = '';
    createThreadContentInput.value = '';
    publicThreadCheckbox.checked = true;
}

createComeBackButton.addEventListener('click', clearTextarea);

function submitThread() {
    const title = createThreadTitleInput.value;
    const content = createThreadContentInput.value;
    const isPublic = publicThreadCheckbox.checked;
    if (title.length === 0 || content.length === 0) {
        toast('Please fill in all fields to create', 'error');
        return;
    }
    const data = {
        title,
        content,
        isPublic,
    }

    requestFunc.submitCreatedThread(data);
}
submitThreadButton.addEventListener('click', submitThread);