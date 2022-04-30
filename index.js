const { DraughtsGame } = require("./game");

const game = new DraughtsGame();

game.showBoard();
console.log(game.move(2, 3, 3, 4, 1));
console.log(game.move(5, 2, 4, 3, 2));
console.log(game.move(3, 4, 5, 2, 1));
console.log(game.move(6, 1, 4, 3, 2));
game.showBoard();
