import { clearNode, getThreadId } from './utilities.js';
import { requestFunc } from './request.js';

export function getModifiedThreadsDetails(threadsDetails) {
    const creatorIds = threadsDetails.map((thread) => thread.creatorId);
    const userDetailsPromises = creatorIds.map((creatorId) => requestFunc.getUserDetails(creatorId));

    return Promise.all(userDetailsPromises)
        .then((userDetails) => {
            const userDetailMap = userDetails.reduce((acc, cur) => {
                acc[cur.id] = cur;
                return acc;
            }, {});

            threadsDetails.forEach((thread) => {
                thread.creator = userDetailMap[thread.creatorId];
            });
            window.__ThreadDetails__ = threadsDetails;
        });
}

export function renderThreadsList(threadsDetails, threadListContainer) {
    threadsDetails.forEach((thread) => {

        const threadListElement = document.createElement('div');
        threadListElement.classList.add('threadListElement');
        threadListElement.classList.remove('active')

        threadListElement.addEventListener('click', () => {
            const threadId = thread.id;
            history.pushState(null, null, `#home?threadId=${threadId}`);
            renderThreadContent(threadId);
            const activeElements = threadListContainer.querySelectorAll('.selected');
            activeElements.forEach(element => {
                element.classList.remove('selected');
            });
            threadListElement.classList.add('selected');
        });

        const threadTitleRow = document.createElement('div');
        threadTitleRow.classList.add('threadTitleRow');

        const threadListTitle = document.createElement('div');
        threadListTitle.classList.add('threadListTitle');
        threadListTitle.textContent = thread.title;

        const threadLikeIcon = document.createElement('div');
        threadLikeIcon.classList.add('threadLikeIcon');

        const threadLikeIconImg = document.createElement('img');
        threadLikeIconImg.src = './styles/asset/like_empty.svg';

        const listLikeNumber = document.createElement('div');
        listLikeNumber.classList.add('listLikeNumber');
        listLikeNumber.textContent = thread.likes?.length || 0;

        const threadListFooter = document.createElement('div');
        threadListFooter.classList.add('threadListFooter');

        const threadAuthor = document.createElement('p');
        threadAuthor.classList.add('threadAuthor');
        threadAuthor.textContent = thread.creator.name;

        const threadTime = document.createElement('p');
        threadTime.classList.add('threadTime');
        threadTime.textContent = new Date(thread.createdAt).toLocaleString();

        threadListFooter.appendChild(threadAuthor);
        threadListFooter.appendChild(threadTime);

        threadLikeIcon.appendChild(threadLikeIconImg);
        threadLikeIcon.appendChild(listLikeNumber);

        threadTitleRow.appendChild(threadListTitle);
        threadTitleRow.appendChild(threadLikeIcon);

        threadListElement.appendChild(threadTitleRow);
        threadListElement.appendChild(threadListFooter);

        threadListContainer.appendChild(threadListElement);

    });
}

export function renderThreadContent(threadId) {
    const threadDetailContainer = document.querySelector('.threadDetailContainer');
    clearNode(threadDetailContainer);
    let threadDetails;
    console.log('Rendering thread with ID:', threadId);
    console.log('Available threads:', window.__ThreadDetails__);

    const numericThreadId = Number(threadId);

    for (let i = 0; i < window.__ThreadDetails__.length; i++) {
        if (window.__ThreadDetails__[i].id === numericThreadId) {
            threadDetails = window.__ThreadDetails__[i];
            break;
        }
    };

    if (threadDetails) {
        const threadContentTitle = document.createElement('div');
        threadContentTitle.classList.add('threadContentTitle');
        threadContentTitle.textContent = threadDetails.title;

        const threadInfoRow = document.createElement('div');
        threadInfoRow.classList.add('threadInfoRow');

        const threadInfoAuthor = document.createElement('div');
        threadInfoAuthor.classList.add('threadInfoAuthor');
        threadInfoAuthor.textContent = threadDetails.creator.name;

        const operatorContainer = document.createElement('div');
        operatorContainer.classList.add('operatorContainer');

        const likeButton = document.createElement('button');
        likeButton.classList.add('threadContentOperator');
        const likeImg = document.createElement('img');
        likeImg.src = './styles/asset/like_empty.svg';
        likeImg.alt = 'like';
        likeButton.appendChild(likeImg);
        likeButton.appendChild(document.createTextNode(' Like'));

        const commentButton = document.createElement('button');
        commentButton.classList.add('threadContentOperator');
        const commentImg = document.createElement('img');
        commentImg.src = './styles/asset/comment.svg';
        commentImg.alt = 'comment';
        commentButton.appendChild(commentImg);
        commentButton.appendChild(document.createTextNode(' Comment'));

        operatorContainer.appendChild(likeButton);
        operatorContainer.appendChild(commentButton);

        threadInfoRow.appendChild(threadInfoAuthor);
        threadInfoRow.appendChild(operatorContainer);

        const threadContentDetailContainer = document.createElement('div');
        threadContentDetailContainer.classList.add('threadContentDetailContainer');
        threadContentDetailContainer.textContent = threadDetails.content;

        threadDetailContainer.appendChild(threadContentTitle);
        threadDetailContainer.appendChild(threadInfoRow);
        threadDetailContainer.appendChild(threadContentDetailContainer);
    } else {
        console.log(`Thread with ID ${threadId} not found.`);
        const notFoundMessage = document.createElement('div');
        notFoundMessage.textContent = `Thread with ID ${threadId} not found.`;
        threadDetailContainer.appendChild(notFoundMessage);
    }
}
export function renderEmptyThreadContent() {
    const threadDetailContainer = document.querySelector('.threadDetailContainer');
    clearNode(threadDetailContainer);

    const emptyIconContainer = document.createElement('div');
    emptyIconContainer.className = 'emptyIconContainer';

    const img = document.createElement('img');
    img.src = './styles/asset/empty.svg';
    img.alt = 'empty';

    const emptyTitleSentence = document.createElement('div');
    emptyTitleSentence.className = 'enmptyTitleSentence';
    emptyTitleSentence.textContent = 'Select a post to begin your journey.';

    const emptySentence = document.createElement('div');
    emptySentence.className = 'enmptySentence';
    emptySentence.textContent = 'Explore and engage by diving into topics that spark your interest.';

    emptyIconContainer.appendChild(img);
    emptyIconContainer.appendChild(emptyTitleSentence);
    emptyIconContainer.appendChild(emptySentence);

    threadDetailContainer.appendChild(emptyIconContainer);

}