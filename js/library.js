const cards_ctn = document.querySelector('#cards_ctn');
const mainModal = document.querySelector('#modal_main');
const rentModal = document.querySelector('#modal_rent');
const inactivateModal = document.querySelector('#modal_inactivate');
const historyModal = document.querySelector('.modal_history');
const filterBoxBtn = document.querySelector('.input_filter-ctn');
const searchBtn = document.querySelector('#search_btn');

window.addEventListener("DOMContentLoaded", function () {
    updateBooksCard('dbBooks');
});

// ***** LocalStorage *****
function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) ?? [];
};

function setLocalStorage(key, object) {
    return localStorage.setItem(key, JSON.stringify(object));
};

const updateLocalStorage = (index, book) => {
    const dbBooks = getLocalStorage('dbBooks');
    dbBooks[index] = book;
    setLocalStorage('dbBooks', dbBooks);
};

// ***** filters ***** 
function openSelectFilter() {
    const filterIcon = document.querySelector('.select_btn_icon');
    filterIcon.classList.toggle('active');
    const optionsContainer = document.querySelector('.select_options_ctn');
    optionsContainer.classList.toggle('active');
    if (optionsContainer.classList.contains('active')) {
        SelectOption();
    };
};

function filterByText(books, objectValue) {

    books.sort(function (a, b) {
        if (a[objectValue].toLowerCase() < b[objectValue].toLowerCase()) return -1;
        if (a[objectValue].toLowerCase() > b[objectValue].toLowerCase()) return 1;
        // return 0;
    });
    // console.log(books)
    return books;
};

function filterByDate(books, value) {
    let dates = [];

    books.forEach(function (book) {
        let date = book[value];
        // let date = book.systemEntryDate;
        var newDate = date.split("/").reverse().join("-");
        var timestamp = new Date(newDate).getTime();
        book.dateTime = timestamp;
        dates.push(book);
    });

    dates.sort(function (a, b) {
        if (a.dateTime < b.dateTime) return -1;
        if (a.dateTime > b.dateTime) return 1;
        return 0;
    });
    return dates;
};

function searchFilter() {
    const dbBooks = getLocalStorage('dbBooks');
    const form = document.querySelector('#input_search');
    const searchText = form.value.toLowerCase();
    let filteredlist = [];

    dbBooks.filter(function (book, index) {

        let choosedByTittle = book.tittle.toLowerCase();
        let choosedByAuthor = book.author.toLowerCase();
        let choosedByGenre = book.genre.toLowerCase();
        if (choosedByTittle.includes(searchText) || choosedByAuthor.includes(searchText) || choosedByGenre.includes(searchText)) {
            filteredlist.push(book);
            console.log(index);
            setLocalStorage('filterBooks', filteredlist);
        };
    });
    if (filteredlist.length > 0) {
        updateBooksCard('filterBooks');
        // const dataBook = getmainModalContent('dbBooks')[index];
        filteredlist.forEach(function (index) {
            // mainModalContent(index);
        });

    } else {
        cards_ctn.innerHTML = `<h6>Livro não identificado</h6>`;
        cards_ctn.style.fontSize = "x-large";
    };
};

function SelectOption() {
    const optionsList = document.querySelector('.select_options_ctn');
    let selectedText = document.querySelector('.select_filter_text');

    optionsList.addEventListener('click', function (e) {
        const dbBooks = getLocalStorage('dbBooks');
        let selectedOption = e.target.lastElementChild.textContent;
        let objectValue = "";

        if (selectedOption === 'Gênero') {

            objectValue = 'genre'
            selectedText.innerText = selectedOption;
            filterByText(dbBooks, objectValue);
            setLocalStorage('filterBooks', dbBooks);
            updateBooksCard('filterBooks');

        } else if (selectedOption === 'Autor') {

            objectValue = 'author';
            selectedText.innerText = selectedOption;
            filterByText(dbBooks, objectValue);
            setLocalStorage('filterBooks', dbBooks);
            updateBooksCard('filterBooks');
        } else {

            objectValue = 'systemEntryDate'
            selectedText.innerText = selectedOption;
            let byDate = filterByDate(dbBooks, objectValue);
            setLocalStorage('filterBooks', byDate.reverse());
            updateBooksCard('filterBooks');
        };
    });
};

// ***** books cards ***** 
function createBookCard(book, key) {
    cards_ctn.innerHTML += `<div class="card_ctn" data-is_active="">
    <div id="" class="card_content-ctn">
        <img id=""  class="card_img" src="${book.image}" alt="">
        <p id="" >${book.tittle}</p>
    </div>
</div>`

    openMainModal(key);
};

