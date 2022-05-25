const ROWS = 9;
const COLS = 9;
const SQUARES_IN_BOX = 3;
const EMPTY_CELL = 0;
const loader = document.querySelector(".loader");
const sudoku = document.getElementById("sudoku").firstChild.nextSibling;

function initialize_grid() {
    for (let i = 0; i < 9; i++) {
        const row = document.createElement("tr");
        row.classList.add(i + 1);

        if (i == 2 || i == 5) row.classList.add("thick_bottom")

        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("td");
            cell.innerHTML += `<input id="${i * 9 + j}" type="text" maxlength="2">`;
            if (j == 2 || j == 5) cell.classList.add("thick_right");
            cell.classList.add(j + 1);
            row.appendChild(cell);
        }
        sudoku.appendChild(row)
    }
}

function is_legit_move(i, j, num, board) {
    return (check_row(i, num, board) &&
        check_col(j, num, board) &&
        check_box(i - i % SQUARES_IN_BOX, j - j % SQUARES_IN_BOX, num, board));
}

//=============================================================================//
//                  standard sudoku check functions                           //

function check_box(rowStart, colStart, num, board) {
    for (let i = 0; i < SQUARES_IN_BOX; i++)
        for (let j = 0; j < SQUARES_IN_BOX; j++)
            if (board[(ROWS * (rowStart + i)) + colStart + j] == num)
                return false;

    return true;
}

function check_row(i, num, board) {
    for (let j = 0; j < ROWS; j++)
        if (board[ROWS * i + j] == num)
            return false;
    return true;
}

function check_col(j, num, board) {
    for (let i = 0; i < ROWS; i++)
        if (board[ROWS * i + j] == num)
            return false;
    return true;
}

//============================================================================//

function initialize_empty_board(board) {
    for (let i = 0; i < ROWS * COLS; i++) {
        board[i] = EMPTY_CELL;
    }
}

function initialize_html_board(board) {
    for (let i = 0; i < ROWS * COLS; i++) {
        let cell = document.getElementById(parseInt(i));

        if (board[i] != EMPTY_CELL) {
            cell.value = board[i];
            cell.readOnly = true;

            cell.style.backgroundColor = "white";
        }
    }
}

function reset_html_board() {
    for (let i = 0; i < ROWS * COLS; i++) {
        let cell = document.getElementById(parseInt(i));
        cell.readOnly = false;

    }

    for (let i = 0; i < ROWS * COLS; i++) {
        document.getElementById(parseInt(i)).value = "";
    }
}

function generate_board(board) {
    fill_diagonal(board);
    fill_remaining(0, 3, board);
    remove(board);
}


function fill_diagonal(board) {

    for (let i = 0; i < ROWS; i += SQUARES_IN_BOX)
        fill_box(i, i, board);
}

function fill_box(row, col, board) {
    let num;
    for (let i = 0; i < SQUARES_IN_BOX; i++) {
        for (let j = 0; j < SQUARES_IN_BOX; j++) {
            do {
                num = Math.floor(Math.random() * 9) + 1;
            }
            while (!check_box(row, col, num, board));

            board[ROWS * (row + i) + col + j] = num;
        }
    }
}


function fill_remaining(i, j, board) {
    if (j >= COLS && i < ROWS - 1) {
        i++;
        j = 0;
    }
    if (i >= ROWS && j >= COLS)
        return true;

    if (i < SQUARES_IN_BOX) {
        if (j < SQUARES_IN_BOX)
            j = SQUARES_IN_BOX;
    }
    else if (i < SQUARES_IN_BOX * 2) {
        if (j == Math.floor((i / SQUARES_IN_BOX)) * SQUARES_IN_BOX)
            j += SQUARES_IN_BOX;
    }
    else {
        if (j == SQUARES_IN_BOX * 2) {
            i++;
            j = 0;
            if (i >= ROWS)
                return true;
        }
    }

    for (let num = 1; num <= 9; num++) {
        if (is_legit_move(i, j, num, board)) {
            board[ROWS * i + j] = num;
            if (fill_remaining(i, j + 1, board))
                return true;

            board[ROWS * i + j] = EMPTY_CELL;
        }
    }
    return false;
}

function full_board(board) {
    let finished = true;
    for (let i = 0; i < ROWS * COLS; i++) {
        if (board[i] == EMPTY_CELL) finished = false;
    }
    return finished;
}

function solve(board, cell) {
    let col = cell % COLS;
    let row = cell / ROWS;
    row = Math.floor(row);

    board = [];

    if (full_board(board)) {
        return true;
    }

    for (let num = 1; num <= 9; num++) {

        if (is_legit_move(row, col, num, board)) {

            board[cell] = num;

            if (solve(board, cell)) {
                return true;
            }

            board[cell] = EMPTY_CELL;
        }
    }

    return false;
}

function remove(board) {
    const multiplier = 5;

    let to_remove = Math.floor(Math.random() * 10) + 10 * multiplier;


    let positions = [];
    for (let i = 0; i < ROWS * COLS; i++) {
        positions[i] = i;
    }

    //array shuffling
    shuffle(positions);

    //empty sudoku cells are predefined with the shuffle

    for (let i = 0; i < to_remove; i++) {
        let cell = positions[i];

        let last_value = board[cell];
        board[cell] = EMPTY_CELL;

        if (!solve(board, cell)) {
            board[cell] = last_value;
            continue;
        }

    }
}

function array_to_2d(some_array) {

    let array2d = new Array(9);
    for (let i = 0; i < array2d.length; i++) {
        array2d[i] = new Array(9);
    }

    for (let j = 0; j < ROWS; j++) {
        for (let k = 0; k < COLS; k++) {
            array2d[j][k] = some_array[ROWS * j + k];
        }
    }

    return array2d;
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

async function send_request(board) {
    let array2d = array_to_2d(board);
    let data = { "type": "rows", "board": array2d };

    return await fetch("https://radiant-ravine-00423.herokuapp.com/https://ffg-sudoku.herokuapp.com/api/grade", {
        "method": "POST",
        "body": JSON.stringify(data),
        "headers": { "Content-Type": "application/json" }
    });
}

async function generate_new_board(parameter) {

    start_load();

    let diff = "";
    initialize_empty_board(board)

    while (diff != parameter) {

        generate_board(board);

        let response = await send_request(board)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let resp_json = await response.json();
        diff = resp_json["difficulty"];

        if (diff != parameter)
            initialize_empty_board(board)



    }

    reset_html_board();
    initialize_html_board(board);

    end_load();

    if (pause_button.style.display == "none") start_timer();
    reset_timer();


}

//start of initialization

let board = [];
initialize_grid();
keyboard();
initialize_empty_board(board);
generate_board(board);
initialize_html_board(board);

//first fetch requires more time (for some reason)
//dummy request is sent to start things going
send_request(board);

//end of initialization

//input
for (let i = 0; i < ROWS * COLS; i++) {
    document.getElementById(parseInt(i)).oninput = function () { user_input() };

    function user_input() {
        let cell = document.getElementById(parseInt(i));
        let new_number = document.getElementById(parseInt(i)).value;

        if (isNaN(new_number)) {
            cell.value = "";
        }

        let col_number = i % COLS;
        let row_number = i / ROWS;
        row_number = Math.floor(row_number);

        let is_valid = is_legit_move(row_number, col_number, new_number, board);
        board[i] = new_number;

        if (!is_valid) {
            cell.value = "";
            board[i] = EMPTY_CELL;
        }

    }
}
