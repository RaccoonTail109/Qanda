import { clearNode } from './utilities.js';
import { fileToDataUrl } from './helpers.js';
import { toast } from './utilities.js';
import { requestFunc } from './request.js';

export function renderProfilePage(userDetails) {
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = JSON.parse(userInfoString);

    const userContainer = document.getElementById('userContainer');
    clearNode(userContainer);

    const userInfoContainer = document.createElement('div');
    userInfoContainer.classList.add('userInfoContainer');
    userContainer.appendChild(userInfoContainer);

    const userImgContaier = document.createElement('div');
    userImgContaier.classList.add('userImg');
    userInfoContainer.appendChild(userImgContaier);

    const userImg = document.createElement('img');
    if (userDetails.image && userDetails.image !== 'null') {
        userImg.src = userDetails.image;
    } else {
        userImg.src = './styles/asset/profileImageSample.jpg';
    }
    userImg.alt = 'user image';
    userImg.classList.add('userAvatarImg');
    userImgContaier.appendChild(userImg);

    const userTextInfo = document.createElement('div');
    userTextInfo.classList.add('userTextInfo');
    userInfoContainer.appendChild(userTextInfo);

    const userNameRow = document.createElement('div');
    userNameRow.classList.add('userNameRow');
    userTextInfo.appendChild(userNameRow);

    const userName = document.createElement('div');
    userName.classList.add('userName');
    userName.textContent = userDetails.name;
    userNameRow.appendChild(userName);


    if (userInfo.admin === true) {
        const userRoleContainer = document.createElement('div');
        userRoleContainer.classList.add('userRoleContainer');
        userNameRow.appendChild(userRoleContainer);

        const userRoleDropdown = document.createElement('div');
        userRoleDropdown.classList.add('btn-group');
        userRoleContainer.appendChild(userRoleDropdown);

        const userRoleButton = document.createElement('button');
        userRoleButton.type = 'button';
        userRoleButton.classList.add('btn', 'btn-warning');
        userRoleButton.textContent = userDetails.admin ? 'Admin' : 'User';
        userRoleDropdown.appendChild(userRoleButton);

        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.classList.add('btn', 'btn-warning', 'dropdown-toggle', 'dropdown-toggle-split');
        toggleButton.dataset.bsToggle = 'dropdown';
        toggleButton.ariaExpanded = 'false';
        userRoleDropdown.appendChild(toggleButton);

        const toggleButtonSpan = document.createElement('span');
        toggleButtonSpan.classList.add('visually-hidden');
        toggleButtonSpan.textContent = 'Toggle Dropdown';
        toggleButton.appendChild(toggleButtonSpan);

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList.add('dropdown-menu');

        const adminOption = document.createElement('li');
        const adminButton = document.createElement('button');
        adminButton.classList.add('dropdown-item');
        adminButton.textContent = 'Admin';
        adminOption.appendChild(adminButton);

        const userOption = document.createElement('li');
        const userButton = document.createElement('button');
        userButton.classList.add('dropdown-item');
        userButton.textContent = 'User';
        userOption.appendChild(userButton);

        if (userDetails.admin) {
            dropdownMenu.appendChild(userOption);
        } else {
            dropdownMenu.appendChild(adminOption);
        }

        userRoleDropdown.appendChild(dropdownMenu);


        userNameRow.appendChild(userRoleDropdown);
        userRoleDropdown.addEventListener('click', (event) => {
            if (event.target.classList.contains('dropdown-item')) {
                const selectedRole = event.target.textContent;
                // console.log('Selected Role:', selectedRole);
                const turnon = selectedRole === 'Admin' ? true : false;
                const data = {
                    userId: userDetails.id,
                    turnon: turnon,
                };
                console.log('Data:', data);
                if (userDetails.id === userInfo.id) {
                    //todo: change own role
                    const modal = new bootstrap.Modal(confirmModal);
                    modal.show();
                    confirmButton.onclick = function () {
                        requestFunc.updateUserAdmin(data)
                            .then((response) => {
                                requestFunc.getUserDetails(userDetails.id)
                                    .then((newUserDetails) => {
                                        localStorage.setItem('userInfo', JSON.stringify(newUserDetails));
                                        renderProfilePage(newUserDetails);
                                        console.log('Updated User1:', newUserDetails);
                                        modal.hide();
                                    });
                            });
                    };
                } else if (userDetails.admin === true) {
                    //todo: can't change another admin role
                    const toast = new bootstrap.Toast(cantChangeOtherAdmin);
                    toast.show();
                    return;
                } else {
                    requestFunc.updateUserAdmin(data)
                        .then((response) => {
                            requestFunc.getUserDetails(userDetails.id)
                                .then((newUserDetails) => {
                                    renderProfilePage(newUserDetails);
                                    console.log('Updated User2:', newUserDetails);
                                })
                        })
                }
            }
        });

    } else {
        const userRole = document.createElement('button');
        userRole.classList.add('userRole');
        userRole.textContent = userDetails.admin ? 'Admin' : 'User';
        userNameRow.appendChild(userRole);
    }





    const email = document.createElement('div');
    email.classList.add('userEmail');
    email.textContent = userDetails.email;
    userTextInfo.appendChild(email);



    if (userDetails.id === userInfo.id) {
        const editProfileContainer = document.createElement('div');
        editProfileContainer.classList.add('editProfileContainer');
        userTextInfo.appendChild(editProfileContainer);

        const editProfileIcon = document.createElement('img');
        editProfileIcon.src = './styles/asset/EDIT_2.svg';
        editProfileIcon.alt = 'edit profile';

        const editProfileText = document.createElement('div');
        editProfileText.classList.add('editProfileText');
        editProfileText.textContent = 'Edit Profile';

        editProfileContainer.appendChild(editProfileIcon);
        editProfileContainer.appendChild(editProfileText);

        editProfileContainer.addEventListener('click', () => {
            userInfoContainer.classList.add('hidden');
            const editProfileContainer = document.createElement('div');
            editProfileContainer.classList.add('userInfoContainer');
            userContainer.appendChild(editProfileContainer);

            const uploadContainer = document.createElement('div');
            uploadContainer.classList.add('uploadContainer');
            editProfileContainer.appendChild(uploadContainer);

            const uploadInput = document.createElement('input');
            uploadInput.type = 'file';
            uploadInput.classList.add('userImgInput');
            uploadContainer.appendChild(uploadInput);

            const uploadImg = document.createElement('img');
            uploadImg.src = './styles/asset/upload_img.svg';
            uploadImg.alt = 'upload image';
            uploadImg.classList.add('userAvatarUploadImg');
            uploadContainer.appendChild(uploadImg);

            let userImgUrl = "null";

            uploadInput.addEventListener('change', function () {
                const file = uploadInput.files[0];
                fileToDataUrl(file)
                    .then(dataUrl => {
                        const userImgContaier = document.createElement('div');
                        clearNode(uploadContainer);
                        console.log(dataUrl);
                        userImgUrl = dataUrl;

                        userImgContaier.classList.add('userImg');
                        uploadContainer.appendChild(userImgContaier);
                        const userImg = document.createElement('img');
                        userImg.src = dataUrl;
                        userImg.alt = 'user image';
                        userImg.classList.add('userAvatarImg');

                        userImgContaier.appendChild(userImg);
                        uploadImg.classList.add('hidden');

                        userImg.addEventListener('click', () => {
                            uploadInput.click();
                        })
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
            const uploadText = document.createElement('div');
            uploadText.classList.add('userUpdatedInfo');
            editProfileContainer.appendChild(uploadText);

            const userForm = document.createElement('form');
            userForm.id = 'userForm';
            userForm.classList.add('userForm');

            const userName = document.createElement('input');
            userName.type = 'text';
            userName.classList.add('userUpdatedInput');
            userName.id = 'updatedUserName';
            userName.name = 'userName';
            userName.placeholder = 'Update Name Here';
            userForm.appendChild(userName);

            const email = document.createElement('input');
            email.type = 'email';
            email.classList.add('userUpdatedInput');
            email.id = 'updatedEmail';
            email.name = 'email';
            email.placeholder = 'Update Email Here';
            userForm.appendChild(email);

            const userPassword = document.createElement('input');
            userPassword.type = 'password';
            userPassword.classList.add('userUpdatedInput');
            userPassword.id = 'updatedPassword';
            userPassword.name = 'password';
            userPassword.placeholder = 'Update Password Here';
            userForm.appendChild(userPassword);

            const upperInputRow = document.createElement('div');
            upperInputRow.classList.add('upperInputRow');
            userForm.appendChild(upperInputRow);

            const submitButton = document.createElement('button');
            submitButton.classList.add('submitUpdatedButton');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            upperInputRow.appendChild(submitButton);

            uploadText.appendChild(userForm);

            const closeEditProfile = document.createElement('div');
            closeEditProfile.classList.add('closeEditProfile');
            const closeButton = document.createElement('img');
            closeButton.src = './styles/asset/close.svg';
            closeButton.alt = 'close';
            closeEditProfile.appendChild(closeButton);
            uploadText.appendChild(closeEditProfile);

            closeEditProfile.addEventListener('click', () => {
                userInfoContainer.classList.remove('hidden');
                editProfileContainer.classList.add('hidden');
            });

            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                const updatedUserName = document.getElementById('updatedUserName').value;
                const updatedEmail = document.getElementById('updatedEmail').value;
                const updatedPassword = document.getElementById('updatedPassword').value;

                console.log('Updated User Name:', updatedUserName);
                console.log('Updated Email:', updatedEmail);
                console.log('Updated Password:', updatedPassword);
                if (updatedEmail === '' || updatedPassword === '' || updatedUserName === '') {
                    toast('Please fill out all fields', 'error');
                    alert('Please fill out all fields');
                    return;
                } else if (updatedEmail === userDetails.email || updatedUserName === userDetails.name || userImgUrl === userDetails.image) {
                    toast('Please update all information', 'error');
                    alert('Please update all information');
                    return;
                }

                const updatedUser = {
                    email: updatedEmail,
                    password: updatedPassword,
                    name: updatedUserName,
                    image: userImgUrl,
                };

                requestFunc.updateUserInfo(updatedUser)
                    .then((response) => {
                        const userInfoString = localStorage.getItem('userInfo');
                        const userInfo = JSON.parse(userInfoString);
                        const userId = userInfo.id;

                        requestFunc.getUserDetails(userId)
                            .then((newUserDetails) => {
                                renderProfilePage(newUserDetails);
                                console.log('Updated User:', newUserDetails);
                                renderProfilePage(newUserDetails);
                                userInfoContainer.classList.remove('hidden');
                                editProfileContainer.classList.add('hidden');
                            })
                    })

            });

        });
    }
}