function updateBooksCard(key) {
    cards_ctn.innerHTML = "";
    const dbBooks = getLocalStorage(key);
    dbBooks.forEach(function (book) {
        createBookCard(book, key);
    });
};

// ***** main modal *****
function openMainModal(key) {
    const booksCard = document.querySelectorAll('.card_ctn');
    booksCard.forEach(function (bookCard, index) {
        bookCard.addEventListener('click', function () {
            openModal(mainModal);
            mainModalContent(key, index);
            closeModalBtn(mainModal);
        });
    });
};

function mainModalContent(key, index) {
    const dataBook = getLocalStorage(key)[index];

    const content = `<div class="modal_ctn">
    <header class="modal_header">
        <img id="close_modal" class="close_modal" src="../images/moda-icon.svg" alt="">
    </header>
    <div class="modal_content">
        <div class="modal_img">
            <img id="modal_img" src="${dataBook.image}" alt="">
        </div>
        <div class="modal_description">
            <h2 id="modal_title">${dataBook.tittle}
            </h2>
            <div class="modal_info">
                <h3>Sinopse</h3>
                <p id="modalSynopsis">${dataBook.synopsis}</p>
                <h3>Autor</h3>
                <p id="modalAuthor">${dataBook.author}</p>
                <h3>Gênero</h3>
                <p id="modalGenres">${dataBook.genre}</p>
                <h3>Data de entrada</h3>
                <p id="modalEntryDate">${dataBook.systemEntryDate}</p>
            </div>
        </div>
    </div>
    <footer class="modal_footer footer_main">
        <div class="footer_btn">
            <div id="main_btn" class="modal_btn">
                <img id="btn_icon" src="../images/modal_btn-icon.svg" alt="">
                <p id="btn_text">Emprestar</p>
            </div>
            <button id="edit_btn">Editar</button>
            <button id="inactivate_btn" class="inactivate_btn active">Inativar</button>
            <button id="history_btn">Histórico</button>
        </div>
        <div class="inactivate_infos-ctn">
            <h2>Informações da inativação</h2>
            <div class="inactivate_infos">
                <h3>Motivo</h3>
                <p>${dataBook.status.description}</p>
            </div>
        </div>
    </footer>
</div>`

    mainModal.innerHTML = content;
    getmainModalFunctions(dataBook, index);
};

function getmainModalFunctions(dataBook, index) {
    const rentBtn = mainModal.querySelector('.modal_btn');
    const inactivateBtn = mainModal.querySelector('.inactivate_btn');
    const editBtn = mainModal.querySelector('#edit_btn');
    const historyBtn = mainModal.querySelector('#history_btn');
    const inactivateContainer = mainModal.querySelector('.inactivate_infos-ctn');

    // buttons functions
    const rentBook = () => {
        openModal(rentModal);
        rentModalContent(index);
        closeModalBtn(rentModal);
    };
    const inactivateBook = () => {
        openModal(inactivateModal);
        inactivateModalContent(index);
        closeModalBtn(inactivateModal);

    };
    const editBook = () => {
        dataBook.editIndex = index;
        setLocalStorage('editBook', dataBook);
        window.open('../html/edit.html', '_self');
    };
    const historyBook = () => {
        openModal(historyModal);
        historyModalContent(dataBook, index);
        closeModalBtn(historyModal);
    };

    if (dataBook.status.isActive === false) {
        inactiveBookStyle(dataBook, index);
        historyBtn.addEventListener('click', historyBook);

    } else {
        activeBookStyle(inactivateContainer, inactivateBtn, rentBtn);
        rentBtn.addEventListener('click', rentBook);
        editBtn.addEventListener('click', editBook);
        inactivateBtn.addEventListener('click', inactivateBook);
        historyBtn.addEventListener('click', historyBook);
    };
};

// ***** rent section *****
function rentModalContent(index) {
    const content = `<div class="modal_ctn">
    <header class="modal_header">
        <h2>Informe os dados do aluno antes de continuar</h2>
        <img id="close_modal" src="../images/moda-icon.svg" alt="">
    </header>
    <form id="form" class="modal_form">
        <input type="text" name="" id="name" placeholder="Nome do aluno" required>
        <input type="text" name="" id="data-retirada" placeholder="Data da retirada"
            onfocus="(type='date')" onfocusout="(type='text')" required>
        <input type=" text" name="" id="turma" placeholder="Turma" required>
        <input type="text" name="" id="data-entrega" placeholder="Data de entrega"
            onfocus="(type='date')" onfocusout="(type='text')" required>
    </form>
    <footer class=" modal_footer">
        <div id="rent_btn" class="modal_btn secondary_btn">
            <img src="../images/modal_btn-icon.svg" alt="">Emprestar
        </div>
    </footer>
</div>`

    rentModal.innerHTML = content;
    rentBtnFunction(index);
};

