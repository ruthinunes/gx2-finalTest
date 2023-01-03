const InputUploadBtn = document.getElementById('input_upload');
const inputFile = document.getElementById('input_file');
const selectGenreBtn = document.querySelector('.form_select-input');
const genreOptions = document.querySelectorAll('.option');
const genreSelectedText = document.querySelector('.select_btn-text');
const saveBtn = document.querySelector('#save');
const cancelBtn = document.querySelector('#cancel');
const form = document.querySelector('#form');

let title = document.querySelector('#input_title');
let description = document.querySelector('#input_text');
let author = document.querySelector('#txt_author');
let entryDate = document.querySelector('#txt_date');
let imgURL = '';
let genre = '';

function uploadFile() {
    inputFile.click();
};

function convertURLImg(e) {
    const file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener('load', () => {
        imgURL = reader.result;
        const uploadedImg = document.querySelector('.uploadedImg');
        // hidden icon, paragraph, and border from input.
        document.querySelector('.input_icon').setAttribute('hidden', true);
        document.querySelector('#inputUploadText').setAttribute('hidden', true);
        InputUploadBtn.style.border = 'none';
        // Uploading image into the container
        uploadedImg.removeAttribute('hidden');
        uploadedImg.setAttribute('src', imgURL);
    });
};

function createNewBook() {
    const bookTitle = title.value;
    const bookDescription = description.value;
    const bookAuthor = author.value;
    const bookEntryDate = entryDate.value;
    // formating date
    const formatedDate = bookEntryDate.split('-').reverse().join('/');

    if (bookTitle !== '' && bookDescription !== '' && bookAuthor !== '' && bookEntryDate !== '') {
        const newBook = {
            "tittle": bookTitle,
            "author": bookAuthor,
            "genre": genre,
            "status": {
                "isActive": true,
                "description": ""
            },
            'image': imgURL,
            'systemEntryDate': formatedDate,
            "synopsis": bookDescription,
            "rentHistory": []
        };
        window.alert('Livro salvo com suscesso!!');
        updateLocalStorage(newBook);
        clearFields();
    } else {
        window.alert('Por favor, preencha os campos nescessários!')
    }
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

function clearFields() {
    form.reset();
    genreSelectedText.textContent = 'Gênero';
    clearFileInput()
};

function clearFileInput() {
    const uploadedImg = document.querySelector('.uploadedImg');
    document.querySelector('.input_icon').removeAttribute('hidden', true);
    document.querySelector('#inputUploadText').removeAttribute('hidden', true);
    InputUploadBtn.style.border = '3px dashed #ffc501';
    uploadedImg.setAttribute('hidden', true);
    uploadedImg.removeAttribute('src', imgURL);
};

function setLocalStorage(newBook) {
    return localStorage.setItem('dbBooks', JSON.stringify(newBook));
};

function getLocalStorage() {
    return JSON.parse(localStorage.getItem('dbBooks')) ?? [];
};

function updateLocalStorage(newBook) {
    const books = getLocalStorage();
    books.push(newBook);
    setLocalStorage(books);
};

InputUploadBtn.addEventListener('click', uploadFile);
inputFile.addEventListener('change', convertURLImg);
saveBtn.addEventListener('click', createNewBook);
selectGenreBtn.addEventListener('click', selectGenre);
cancelBtn.addEventListener('click', clearFields);