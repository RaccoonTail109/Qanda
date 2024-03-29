import { clearNode, toast } from './utilities.js';
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

        const threadTitleRow = document.createElement('div');
        threadTitleRow.classList.add('threadTitleRow');

        const threadListTitle = document.createElement('div');
        threadListTitle.classList.add('threadListTitle');
        threadListTitle.textContent = thread.title;

        threadListTitle.addEventListener('click', () => {
            const threadId = thread.id;
            history.pushState(null, null, `#home?threadId=${threadId}`);
            renderThreadContent(threadId);
            const activeElements = threadListContainer.querySelectorAll('.selected');
            activeElements.forEach(element => {
                element.classList.remove('selected');
            });
            threadListElement.classList.add('selected');
        });

        const threadLikeIcon = document.createElement('div');
        threadLikeIcon.classList.add('threadLikeIcon');

        const threadLikeIconImg = document.createElement('img');
        threadLikeIconImg.src = './styles/asset/like_empty.svg';

        const listLikeNumber = document.createElement('div');
        listLikeNumber.classList.add('listLikeNumber');
        listLikeNumber.textContent = window.__ThreadDetails__.find(threadDetails => threadDetails.id === thread.id).likes?.length || 0;

        const threadListFooter = document.createElement('div');
        threadListFooter.classList.add('threadListFooter');

        const threadAuthor = document.createElement('a');
        threadAuthor.classList.add('threadAuthor');
        threadAuthor.textContent = thread.creator.name;

        threadAuthor.addEventListener('click', () => {
            window.location.hash = `#user?userId=${thread.creator.id}`;
        });

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
        // console.log('threadDetails:', threadDetails);
        const threadContentTitle = document.createElement('div');
        threadContentTitle.classList.add('threadContentTitle');
        threadContentTitle.textContent = threadDetails.title;

        const threadInfoRow = document.createElement('div');
        threadInfoRow.classList.add('threadInfoRow');

        const threadInfoLeft = document.createElement('div');
        threadInfoLeft.classList.add('threadInfoLeft');

        const threadInfoAuthorRow = document.createElement('div');
        threadInfoAuthorRow.classList.add('threadInfoAuthorRow');
        // threadInfoAuthorInfo.textContent = threadDetails.creator.name;

        threadInfoLeft.appendChild(threadInfoAuthorRow);

        const threadInfoBy = document.createElement('div');
        threadInfoBy.textContent = 'Author: ';
        threadInfoBy.classList.add('threadInfoBy');
        threadInfoAuthorRow.appendChild(threadInfoBy);

        const threadInfoAuthor = document.createElement('a');
        threadInfoAuthor.classList.add('threadInfoAuthor');
        threadInfoAuthor.textContent = threadDetails.creator.name;
        threadInfoAuthorRow.appendChild(threadInfoAuthor);

        threadInfoAuthor.addEventListener('click', () => {
            window.location.hash = `#user?userId=${threadDetails.creator.id}`;
        })

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
        likeButton.appendChild(document.createTextNode(threadDetails.likes?.length || "Like"));
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
                    //todo: 点赞之后重新渲染threadList,但是目前这么写有bug，当点击like后，threadList会重新渲染，但是会增加一个Element，而不是替换原来的Element
                    clearNode(document.querySelector('.threadListContainer'));
                    renderThreadsList(window.__ThreadDetails__, document.querySelector('.threadListContainer'));
                    console.log('threadDetail1212:', window.__ThreadDetails__);
                    renderThreadContent(threadId);
                })
        })

        const commentButton = document.createElement('div');
        commentButton.classList.add('threadContentComment');
        const commentImg = document.createElement('img');
        commentImg.classList.add('commentImg');
        commentImg.src = './styles/asset/submit.svg';
        commentImg.alt = 'comment';

        commentButton.appendChild(commentImg);
        const commentInput = document.createElement('input');
        commentInput.classList.add('commentInput');
        commentInput.classList.add('commentInput');
        commentInput.placeholder = 'Add a comment...';
        commentInput.id = 'commentInput';
        commentButton.appendChild(commentInput);

        commentImg.addEventListener('click', () => {
            console.log('commentImg clicked');
            const commentContent = commentInput.value;
            if (commentContent.length === 0) {
                toast('Comment can not be empty', 'error');
                return;
            }
            const data = {
                content: commentContent,
                threadId: threadDetails.id,
                parentCommentId: null,
            }
            requestFunc.createNewComment(data)
                .then((data) => {
                    // console.log('comment success:', data);
                    toast('Comment success', 'success');
                    commentInput.value = '';
                    renderCommentList(threadId);
                })
        });

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

        const commentContainer = document.createElement('div');
        commentContainer.classList.add('commentContainer');

        threadDetailContainer.appendChild(commentContainer);

        renderCommentList(threadId);

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

