const userLocalStorage = JSON.parse(localStorage.getItem('user_name'));
const userDisplay = document.querySelector('.nav_icon_container > p');
const userDisplayBtn = document.querySelector('.nav_icon_container');

userDisplay.textContent = userLocalStorage;

const dataBooks = async () => {
    const res = await fetch('../data.json');
    const data = await res.json();
    const dataBooks = data.data.books;

    if ('dbBooks' in localStorage == false) {
        localStorage.setItem('dbBooks', JSON.stringify(dataBooks));
    };
};

function openUserWindow() {
    const logOut = document.querySelector('.nav_list');
    logOut.classList.toggle('active');
    const icon = document.querySelector('.nav_icon');
    icon.classList.toggle('rotate_icon');

    logOut.addEventListener('click', logOut);
};

function logOut() {
    return localStorage.clear();
};

userDisplayBtn.addEventListener('click', openUserWindow);
dataBooks();