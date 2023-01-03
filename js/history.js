const tableContainer = document.querySelector('.table_section');
const dbBooks = getLocalStorage('dbBooks');
let allHistorys = [];

function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) ?? [];
};

function setLocalStorage(key, object) {
    return localStorage.setItem(key, JSON.stringify(object));
};

// ***** table section *****
function createTable() {
    const content = `<table class="table">
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
            <th class="table_head" id="row_book">
                <p>Livro</p>
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
</table>`

    tableContainer.innerHTML = content;
    createData();
};

function createData() {
    dbBooks.forEach(function (book) {
        if (book.rentHistory.length > 0) {
            book.rentHistory.forEach(function (historys) {
                allHistorys.push({
                    tittle: book.tittle,
                    studentName: historys.studentName,
                    schoolClass: historys.schoolClass,
                    withdrawalDate: historys.withdrawalDate,
                    deliveryDate: historys.deliveryDate
                });
            });
        };
    });
    createCells(allHistorys);
};

function createCells(allHistorys) {
    const table = document.querySelector('.table');
    const studentRow = table.querySelector('#row_student');
    const classRow = table.querySelector('#row_class');
    const bookRow = table.querySelector('#row_book');
    const withdrawalDateRow = table.querySelector('#row_withdrawalDate');
    const deliveryDateRow = table.querySelector('#row_deliveryDate');

    allHistorys.forEach(function (history) {
        let rowStudentName = `   <td class="table_data">
     <p>${history.studentName}</p>
         </td>`;
        let rowClass = `   <td class="table_data">
     <p>${history.schoolClass}</p>
         </td>`;
        let rowBook = `   <td class="table_data">
     <p>${history.tittle}</p>
         </td>`;
        let rowWithdrawalDate = `   <td class="table_data">
         <p>${history.withdrawalDate}</p>
             </td>`;
        let rowDeliveryDate = `   <td class="table_data">
             <p>${history.deliveryDate}</p>
                 </td>`;

        studentRow.insertAdjacentHTML('afterend', rowStudentName);
        classRow.insertAdjacentHTML('afterend', rowClass);
        bookRow.insertAdjacentHTML('afterend', rowBook);
        withdrawalDateRow.insertAdjacentHTML('afterend', rowWithdrawalDate);
        deliveryDateRow.insertAdjacentHTML('afterend', rowDeliveryDate);
    });
    setLocalStorage('filteredHistory', allHistorys);
    filterFunctions();
};

// ***** filter section *****
function filterFunctions() {
    const icons = document.querySelectorAll('.table_icon');
    icons.forEach(function (icon, index) {
        icon.addEventListener('click', function () {
            icon.classList.add('rotate_icon');
            selectFilterOption(index);
        });
    });
};

function selectFilterOption(index) {
    switch (index) {
        case 0:
            filterByText(allHistorys, 'studentName');
            clearTable();
            createCells(allHistorys.reverse());
            break;
        case 1:
            filterByText(allHistorys, 'schoolClass');
            clearTable();
            createCells(allHistorys.reverse());
            break;
        case 2:
            filterByText(allHistorys, 'tittle');
            clearTable();
            createCells(allHistorys.reverse());
            break;
        case 3:
            byDate = filterByDate(allHistorys, 'withdrawalDate');
            clearTable();
            createCells(byDate);
            break;
        case 4:
            byDate = filterByDate(allHistorys, 'deliveryDate');
            clearTable();
            createCells(byDate);
            break;
    };
};

function filterByText(allHistorys, value) {
    allHistorys.sort(function (a, b) {
        if (a[value].toLowerCase() < b[value].toLowerCase()) return -1;
        if (a[value].toLowerCase() > b[value].toLowerCase()) return 1;
        return 0;
    });
};

function filterByDate(allHistorys, value) {
    let dates = [];

    // manipulating date
    allHistorys.forEach(function (history) {
        let date = history[value];
        var newDate = date.split("/").reverse().join("-");
        var timestamp = new Date(newDate).getTime();
        history.dateTime = timestamp;
        dates.push(history);
    });
    // filtering
    dates.sort(function (a, b) {
        if (a.dateTime < b.dateTime) return -1;
        if (a.dateTime > b.dateTime) return 1;
        return 0;
    });
    return dates;
};

function clearTable() {
    const tableData = document.querySelectorAll('.table_data');
    tableData.forEach(function (data) {
        data.remove();
    });
};

createTable();