//loading animation functions
function start_load() {
    loader.className = "loader";
}

function end_load() {
    loader.className += " hidden";
}

window.addEventListener("load", function () {
    end_load();
});


//timer
const timer = document.querySelector('#time');
const play_button = document.getElementById('play');
const pause_button = document.getElementById('pause');


let time = 0,
    interval;

function show_time() {
    time++;
    timer.innerHTML = toHHMMSS(time);
}

function pause_timer() {

    clearInterval(interval);
    interval = null;

    play_button.style.display = 'block';
    pause_button.style.display = 'none';
}

function start_timer(){

    interval = setInterval(show_time, 1000);

    pause_button.style.display = 'block';
    play_button.style.display = 'none';
}
interval = setInterval(show_time, 1000);

function reset_timer() {
    clearInterval(interval);
    interval = null;
    time = 0;
    interval = setInterval(show_time, 1000);

    timer.innerHTML = "00:00:00";
}

function toHHMMSS(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - hours * 3600) / 60);
    let seconds = time - hours * 3600 - minutes * 60;

    hours = `${hours}`.padStart(2, '0');
    minutes = `${minutes}`.padStart(2, '0');
    seconds = `${seconds}`.padStart(2, '0');

    return hours + ':' + minutes + ':' + seconds;
}


//change numbers without backspace
function keyboard() {
    const cells = document.querySelectorAll("input[type=\"text\"]")
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("input", () => {
            const cell = cells[i];
            let col_number = i % COLS;
            let row_number = i / ROWS;
            row_number = Math.floor(row_number);
            if (cell.value.length > 1) {
                if (is_legit_move(row_number, col_number, cell.value[1], board)) {
                    cell.value = cell.value[1];
                }
                else cell.value = cell.value[0];
            }
        });
    }
}

//arrow key movement
$('#sudoku').arrowTable();






