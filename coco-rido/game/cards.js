// Version 1.0

let playerTurn = 0;
let questionMaster = 0;
let playersQuantity = 4;
let cardsQuantity = 11;

let playerCards = {
    0: [],
    1: [],
    2: [],
    3: []
};
let playedCardsForEachPlayer = {
    0: [],
    1: [],
    2: [],
    3: []
};

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
    let playedPlayerViewContainer = document.querySelectorAll('.playedPlayerViewContainer');
    while (playedPlayerViewContainer.firstChild) {
        playedPlayerViewContainer.removeChild(playedPlayerViewContainer.firstChild);
    }

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

            generateRandomRisposte(playerTurn, cardsQuantity);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

//function generateRandomRisposte(playersQuantity, cardsQuantity) {
//    for (let i = 0; i < playersQuantity; i++) {
//        for (let j = 0; j < cardsQuantity; j++) {
//            let randomIndex = Math.floor(Math.random() * risposteCloud.length);
//            playerCards[i].push(risposteCloud[randomIndex]);
//            risposteCloud.splice(randomIndex, 1);
//        }
//
//        setRandomRisposta(i);
//        console.log(playerCards[i]);
//    }
//}

function generateRandomRisposte(playerTurn, cardsQuantity) {
    for (let j = 0; j < cardsQuantity; j++) {
        let randomIndex = Math.floor(Math.random() * risposteCloud.length);
        playerCards[playerTurn].push(risposteCloud[randomIndex]);
        risposteCloud.splice(randomIndex, 1);
    }

    setRandomRisposta(playerTurn);
    console.log(playerCards[playerTurn]);
}

function setRandomRisposta(playerTurn) {
    let cardsArr = Array.from(document.querySelectorAll('.myCard'));
    for (let i = 0; i < cardsArr.length; i++) {
        cardsArr[i].querySelector('.myCardText').textContent = playerCards[playerTurn][i];
    }
}

// Call generateRisposteCloud when the page loads
generateRisposteCloud();

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
    setRandomRisposta(0);
    resetClasses();
    // handlePlayingCards();
});

generateDomandaBtn.addEventListener('click', () => {
    setRandomDomanda();
    resetClasses();
    // handlePlayingCards();
});

let confirmChoiceBtn = document.querySelector('.confirmChoice');

function getNonOccupiedPlaceholders(playedPlayerViewContainer) {
    let nonOccupiedPlaceholders = Array.from(playedPlayerViewContainer.filter(container => !container.classList.contains('occupied')));
    console.log(nonOccupiedPlaceholders);
    
    nonOccupiedPlaceholders.sort((a, b) => {
        let aNumber = parseInt(a.className.replace('cardPlaceholder', ''));
        let bNumber = parseInt(b.className.replace('cardPlaceholder', ''));
        return aNumber - bNumber;
    });

    return nonOccupiedPlaceholders;
}

