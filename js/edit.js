const editBook = getLocalStorage('editBook');
const InputUploadBtn = document.getElementById('input_upload');
const inputFile = document.getElementById('input_file');
const selectGenreBtn = document.querySelector('.form_select-input');
const genreOptions = document.querySelectorAll('.option');
const genreSelectedText = document.querySelector('.select_btn-text');
const saveBtn = document.querySelector('#save');
const cancelBtn = document.querySelector('#cancel');

let imgURL = '';
let genre = '';

window.addEventListener("DOMContentLoaded", function () {
    defaultBookValues(editBook);
});

function defaultBookValues(editBook) {
    // input file:
    document.querySelector('.input_icon').setAttribute('hidden', true);
    document.querySelector('#inputUploadText').setAttribute('hidden', true);
    document.querySelector('.uploadedImg').removeAttribute('hidden');
    document.querySelector('.uploadedImg').src = editBook.image
    InputUploadBtn.style.border = 'none';

    document.querySelector('#input_title').value = editBook.tittle
    document.querySelector('#input_text').value = editBook.synopsis;
    document.querySelector('#txt_author').value = editBook.author;

    // formating and set entry date:
    const formatedDate = editBook.systemEntryDate.split('/').reverse().join('-');
    document.querySelector('#txt_date').value = formatedDate;

    // genre input:
    genreSelectedText.innerHTML = editBook.genre;
};
// ***** new book values *****
function uploadFile() {
    inputFile.click();
};

function convertURLImg(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
        imgURL = reader.result;
        document.querySelector('.uploadedImg').src = imgURL;
    });
};

function selectGenre() {
    document.querySelector('.select_btn_icon').classList.toggle('active');
    document.querySelector('.select_options_ctn').classList.toggle('active');
    genreOptions.forEach(function (option) {
        option.addEventListener('click', function (e) {
            genre = e.target.outerText;
            genreSelectedText.textContent = genre;
            return genre;
        });
    });
};

function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) ?? [];
};

function setLocalStorage(key, object) {
    return localStorage.setItem(key, JSON.stringify(object));
};

function saveEditBook() {
    let image = imgURL
    let tittle = document.querySelector('#input_title').value;
    let synopsis = document.querySelector('#input_text').value;
    let author = document.querySelector('#txt_author').value;
    let entryDate = document.querySelector('#txt_date').value.split('-').reverse().join('/');

    if (genre == "" || image == "") {
        genre = editBook.genre;
        image = editBook.image;
    };
    editBook.image = image;
    editBook.tittle = tittle;
    editBook.synopsis = synopsis;
    editBook.author = author;
    editBook.genre = genre;
    editBook.systemEntryDate = entryDate;
    updateLocalStorage(editBook.editIndex, editBook);
    alert('Livro editado com sucesso!');
    window.open('../html/library.html', '_self');
};

function updateLocalStorage(index, book) {
    const dbBooks = getLocalStorage('dbBooks');
    dbBooks[index] = book;
    setLocalStorage('dbBooks', dbBooks);
};

InputUploadBtn.addEventListener('click', uploadFile);
inputFile.addEventListener('change', convertURLImg);
selectGenreBtn.addEventListener('click', selectGenre);
saveBtn.addEventListener('click', saveEditBook);
cancelBtn.addEventListener('click', function () {
    window.open('../html/library.html', '_self');
});