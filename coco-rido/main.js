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

    let container = document.querySelector('.playedPlayerViewContainer');
    // Remove all child divs
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    // Append new divs based on the value of spazi
    for (let i = 0; i < spazi; i++) {
        let placeholder = document.createElement('div');
        placeholder.className = 'cardPlaceholder';
        placeholder.classList.add('cardPlaceholder' + (i + 1));
        container.appendChild(placeholder);
    }
}

generateDomandeCloud();
setTimeout(setRandomDomanda, 500);

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
setTimeout(setRandomRisposta, 500);

function resetClasses() {
    let cards = document.querySelectorAll('.myCard');
    cards.forEach(card => {
        card.classList.remove('cardPlayed');
    });

    let playedPlayerViewContainer = document.querySelectorAll('.cardPlaceholder');
    playedPlayerViewContainer.forEach(container => {
        container.classList.remove('occupied');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    });
}

let generateRisposteBtn = document.getElementById('generateRisposteBtn');
let generateDomandaBtn = document.getElementById('generateDomandaBtn');

generateRisposteBtn.addEventListener('click', () => {
    setRandomRisposta();
    resetClasses();
    handlePlayingCards();
});

generateDomandaBtn.addEventListener('click', () => {
    setRandomDomanda();
    resetClasses();
    handlePlayingCards();
});

let confirmChoiceBtn = document.querySelector('.confirmChoice');

function handlePlayingCards() {
    let playerViewCards = document.querySelectorAll('.myCard');
    let playedPlayerViewContainer = Array.from(document.querySelectorAll('.cardPlaceholder'));
    console.log(playedPlayerViewContainer);

    playerViewCards.forEach(card => {
        card.addEventListener('click', () => {
            let nonOccupiedPlaceholders = handleResettingChoice();

            if (nonOccupiedPlaceholders.length != 0) {
                nonOccupiedPlaceholders[0].classList.add('occupied');

                let duplicatedCard = card.cloneNode(true);
                duplicatedCard.classList.remove('myCard');
                duplicatedCard.classList.add('dupePlayedCard');

                nonOccupiedPlaceholders[0].appendChild(duplicatedCard);
                card.classList.add('cardPlayed');
                confirmChoiceBtn.classList.remove('hidden');

                console.log("card played");
                // console.log(playedPlayerViewContainer[i].className);
                console.log(playedPlayerViewContainer);

                handleResettingChoice();
            }
        });
    });
}

setTimeout(() => {
    handlePlayingCards();
}, 1000);

function handleResettingChoice() {
    let playerPlayedCards = document.querySelectorAll('.dupePlayedCard');
    let playedPlayerViewContainer = Array.from(document.querySelectorAll('.cardPlaceholder'));
    let nonOccupiedPlaceholders = Array.from(playedPlayerViewContainer.filter(container => !container.classList.contains('occupied')));

    playerPlayedCards.forEach(card => {
        card.addEventListener('click', () => {
            let parent = card.parentElement;
            parent.classList.remove('occupied');
            parent.removeChild(card);
            console.log("card removed");

            // Push the parent to the nonOccupiedPlaceholders array
            nonOccupiedPlaceholders.push(parent);

            // Sort the nonOccupiedPlaceholders array based on the number in the class name
            nonOccupiedPlaceholders.sort((a, b) => {
                let aNumber = parseInt(a.className.replace('cardPlaceholder', ''));
                let bNumber = parseInt(b.className.replace('cardPlaceholder', ''));
                return aNumber - bNumber;
            });

            console.log("non occupied placeholders: " + nonOccupiedPlaceholders);

            if (playedPlayerViewContainer.every(container => !container.classList.contains('occupied'))) {
                confirmChoiceBtn.classList.add('hidden');
            }

            handlePlayingCards();
        });
    });

    return nonOccupiedPlaceholders;
}



confirmChoiceBtn.addEventListener('click', () => {
    console.log("choice confirmed");
    // implement logic to check if all cards are played
});