function renderCommentList(threadId) {
    requestFunc.getComments(threadId)
        .then((comments) => {
            if (comments.length > 0) {
                const creatorIds = comments.map((comment) => comment.creatorId);
                // console.log('creatorIds:', creatorIds);
                const userDetailPromises = creatorIds.map((creatorId) => requestFunc.getUserDetails(creatorId));

                let commentListContainer = document.querySelector('.commentContainer');
                if (!commentListContainer) {
                    commentListContainer = document.createElement('div');
                    commentListContainer.classList.add('commentContainer');
                } else {
                    clearNode(commentListContainer);
                    const commentListTitle = document.createElement('div');
                    commentListTitle.classList.add('commentListTitle');
                    commentListTitle.textContent = 'Comments';
                    commentListContainer.appendChild(commentListTitle);

                    Promise.all(userDetailPromises)
                        .then((userDetails) => {
                            comments.forEach((comment) => {
                                const userInfoString = localStorage.getItem('userInfo');
                                const userInfo = JSON.parse(userInfoString);
                                // console.log('current comment:', comment);
                                const commentCreator = userDetails.find((user) => user.id === comment.creatorId);
                                // console.log('commentCreator:', commentCreator);
                                const commentElement = document.createElement('div');
                                commentElement.classList.add('commentElement');
                                commentListContainer.appendChild(commentElement);

                                const commentElementLeft = document.createElement('div');
                                commentElementLeft.classList.add('commentElementLeft');
                                commentElement.appendChild(commentElementLeft);

                                const avatar = document.createElement('img');
                                avatar.classList.add('avatar');
                                //todo:加上如果img为空的话显示默认头像 done
                                if (!commentCreator.image || commentCreator.image === 'null') {
                                    avatar.src = './styles/asset/avatar.svg';
                                    avatar.alt = 'avatar';
                                } else {
                                    avatar.src = commentCreator.image;
                                    avatar.alt = 'avatar';
                                }

                                commentElementLeft.appendChild(avatar);

                                const commentElementDetail = document.createElement('div');
                                commentElementDetail.classList.add('commentElementDetail');
                                commentElementLeft.appendChild(commentElementDetail);

                                const commentAuthor = document.createElement('div');
                                commentAuthor.classList.add('commentAuthor');
                                commentAuthor.textContent = commentCreator.name;
                                commentElementDetail.appendChild(commentAuthor);

                                const commentContent = document.createElement('div');
                                commentContent.classList.add('commentContent');
                                commentContent.textContent = comment.content;
                                commentElementDetail.appendChild(commentContent);

                                const commentDetailUpperRow = document.createElement('div');
                                commentDetailUpperRow.classList.add('commentDetailUpperRow');
                                commentElementDetail.appendChild(commentDetailUpperRow);

                                const commentTime = document.createElement('div');
                                commentTime.classList.add('commentTime');
                                commentTime.textContent = new Date(comment.createdAt).toLocaleString();
                                commentDetailUpperRow.appendChild(commentTime);

                                const commentOperator = document.createElement('div');
                                commentOperator.classList.add('commentOperator');
                                commentDetailUpperRow.appendChild(commentOperator);

                                const commentReply = document.createElement('div');
                                commentReply.classList.add('commentReply');
                                commentReply.textContent = 'Reply';
                                commentOperator.appendChild(commentReply);

                                if (userInfo.id === comment.creatorId || userInfo.admin === true) {
                                    const commentEdit = document.createElement('div');
                                    commentEdit.classList.add('commentEdit');
                                    commentEdit.textContent = 'Edit';
                                    commentOperator.appendChild(commentEdit);

                                    const commentEditInputRow = document.createElement('div');
                                    commentEditInputRow.classList.add('commentReplyInputRow');
                                    commentEditInputRow.classList.add('hidden');
                                    commentElementDetail.appendChild(commentEditInputRow);

                                    const commentEditInput = document.createElement('textarea');
                                    commentEditInput.classList.add('commentReplyInput');
                                    commentEditInput.value = comment.content;
                                    commentEditInput.id = 'commentEditInput';

                                    const commentEditSubmit = document.createElement('img');
                                    commentEditSubmit.classList.add('commentReplySubmit');
                                    commentEditSubmit.src = './styles/asset/submit.svg';
                                    commentEditSubmit.alt = 'edit submit';

                                    commentEditInputRow.appendChild(commentEditSubmit);
                                    commentEditInputRow.appendChild(commentEditInput);
                                    var showInput = false;

                                    commentEdit.addEventListener('click', () => {
                                        if (showInput === false) {
                                            commentEditInputRow.classList.remove('hidden');
                                            commentEditInput.focus();
                                            showInput = true;
                                        } else {
                                            commentEditInputRow.classList.add('hidden');
                                            showInput = false;
                                        }
                                    })

                                    commentEditSubmit.addEventListener('click', () => {
                                        const commentContent = commentEditInput.value;
                                        if (commentContent.length === 0) {
                                            toast('Comment can not be empty', 'error');
                                            return;
                                        }
                                        const data = {
                                            id: comment.id,
                                            content: commentContent,
                                        }
                                        requestFunc.editComment(data)
                                            .then(() => {
                                                toast('Edit success', 'success');
                                                renderCommentList(threadId);
                                            })
                                    })
                                }

                                const commentReplyInputRow = document.createElement('div');
                                commentReplyInputRow.classList.add('commentReplyInputRow');
                                commentReplyInputRow.classList.add('hidden');
                                commentElementDetail.appendChild(commentReplyInputRow);

                                const commentReplyInput = document.createElement('textarea');
                                commentReplyInput.classList.add('commentReplyInput');
                                commentReplyInput.placeholder = `Reply @${commentCreator.name}:`;
                                commentReplyInput.id = 'commentReplyInput';

                                const commentReplySubmit = document.createElement('img');
                                commentReplySubmit.classList.add('commentReplySubmit');
                                commentReplySubmit.src = './styles/asset/submit.svg';
                                commentReplySubmit.alt = 'reply submit';

                                commentReplyInputRow.appendChild(commentReplySubmit);
                                commentReplyInputRow.appendChild(commentReplyInput);



                                var showInput = false;

                                commentReply.addEventListener('click', () => {
                                    console.log('commentReply clicked');
                                    if (showInput === false) {
                                        commentReplyInputRow.classList.remove('hidden');
                                        commentReplyInput.focus();
                                        showInput = true;
                                    } else {
                                        commentReplyInputRow.classList.add('hidden');
                                        showInput = false;
                                    }
                                })


                                const commentElementRight = document.createElement('div');
                                commentElementRight.classList.add('commentElementRight');
                                commentElement.appendChild(commentElementRight);

                                const commentLikeContainer = document.createElement('div');
                                commentLikeContainer.classList.add('commentLikeContainer');
                                const commentLikeIcon = document.createElement('img');
                                commentLikeIcon.classList.add('commentLikeIcon');
                                commentLikeIcon.src = comment.likes.includes(Number(userInfo.id))
                                    ? './styles/asset/like_fill.svg'
                                    : './styles/asset/like_empty.svg';
                                commentLikeIcon.alt = comment.likes.includes(Number(userInfo.id))
                                    ? 'unlike'
                                    : 'like';
                                //todo:加上点赞功能，和点赞数，还有点赞的图标的切换 done
                                commentLikeIcon.addEventListener('click', () => {
                                    const turnon = comment.likes.includes(Number(userInfo.id)) ? false : true;
                                    const data = {
                                        id: comment.id,
                                        turnon,
                                    }
                                    requestFunc.likeComment(data)
                                        .then(() => {
                                            const userId = userInfo.id;
                                            if (turnon) {
                                                comment.likes.push(userId);
                                            } else {
                                                comment.likes = comment.likes.filter(id => id !== userId);
                                            }
                                            renderCommentList(threadId);
                                        })
                                });

                                const commentLikeNber = document.createElement('div');
                                commentLikeNber.classList.add('commentLikeNber');
                                commentLikeNber.textContent = comment.likes?.length || 0;

                                commentLikeContainer.appendChild(commentLikeIcon);
                                commentLikeContainer.appendChild(commentLikeNber);
                                commentElementRight.appendChild(commentLikeContainer);

                                //todo:如果是自己的评论，可以删除 done
                                if (userInfo.id === comment.creatorId || userInfo.admin === true) {
                                    const commentDelete = document.createElement('img');
                                    commentDelete.classList.add('commentDelete');
                                    commentDelete.src = './styles/asset/delete.svg';
                                    commentDelete.alt = 'delete';
                                    commentElementRight.appendChild(commentDelete);
                                    commentDelete.addEventListener('click', () => {
                                        const data = {
                                            id: comment.id,
                                        }
                                        requestFunc.deleteComment(data)
                                            .then(() => {
                                                toast('Delete success', 'success');
                                                renderCommentList(threadId);
                                            })
                                    });
                                }


                            });
                        });
                }
            } else {
                let commentListContainer = document.querySelector('.commentContainer');
                if (!commentListContainer) {
                    commentListContainer = document.createElement('div');
                    commentListContainer.classList.add('commentContainer');
                    commentListContainer.classList.add('emptyCommentContainer');
                    threadDetailContainer.appendChild(commentListContainer);
                } else {
                    clearNode(commentListContainer);
                    commentListContainer.classList.add('emptyCommentContainer');
                    const commentListTitle = document.createElement('div');
                    commentListTitle.classList.add('commentListTitle');
                    commentListTitle.textContent = 'Comments';
                    commentListContainer.appendChild(commentListTitle);

                    const emptyCommentContainer = document.createElement('div');
                    emptyCommentContainer.classList.add('emptyCommentContainerRow');
                    commentListContainer.appendChild(emptyCommentContainer);

                    const emptyComment = document.createElement('img');
                    emptyComment.classList.add('emptyComment');
                    emptyComment.src = './styles/asset/nocomment.svg';
                    emptyCommentContainer.appendChild(emptyComment);
                    const emptyCommentText = document.createElement('div');
                    emptyCommentText.classList.add('emptyCommentText');
                    emptyCommentText.textContent = 'No comments yet';
                    emptyCommentContainer.appendChild(emptyCommentText);
                }
            }
        })
}