const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let gameRoom = {
    players: [],
    cards: {},
    gameStarted: false
};

io.on('connection', (socket) => {
    if (gameRoom.players.length < 2) {
        let playerNumber = `player${gameRoom.players.length + 1}`;
        gameRoom.players.push(playerNumber);
        socket.playerNumber = playerNumber;

        if (gameRoom.players.length === 2) {
            gameRoom.gameStarted = true;
        }
    }

    socket.on('disconnect', () => {
        let playerIndex = gameRoom.players.indexOf(socket.playerNumber);
        if (playerIndex !== -1) {
            gameRoom.players.splice(playerIndex, 1);
        }

        if (gameRoom.gameStarted) {
            console.log(`${socket.playerNumber} has disconnected. Game is paused.`);
            // Handle game pause or end here
        }
    });

    socket.on('confirmChoiceBtn', (card) => {
        if (gameRoom.gameStarted && socket.playerNumber) {
            gameRoom.cards[socket.playerNumber] = card;

            if (Object.keys(gameRoom.cards).length === 4) {
                console.log('All players have played their cards:');
                for (let player in gameRoom.cards) {
                    console.log(`${player}: ${gameRoom.cards[player]}`);
                }
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});