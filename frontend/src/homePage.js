import { clearNode, getThreadId, toast } from './utilities.js';
import { requestFunc } from './request.js';
import { renderEditedDetails } from './editThread.js';

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
        listLikeNumber.textContent = window.__ThreadDetails__.find(threadDetails => threadDetails.id === thread.id).likes?.length || 0;

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
    var userInfoString = localStorage.getItem('userInfo');
    var userInfo = JSON.parse(userInfoString);
    var isAdmin = userInfo.admin;
    // console.log('Rendering thread with ID:', threadId);
    // console.log('Available threads:', window.__ThreadDetails__);

    const numericThreadId = Number(threadId);

    for (let i = 0; i < window.__ThreadDetails__.length; i++) {
        if (window.__ThreadDetails__[i].id === numericThreadId) {
            threadDetails = window.__ThreadDetails__[i];
            break;
        }
    };

    if (threadDetails) {
        console.log('threadDetails:', threadDetails);

        const threadContentTitle = document.createElement('div');
        threadContentTitle.classList.add('threadContentTitle');
        threadContentTitle.textContent = threadDetails.title;

        const threadInfoRow = document.createElement('div');
        threadInfoRow.classList.add('threadInfoRow');

        const threadInfoLeft = document.createElement('div');
        threadInfoLeft.classList.add('threadInfoLeft');

        const threadInfoAuthor = document.createElement('div');
        threadInfoAuthor.classList.add('threadInfoAuthor');
        threadInfoAuthor.textContent = threadDetails.creator.name;

        threadInfoLeft.appendChild(threadInfoAuthor);

        const threaadInfoTime = document.createElement('div');
        threaadInfoTime.classList.add('threaadInfoTime');
        threaadInfoTime.textContent = new Date(threadDetails.createdAt).toLocaleString();

        threadInfoLeft.appendChild(threaadInfoTime);

        const threadContentDetailContainer = document.createElement('div');
        threadContentDetailContainer.classList.add('threadContentDetailContainer');
        threadContentDetailContainer.textContent = threadDetails.content;

        const operatorContainer = document.createElement('div');
        operatorContainer.classList.add('operatorContainer');

        const operatorRightContainer = document.createElement('div');
        operatorRightContainer.classList.add('operatorRightContainer');

        const likeButton = document.createElement('button');
        likeButton.classList.add('threadContentOperator');
        const likeImg = document.createElement('img');
        likeImg.src = threadDetails.likes?.includes(Number(userInfo.id))
            ? './styles/asset/like_fill.svg'
            : './styles/asset/like_empty.svg';
        likeImg.alt = threadDetails.likes?.includes(Number(userInfo.id))
            ? 'unlike'
            : 'like';
        likeButton.appendChild(likeImg);
        likeButton.appendChild(document.createTextNode(' Like'));
        likeButton.addEventListener('click', () => {
            const turnon = threadDetails.likes?.includes(Number(userInfo.id)) ? false : true;
            const data = {
                id: threadDetails.id,
                turnon,
            }
            requestFunc.likeThread(data)
                .then(() => {
                    const userInfoString = localStorage.getItem('userInfo');
                    const userInfo = JSON.parse(userInfoString);
                    const userId = userInfo.id;
                    if (turnon) {
                        window.__ThreadDetails__.find(thread => thread.id === data.id).likes.push(userId);
                    } else {
                        window.__ThreadDetails__.find(thread => thread.id === data.id).likes = threadDetails.likes.filter(id => id !== userId);
                    }
                    // renderThreadsList(window.__ThreadDetails__, document.querySelector('.threadListContainer'));
                    // console.log('threadDetail1212:', window.__ThreadDetails__);
                    renderThreadContent(threadId);
                })
        })

        const commentButton = document.createElement('div');
        commentButton.classList.add('threadContentComment');
        const commentImg = document.createElement('img');
        commentImg.classList.add('commentImg');
        commentImg.src = './styles/asset/comment.svg';
        commentImg.alt = 'comment';
        const splitline = document.createElement('img');
        splitline.src = './styles/asset/split.svg';
        splitline.alt = 'split';
        commentButton.appendChild(commentImg);
        commentButton.appendChild(splitline);
        const commentInput = document.createElement('input');
        commentInput.classList.add('commentInput');
        commentInput.classList.add('commentInput');
        commentInput.placeholder = 'Add a comment...';
        commentButton.appendChild(commentInput);



        const watchButton = document.createElement('button');
        watchButton.classList.add('threadContentOperator');
        const watchImg = document.createElement('img');
        watchImg.classList.add('watchImg');
        watchImg.src = threadDetails.watchees?.includes(Number(userInfo.id))
            ? './styles/asset/eye-close.svg'
            : './styles/asset/eye.svg';
        watchImg.alt = threadDetails.watchess?.includes(Number(userInfo.id))
            ? 'unwatch'
            : 'watch';
        watchButton.appendChild(watchImg);
        watchButton.appendChild(document.createTextNode(' Watch'));
        watchButton.addEventListener('click', () => {
            const turnon = threadDetails.watchees?.includes(Number(userInfo.id))
                ? false
                : true;
            const data = {
                id: threadDetails.id,
                turnon,
            }
            console.log(data);
            requestFunc.watchThread(data)
                .then(() => {
                    const userInfoString = localStorage.getItem('userInfo');
                    const userInfo = JSON.parse(userInfoString);
                    const userId = userInfo.id;
                    if (turnon) {
                        window.__ThreadDetails__.find(thread => thread.id === data.id).watchees.push(userId);
                    } else {
                        window.__ThreadDetails__.find(thread => thread.id === data.id).watchees = threadDetails.watchees.filter(id => id !== userId);
                    }
                    renderThreadContent(threadId);
                })
        });

        operatorRightContainer.appendChild(likeButton);
        operatorRightContainer.appendChild(watchButton);

        operatorContainer.appendChild(commentButton);
        operatorContainer.appendChild(operatorRightContainer);

        threadInfoRow.appendChild(threadInfoLeft);

        threadDetailContainer.appendChild(threadContentTitle);
        threadDetailContainer.appendChild(threadInfoRow);
        threadDetailContainer.appendChild(threadContentDetailContainer);
        threadDetailContainer.appendChild(operatorContainer);

        if (threadDetails.creator.id === Number(JSON.parse(window.localStorage.getItem('userInfo')).id) || isAdmin === true) {
            const threadInfoRight = document.createElement('div');
            threadInfoRight.classList.add('threadInfoRight');

            const editButton = document.createElement('div');
            editButton.classList.add('threadEditButton');
            const editImg = document.createElement('img');
            editImg.src = './styles/asset/edit.svg';
            editImg.alt = 'edit';

            const deleteButton = document.createElement('div');
            const deleteImg = document.createElement('img');
            deleteImg.src = './styles/asset/delete.svg';
            deleteImg.alt = 'delete';

            editButton.appendChild(editImg);
            deleteButton.appendChild(deleteImg);
            threadInfoRight.appendChild(deleteButton);
            threadInfoRight.appendChild(editButton);
            threadInfoRow.appendChild(threadInfoRight);

            editButton.addEventListener('click', () => {
                window.__CurrentThreadDetails__ = threadDetails;
                renderEditedDetails(window.__CurrentThreadDetails__.title, window.__CurrentThreadDetails__.content, window.__CurrentThreadDetails__.isPublic);
                location.hash = `#edit?threadId=${threadDetails.id}`;
            });

            deleteButton.addEventListener('click', () => {
                const data = {
                    id: threadDetails.id,
                };
                requestFunc.deleteThread(data)
                    .then(() => {
                        window.__ThreadDetails__ = window.__ThreadDetails__.filter(thread => thread.id !== data.id);
                        renderEmptyThreadContent();
                        location.hash = '#home';
                        toast('Delete success', 'success');
                    })
                    .catch(error => {
                        toast(error, 'error');
                    });
            });
        }

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