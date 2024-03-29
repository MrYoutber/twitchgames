let timerDiv = document.getElementById('timerDiv');
let timerText = document.getElementById('timerText');
let timerCountdown = 60;
let timer60s = true;
let timerRunning = false;
let timer;

let navbar = document.getElementById('navbar');
let footer = document.getElementById('footer');

let scoreText = document.getElementById('scoreText');
let wordText = document.getElementById('wordText');
let wordDiv = document.getElementById('wordDiv');

let minusPunti = document.getElementById('minusPunti');
let plusPunti = document.getElementById('plusPunti');

let minusPasso = document.getElementById('minusPasso');
let passo = document.getElementById('passo');
let plusPasso = document.getElementById('plusPasso');

function startTimer() {
    timerRunning = true;
    timer = setInterval(() => {
        timerCountdown--;
        timerText.textContent = ":" + timerCountdown;
        if (timerCountdown <= 0) {
            clearInterval(timer);
            timerRunning = false;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timerRunning = false;
}

function changeTimer() {
    if (timer60s) {
        timerCountdown = 60;
    } else {
        timerCountdown = 120;
    }
    timerText.textContent = ":" + timerCountdown;
}

function toggleNavbar() {
    navbar.classList.toggle('hidden');
}

function rollLetters(length) {
    return new Promise((resolve) => {
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let intervalId = setInterval(() => {
            let randomString = '';
            for (let i = 0; i < length; i++) {
                randomString += letters.charAt(Math.floor(Math.random() * letters.length));
            }
            wordText.textContent = randomString;
        }, 50);

        setTimeout(() => {
            clearInterval(intervalId);
            resolve();
        }, 1000);
    });
}

function generateWord() {
    fetch('parole2.txt')
        .then(response => response.text())
        .then(data => {
            let words = data.split('\n');
            let randomWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
            let length = randomWord.length;
            rollLetters(length).then(() => {
                wordText.textContent = randomWord;
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// CONTROLS

// TIMER
document.addEventListener('keyup', function(event) {
    if (event.code === 'Space') {
        event.preventDefault(); // prevent the default action, without this the spacebar would scroll the page instead of controlling the timer
        if (timerCountdown === 0) {
            stopTimer();
            changeTimer();
        } else {
            if (!timerRunning) {
                generateWord();
                startTimer();
            } else {
                stopTimer();
            }
        }
    }
});

// MOBILE WORD GENERATION
wordDiv.addEventListener('click', function() {
    if (timerCountdown === 0) {
        stopTimer();
        changeTimer();
    } else {
        if (!timerRunning) {
            generateWord();
            startTimer();
        } else {
            stopTimer();
        }
    }
});

// GESTIONE PASSO
document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowUp') {
        passo.textContent = parseInt(passo.textContent) + 1;
    }
    if (event.key === 'ArrowDown') {
        if (parseInt(passo.textContent) > 0)
            passo.textContent = parseInt(passo.textContent) - 1;
    }
});

minusPasso.addEventListener('click', function() {
    if (parseInt(passo.textContent) > 0)
            passo.textContent = parseInt(passo.textContent) - 1;
});

passo.addEventListener('click', function() {
    if (parseInt(passo.textContent) > 0)
        passo.textContent = parseInt(passo.textContent) - 1;
});

plusPasso.addEventListener('click', function() {
    passo.textContent = parseInt(passo.textContent) + 1;
});

// GESTIONE PUNTI
document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowRight') {
        scoreText.textContent = parseInt(scoreText.textContent) + 1;
    }
    if (event.key === 'ArrowLeft') {
        if (parseInt(scoreText.textContent) > 0)
            scoreText.textContent = parseInt(scoreText.textContent) - 1;
    }
});

minusPunti.addEventListener('click', function() {
    if (parseInt(scoreText.textContent) > 0)
        scoreText.textContent = parseInt(scoreText.textContent) - 1;
});

plusPunti.addEventListener('click', function() {
    scoreText.textContent = parseInt(scoreText.textContent) + 1;
});

// CAMBIO TIMER
timerDiv.addEventListener('click', function() {
    stopTimer();
    timer60s = !timer60s;
    changeTimer();
});

// NAVBAR AND FOOTER
document.addEventListener('keyup', function(event) {
    if (event.key === 'Backspace') {
        toggleNavbar();
    }
});