let playerViewCards = document.querySelectorAll('.myCard');
playerViewCards.forEach(card => {
    card.removeEventListener('click', () => {
        if (!card.classList.contains('cardPlayed')) {
            let playedPlayerViewContainer = Array.from(document.querySelectorAll('.cardPlaceholder'));
            // console.log(playedPlayerViewContainer);
    
            // console.log(nonOccupiedPlaceholders)
            let nonOccupiedPlaceholders = getNonOccupiedPlaceholders(playedPlayerViewContainer);
    
            // console.log("nonOccupiedPlaceholders: " + nonOccupiedPlaceholders.length);
    
            if (nonOccupiedPlaceholders.length != 0) {
                // console.log("nonOccupiedPlaceholders: " + nonOccupiedPlaceholders.length);
                nonOccupiedPlaceholders[0].classList.add('occupied');
    
                let duplicatedCard = card.cloneNode(true);
                duplicatedCard.classList.remove('myCard');
                duplicatedCard.classList.add('dupePlayedCard');
                duplicatedCard.removeChild(duplicatedCard.firstChild);
    
                nonOccupiedPlaceholders[0].appendChild(duplicatedCard);
                card.classList.add('cardPlayed');
                
                nonOccupiedPlaceholders = getNonOccupiedPlaceholders(playedPlayerViewContainer);

                if (nonOccupiedPlaceholders.length == 0)
                    confirmChoiceBtn.classList.remove('hidden');
    
                // console.log("card played");
                // console.log(playedPlayerViewContainer[i].className);
                // console.log(playedPlayerViewContainer);
                console.log("nonOccupiedPlaceholders: " + nonOccupiedPlaceholders.length)
    
                handleResettingChoice();
            } else {
                console.log("no more placeholders");
            }
        }
    });

    card.addEventListener('click', () => {
        if (!card.classList.contains('cardPlayed')) {
            let playedPlayerViewContainer = Array.from(document.querySelectorAll('.cardPlaceholder'));
            // console.log(playedPlayerViewContainer);
    
            // console.log(nonOccupiedPlaceholders)
            let nonOccupiedPlaceholders = getNonOccupiedPlaceholders(playedPlayerViewContainer);
    
            // console.log("nonOccupiedPlaceholders: " + nonOccupiedPlaceholders.length);
    
            if (nonOccupiedPlaceholders.length != 0) {
                // console.log("nonOccupiedPlaceholders: " + nonOccupiedPlaceholders.length);
                nonOccupiedPlaceholders[0].classList.add('occupied');
    
                let duplicatedCard = card.cloneNode(true);
                duplicatedCard.classList.remove('myCard');
                duplicatedCard.classList.add('dupePlayedCard');
                let slideCounter = duplicatedCard.querySelector('.slideCounter');
                if (slideCounter) {
                    slideCounter.remove();
                }
    
                nonOccupiedPlaceholders[0].appendChild(duplicatedCard);
                card.classList.add('cardPlayed');
                
                nonOccupiedPlaceholders = getNonOccupiedPlaceholders(playedPlayerViewContainer);

                if (nonOccupiedPlaceholders.length == 0)
                    confirmChoiceBtn.classList.remove('hidden');
    
                // console.log("card played");
                // console.log(playedPlayerViewContainer[i].className);
                // console.log(playedPlayerViewContainer);
                console.log("nonOccupiedPlaceholders: " + nonOccupiedPlaceholders.length)
    
                handleResettingChoice();
            } else {
                console.log("no more placeholders");
            }
        }
    });
});

function handleResettingChoice() {
    let playerPlayedCards = document.querySelectorAll('.dupePlayedCard');
    let playedPlayerViewContainer = Array.from(document.querySelectorAll('.cardPlaceholder'));

    playerPlayedCards.forEach(card => {
        card.addEventListener('click', () => {
            let parent = card.parentElement;
            parent.classList.remove('occupied');

            // Get the text content of the clicked card
            let cardText = card.querySelectorAll('.myCardText')[0].textContent;

            // Get all cards
            let allCards = document.querySelectorAll('.myCard');

            // Find the card with the same text content
            let sameTextCard = Array.from(allCards).find(c => c.querySelectorAll('.myCardText')[0].textContent === cardText);
            
            // console.log('cardText: ' + cardText);
            // console.log('sameTextCard: ' + sameTextCard.textContent);

            sameTextCard.classList.remove('cardPlayed');

            // Now sameTextCard is the card with the same text content as the clicked card
            // You can add your code here to work with sameTextCard

            parent.removeChild(card);

            console.log("card removed");

            let nonOccupiedPlaceholders = getNonOccupiedPlaceholders(playedPlayerViewContainer);
            if (nonOccupiedPlaceholders.length != 0) {
                confirmChoiceBtn.classList.add('hidden');
            }

            console.log("nonOccupiedPlaceholders: " + nonOccupiedPlaceholders.length);

            // handlePlayingCards();
        });
    });
}

confirmChoiceBtn.addEventListener('click', () => {
    let playedCards = Array.from(document.querySelectorAll('.dupePlayedCard'));

    playedCards.forEach(card => {
        let cardText = card.querySelector('.myCardText').textContent;
        playedCardsForEachPlayer[playerTurn].push(cardText);
    });

    console.log(playedCardsForEachPlayer);

    playerTurn++;
    if (playerTurn < playersQuantity) {
        generateRandomRisposte(playerTurn, cardsQuantity);
        document.querySelector('.turnText').textContent = 'Giocatore ' + (playerTurn + 1);
    } else {
        console.log("end of round, wait for question master to choose the winner");
        alert("da fare");
    }

    setRandomRisposta(playerTurn);
    resetClasses();
    confirmChoiceBtn.classList.add('hidden');
});