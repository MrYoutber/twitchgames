// Version 1.0
let domandeCloud = [];

function generateDomandeCloud() {
    fetch('txt/domande.txt')
        .then(response => response.text())
        .then(data => {
            let lines = data.split('\n');

            lines.forEach(line => {
                let obj = {};
                obj.domanda = line;
                let matchCount = (line.match(/_________/g) || []).length;
                obj.spazi = matchCount > 0 ? matchCount : 1;
                domandeCloud.push(obj);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function setRandomDomanda() {
    let domandaCard = document.querySelector('.questionText');
    let randomIndex = Math.floor(Math.random() * domandeCloud.length);
    domandaCard.textContent = domandeCloud[randomIndex].domanda;
    let spazi = domandeCloud[randomIndex].spazi;
    domandeCloud.splice(randomIndex, 1);
    console.log("domanda set");

    let container = document.querySelector('.playedCardsPlayerViewContainer');
    // Remove all child divs
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    // Append new divs based on the value of spazi
    for (let i = 0; i < spazi; i++) {
        let placeholder = document.createElement('div');
        placeholder.className = 'cardPlaceholder';
        container.appendChild(placeholder);
    }
}

generateDomandeCloud();
setTimeout(setRandomDomanda, 100);

let risposteCloud = [];

function generateRisposteCloud() {
    fetch('txt/risposte.txt')
        .then(response => response.text())
        .then(data => {
            let lines = data.split('\n');
            lines.forEach(line => {
                risposteCloud.push(line);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function setRandomRisposta() {
    let cards = document.querySelectorAll('.myCardText');
    cards.forEach(card => {
        let randomIndex = Math.floor(Math.random() * risposteCloud.length);
        card.textContent = risposteCloud[randomIndex];
        risposteCloud.splice(randomIndex, 1);
        console.log("risposta set");
    });
}

// Call generateRisposteCloud when the page loads
generateRisposteCloud();
setTimeout(setRandomRisposta, 100);

let generateRisposteBtn = document.getElementById('generateRisposteBtn');
let generateDomandaBtn = document.getElementById('generateDomandaBtn');

generateRisposteBtn.addEventListener('click', () => {
    setRandomRisposta();
});

generateDomandaBtn.addEventListener('click', () => {
    setRandomDomanda(domandeCloud);
});