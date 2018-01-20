var view = {
    // 这个方法将字符串作为参数,并在消息区域显示它
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}

var model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [{ locations: ["06", "16", "26"], hits: ["", "", ""] },
        { locations: ["24", "34", "44"], hits: ["", "", ""] },
        { locations: ["10", "11", "12"], hits: ["", "", ""] },
    ],
    //  向战舰开火的方法
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!")
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!")
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You miessed.")
        return false;
    },

    // 判断战舰是否被击落,如果整个战舰都被击中就算是被击落
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    }
}

var controller = {
    guesses: 0,
    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk == model.numShips) {
                view.displayMessage("You sank all my battleships,in " + this.guesses + " guess");
            }
        }
    }
}

// 用来验证输入是否有效
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
        alert("Oops,please enter a letter and a number on the board");
    } else {
        var row = alphabet.indexOf(guess.charAt(0));
        var column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            alert("Oops,that isn's on the board.");
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert("Oops,that isn's on the board.");
        } else {
            return row + column;
        }
    }
    return null;
}

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeypress;
}

function handleFireButton() {
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

function handleKeypress(e) {
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;