function rentBtnFunction(index) {
    const secondaryRentBtn = rentModal.querySelector('.secondary_btn');

    secondaryRentBtn.addEventListener('click', function () {
        getRentData(index);
    });
};

function getRentData(index) {
    const dbBooks = getLocalStorage('dbBooks');
    const studentName = rentModal.querySelector('#name').value;
    const withdrawalDate = rentModal.querySelector('#data-retirada').value;
    const schoolClass = rentModal.querySelector('#turma').value;
    const deliveryDate = rentModal.querySelector('#data-entrega').value;

    if (studentName === "" || withdrawalDate === "" || schoolClass === "" || deliveryDate === "") {
        alert('Por favor, insira todos os dados');
    } else {
        dbBooks[index].rentHistory.push({
            "studentName": studentName,
            "withdrawalDate": withdrawalDate.split('-').reverse().join('/'),
            "schoolClass": schoolClass,
            'deliveryDate': deliveryDate.split('-').reverse().join('/'),
        });
        setLocalStorage('dbBooks', dbBooks);
        alert('Operação realizada com sucesso! Empréstimo registrado.');
        rentModal.classList.remove('active');
    };
};

// ***** inactivate section *****
function inactivateModalContent(index) {
    const content = `<div class="modal_ctn">
    <header class="modal_header">
        <h2>Inativar livro</h2>
        <img id="close_modal" src="../images/moda-icon.svg" alt="">
    </header>
    <textarea name="" id="inactive_text" cols="30" rows="10" placeholder="Descrição"></textarea>
    <footer class="modal_footer footer_third">
        <button id="inactivate_btn" class="inactivate_btn active">Inativar</button>
    </footer>
</div>`

    inactivateModal.innerHTML = content;
    getInactiveFunctions(index);
};

function getInactiveFunctions(index) {
    let inactiveDescription = inactivateModal.querySelector('#inactive_text');
    const dbBooks = getLocalStorage('dbBooks');

    inactivateModal.querySelector('#inactivate_btn').addEventListener('click', function () {
        if (inactiveDescription.value == "") {
            alert('Por favor, escreva uma descricao');
        } else {
            dbBooks[index].status.description = inactiveDescription.value;
            dbBooks[index].status.isActive = false;

            setLocalStorage('dbBooks', dbBooks);
            alert('Operação realizada com sucesso! Livro inativado');
            mainModal.classList.remove('active');
            inactivateModal.classList.remove('active');
            inactiveBookStyle(dbBooks[index]);
        };
    });
};

function inactiveBookStyle(dataBook, index) {
    const inactivateContainer = mainModal.querySelector('.inactivate_infos-ctn');
    const rentBtn = mainModal.querySelector('.modal_btn');
    const inactivateBtn = mainModal.querySelector('.inactivate_btn');
    const inactivateText = inactivateContainer.querySelector('p');
    const bookInactivateInfos = dataBook.status.description;

    inactivateContainer.classList.add('active');
    inactivateText.innerText = bookInactivateInfos;
    inactivateBtn.classList.remove('active');
    inactivateBtn.innerText = 'Ativar';
    rentBtn.style.opacity = "0.5";

    // **** reactivating book
    inactivateBtn.addEventListener('click', function () {
        dataBook.status.description = "";
        dataBook.status.isActive = true;
        updateLocalStorage(index, dataBook);
        alert('Livro ativado!');
        activeBookStyle(inactivateContainer, inactivateBtn, rentBtn);
        mainModal.classList.remove('active');
    });
};

function activeBookStyle(inactivateContainer, inactivateBtn, rentBtn) {

    inactivateContainer.classList.remove('active');
    inactivateBtn.innerText = 'Desativar';
    inactivateBtn.classList.add('active');
    rentBtn.style.opacity = "1";
};

