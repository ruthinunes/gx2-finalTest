const form = document.querySelector('#form');
const emailInput = document.querySelector('#email_input');
const passwordInput = document.querySelector('#password_input');
const loginBtn = document.querySelector('.login_btn');

const createLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('../data.json');
    const data = await res.json();
    const dataLogin = data.data.login;
    verifyLogin(dataLogin);
};

function verifyLogin(dataLogin) {
    for (i = 0; i < dataLogin.length; i++) {
        if (emailInput.value == dataLogin[i].email && passwordInput.value == dataLogin[i].password) {
            setLocalStorage(dataLogin[i].name);
            window.open("../html/home.html");
            return;
        }
    } window.alert('[ERRO] e-mail ou senha incorretos!');
};

function setLocalStorage(user) {
    localStorage.setItem('user_name', JSON.stringify(user));
};

loginBtn.addEventListener('click', createLogin);