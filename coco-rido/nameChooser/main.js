let expandingWhite = document.querySelector('.expandingWhite');

window.addEventListener('load', () => {
    setTimeout(() => {
        expandingWhite.classList.add('unexpand');
        expandingWhite.classList.remove('expanded');
    }, 100);

    setTimeout(() => {
        expandingWhite.classList.remove('unexpand');
    }, 1100);
});


let wheel = document.querySelector('.wheel');
let spinBtn = document.querySelector('.spinBtn');
let randomInt = getRandomInt(1,4);
let value = -3600 - (randomInt-1) * 90;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let name1 = document.getElementById('name1');
let name2 = document.getElementById('name2');
let name3 = document.getElementById('name3');
let name4 = document.getElementById('name4');

name1.addEventListener('input', () => {
    let value = name1.value;
    let wheelName = document.getElementById('wheelName1');

    wheelName.innerHTML = value;
});

name2.addEventListener('input', () => {
    let value = name2.value;
    let wheelName = document.getElementById('wheelName2');

    wheelName.innerHTML = value;
});

name3.addEventListener('input', () => {
    let value = name3.value;
    let wheelName = document.getElementById('wheelName3');

    wheelName.innerHTML = value;
});

name4.addEventListener('input', () => {
    let value = name4.value;
    let wheelName = document.getElementById('wheelName4');

    wheelName.innerHTML = value;
});


spinBtn.onclick = function() {
    let wheelName1 = document.getElementById('wheelName1').innerHTML;
    let wheelName2 = document.getElementById('wheelName2').innerHTML;
    let wheelName3 = document.getElementById('wheelName3').innerHTML;
    let wheelName4 = document.getElementById('wheelName4').innerHTML;

    if (wheelName1 != wheelName2 && wheelName1 != wheelName3 && wheelName1 != wheelName4 && wheelName2 != wheelName3 && wheelName2 != wheelName4 && wheelName3 != wheelName4) {
        wheel.style.transform = `rotate(${value}deg)`;
    } else {
        alert('Alcuni nomi sono uguali tra loro oppure non li hai compilati tutti!');
    }
}

wheel.addEventListener('transitionend', () => {
    new Promise((resolve) => {
        setTimeout(() => {
            alert('Il question master è: ' + document.getElementById(`name${randomInt}`).value);
            expandingWhite.classList.add('expand');
            resolve();
        }, 300);
    }).then(() => {
        setTimeout(() => {
            expandingWhite.classList.add('expanded');
            window.location.href = '../game/';
        }, 1000);
    });
});