// ***** history section *****
function historyModalContent(dataBook) {
    const content = `<div class="modal_ctn">
    <header class="modal_header">
        <img id="close_modal" class="close_modal" src="../images/moda-icon.svg" alt="">
    </header>
    <table class="table">
        <tbody class="table_body">
            <!-- start table row -->
            <tr class="table_row">
                <th class="table_head" id="row_student">
                    <p>Aluno</p>
                    <div class="table_filter">
                        <img class="table_icon" src="../images/historyIcon.svg" alt="">
                        <span class="table_icon_underline"></span>
                    </div>
                </th>
            </tr>
            <!-- end table row -->
            <!-- start table row -->
            <tr class="table_row">
                <th class="table_head" id="row_class">
                    <p>Turma</p>
                    <div class="table_filter">
                        <img class="table_icon" src="../images/historyIcon.svg" alt="">
                        <span class="table_icon_underline"></span>
                    </div>
                </th>
            </tr>
            <!-- end table row -->
            <!-- start table row -->
            <tr class="table_row">
                <th class="table_head" id="row_withdrawalDate">
                    <p>Data da Retirada</p>
                    <div class="table_filter">
                        <img class="table_icon" src="../images/historyIcon.svg" alt="">
                        <span class="table_icon_underline"></span>
                    </div>
                </th>
            </tr>
            <!-- end table row -->
            <!-- start table row -->
            <tr class="table_row">
                <th class="table_head" id="row_deliveryDate">
                    <p>Data da Entrega</p>
                    <div class="table_filter">
                        <img class="table_icon" src="../images/historyIcon.svg" alt="">
                        <span class="table_icon_underline"></span>
                    </div>
                </th>
            </tr>
            <!-- end table row -->
    
        </tbody>
    </table>
</div>`

    historyModal.innerHTML = content;
    fillTableHistory(dataBook);
};

function fillTableHistory(dataBook) {
    // console.log(dataBook.rentHistory);
    if (dataBook.rentHistory.length > 0) {
        const studentRow = historyModal.querySelector('#row_student');
        const classRow = historyModal.querySelector('#row_class');
        const withdrawalDateRow = historyModal.querySelector('#row_withdrawalDate');
        const deliveryDateRow = historyModal.querySelector('#row_deliveryDate');
        const rentHistory = dataBook.rentHistory;

        rentHistory.forEach(function (history) {
            // creating cells
            let rowStudentName = `   <td class="table_data">
                        <p>${history.studentName}</p>
                            </td>`;
            let rowClass = `   <td class="table_data">
                        <p>${history.schoolClass}</p>
                            </td>`;
            let rowWithdrawalDate = `   <td class="table_data">
                            <p>${history.withdrawalDate}</p>
                                </td>`;
            let rowDeliveryDate = `   <td class="table_data">
                                <p>${history.deliveryDate}</p>
                                    </td>`;

            // displaying in html
            studentRow.insertAdjacentHTML('afterend', rowStudentName);
            classRow.insertAdjacentHTML('afterend', rowClass);
            withdrawalDateRow.insertAdjacentHTML('afterend', rowWithdrawalDate);
            deliveryDateRow.insertAdjacentHTML('afterend', rowDeliveryDate);
        });

        filterFunctions(rentHistory, dataBook);
        return rentHistory;
    } else {
        console.log('Dont has data');
    }
};

function filterFunctions(rentHistory, dataBook) {
    const icons = document.querySelectorAll('.table_icon');
    icons.forEach(function (icon, index) {
        icon.addEventListener('click', function () {
            icon.classList.add('rotate_icon');
            selectFilterOption(index, rentHistory, dataBook);
        });
    });
};

function getFilteredHistory(dataBook, rentHistory) {
    let filteredHistory;

    filteredHistory = rentHistory;
    dataBook.rentHistory = filteredHistory;
    return dataBook;
};

function selectFilterOption(index, rentHistory, dataBook) {

    switch (index) {
        case 0:
            filterByText(rentHistory, 'studentName');
            getFilteredHistory(dataBook, rentHistory.reverse());
            clearTable();
            fillTableHistory(dataBook);
            break;
        case 1:
            filterByText(rentHistory, 'schoolClass');
            getFilteredHistory(dataBook, rentHistory.reverse());
            clearTable();
            fillTableHistory(dataBook);
            break;
        case 2:
            byDate = filterByDate(rentHistory, 'withdrawalDate');
            getFilteredHistory(dataBook, byDate);
            clearTable();
            fillTableHistory(dataBook, byDate);
            break;
        case 3:
            byDate = filterByDate(rentHistory, 'deliveryDate');
            getFilteredHistory(dataBook, byDate);
            clearTable();
            fillTableHistory(dataBook, byDate);
            break;
    };
};

function clearTable() {
    const tableData = document.querySelectorAll('.table_data');
    tableData.forEach(function (data) {
        data.remove();
    });
};

// ***** modals *****
function openModal(modal) {
    modal.classList.add('active');
};

function closeModalBtn(modal) {
    modal.querySelector('#close_modal').addEventListener('click', function () {
        modal.classList.remove('active');
    });
};

searchBtn.addEventListener('click', searchFilter);
filterBoxBtn.addEventListener('click', openSelectFilter);