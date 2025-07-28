// Variable Definition
//const WordRows = 6;
/* 
Reference for Randomly Sorting 
an Element from an Array

let colors = ["red", "green", "blue", "yellow"];
let random = colors.sort(() => 0.5 - Math.random())[0];
console.log(random);
*/

class WordleGame {
    constructor() {
        this.rows = 6;
        this.cols = 5;
        this.currentRow = 0;
        this.currentCol = 0;
        this.targetWord = this.getRandomWord();
        this.gameOver = false;
        this.board = [];

        this.createBoard();
        this.createKeyboard();
        this.setupEventListeners();
        console.log('Target word:', this.targetWord); // For testing
    }



    getRandomWord() {
        const words = ["ABIDE", "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER",
            "AGAIN", "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW",
            "ALONE", "ALONG", "ALTER", "AMBER", "AMUSE", "ANGEL", "ANGER", "ANGLE", "ANGRY", "APPLE",
            "APPLY", "ARENA", "ARGUE", "ARISE", "ARMED", "ARMOR", "ARRAY", "ARROW", "ASIDE", "ASSET",
            "AUDIO", "AUDIT", "AVOID", "AWAKE", "AWARD", "AWARE", "AWFUL", "BACON", "BADGE", "BADLY",
            "BAKER", "BASIN", "BASIS", "BEACH", "BEARD", "BEAST", "BEGIN", "BEING", "BELOW", "BENCH",
            "BERRY", "BIRTH", "BLACK", "BLADE", "BLAME", "BLANK", "BLAST", "BLAZE", "BLEED", "BLESS",
            "BLIND", "BLOCK", "BLOOD", "BLOOM", "BLOWN", "BOARD", "BOAST", "BONUS", "BOOTH", "BOUND",
            "BRAIN", "BRAND", "BRAVE", "BREAD", "BREAK", "BREED", "BRICK", "BRIDE", "BRIEF", "BRING",
            "BROAD", "BROKE", "BROOK", "BROWN", "BRUSH", "BUDDY", "BUILD", "BUILT", "BURST", "BUYER",
            "CABIN", "CABLE", "CARRY", "CATCH", "CAUSE", "CEASE", "CHAIN", "CHAIR", "CHARM", "CHASE",
            "CHEAP", "CHEER", "CHEST", "CHIEF", "CHILD", "CHILL", "CHINA", "CHOIR", "CHOSE", "CIVIL",
            "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLERK", "CLICK", "CLIFF", "CLIMB", "CLOCK", "CLOUD",
            "COACH", "COAST", "COLOR", "COMIC", "COUNT", "COVER", "CRACK", "CRAFT", "CRASH", "CRAWL",
            "CRAZY", "CREAM", "CREEK", "CREEP", "CRIME", "CRISP", "CROWD", "CROWN", "CRUSH", "CURVE",
            "CYCLE", "DAILY", "DANCE", "DAIRY", "DATED", "DAWNS", "DEATH", "DELAY", "DEPTH", "DEVIL",
            "DIARY", "DINER", "DIRTY", "DITCH", "DIZZY", "DOING", "DONOR", "DOUBT", "DRAFT", "DRAMA",
            "DRAWN", "DRESS", "DRIED", "DRINK", "DRIVE", "DROWN", "DRUNK", "DRYER", "EAGER", "EARLY",
            "EARTH", "EATEN", "ELBOW", "ELDER", "ELECT", "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTER",
            "EQUAL", "ERROR", "ESSAY", "EVENT", "EVERY", "EVOKE", "EXACT", "EXIST", "EXTRA", "FAINT",
            "FAIRY", "FAITH", "FALSE", "FANCY", "FATAL", "FAULT", "FAVOR", "FEAST", "FEVER", "FIELD",
            "FIFTH", "FIGHT", "FINAL", "FINER", "FIRST", "FLAME", "FLANK", "FLASH", "FLEET", "FLESH",
            "FLOAT", "FLOOR", "FLOUR", "FLUID", "FLUSH", "FLYER", "FOCUS", "FORCE", "FORGE", "FORTH",
            "FOUND", "FRAME", "FRAUD", "FRESH", "FRONT", "FRUIT", "FUNNY", "FURRY", "GIANT", "GIVEN",
            "GLADE", "GLARE", "GLORY", "GLOVE", "GRACE", "GRADE", "GRAIN", "GRAND", "GRANT", "GRAVE",
            "GREAT", "GREET", "GRIEF", "GRILL", "GROSS", "GROUP", "GROWN", "GUARD", "GUESS", "GUEST",
            "GUIDE", "GUILT", "HABIT", "HAPPY", "HARDY", "HARSH", "HAVEN", "HEART", "HEAVY", "HEDGE",
            "HELLO", "HENCE", "HOBBY", "HONOR", "HORSE", "HOTEL", "HOUSE", "HUMAN", "HUMOR", "HURRY",
            "IDEAL", "IDIOT", "IMAGE", "IMPLY", "INBOX", "INDEX", "INFER", "INLET", "INNER", "INPUT",
            "ISSUE", "IVORY", "SPEND", "SPINE"];

        return words[Math.floor(Math.random() * words.length)];
    }

    // Creating the GameBoard
    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        for (let row = 0; row < this.rows; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row';
            rowDiv.dataset.row = row;

            this.board[row] = [];

            for (let col = 0; col < this.cols; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.row = row;
                tile.dataset.col = col;

                this.board[row][col] = {
                    element: tile,
                    letter: ''
                };

                rowDiv.appendChild(tile);
            }

            gameBoard.appendChild(rowDiv);
        }
    }

    createKeyboard() {
        const keyboard = document.getElementById('keyboard');
        const keys = [
            'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
            'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
            'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'
        ];

        keyboard.innerHTML = '';

        keys.forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.className = 'key';
            keyElement.textContent = key;
            keyElement.dataset.key = key;

            if (key === 'ENTER' || key === 'BACKSPACE') {
                keyElement.classList.add('wide');
            }

            keyElement.addEventListener('click', () => this.handleKeyPress(key));
            keyboard.appendChild(keyElement);
        });
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;

            const key = e.key.toUpperCase();
            if (key === 'ENTER') {
                this.handleKeyPress('ENTER');
            } else if (key === 'BACKSPACE') {
                this.handleKeyPress('BACKSPACE');
            } else if (key.match(/^[A-Z]$/)) {
                this.handleKeyPress(key);
            }
        });
    }

    handleKeyPress(key) {
        if (this.gameOver) return;

        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (key.match(/^[A-Z]$/) && this.currentCol < this.cols) {
            this.addLetter(key);
        }
    }

    addLetter(letter) {
        if (this.currentCol < this.cols) {
            const tile = this.board[this.currentRow][this.currentCol];
            tile.letter = letter;
            tile.element.textContent = letter;
            tile.element.classList.add('filled');
            this.currentCol++;
        }
    }

    deleteLetter() {
        if (this.currentCol > 0) {
            this.currentCol--;
            const tile = this.board[this.currentRow][this.currentCol];
            tile.letter = '';
            tile.element.textContent = '';
            tile.element.classList.remove('filled');
        }
    }

    submitGuess() {
        if (this.currentCol !== this.cols) {
            this.showMessage('Not enough letters!');
            this.shakeRow();
            return;
        }

        const guess = this.board[this.currentRow].map(tile => tile.letter).join('');
        
        // Check guess first, then evaluate win condition
        this.checkGuess(guess);

        // Fixed: Use proper uppercase comparison
        if (guess === this.targetWord.toUpperCase()) {
            setTimeout(() => {
                this.showMessage('Congratulations! You won!');
                this.gameOver = true;
            }, 500); // Wait for tile animations to complete
        } else if (this.currentRow === this.rows - 1) {
            setTimeout(() => {
                this.showMessage(`Game Over! The word was ${this.targetWord.toUpperCase()}`);
                this.gameOver = true;
            }, 500);
        } else {
            // Move to next row after animations complete
            setTimeout(() => {
                this.currentRow++;
                this.currentCol = 0;
            }, 500);
        }
    }

    checkGuess(guess) {
        // Fixed: Use proper uppercase conversion for consistent comparison
        const targetLetters = this.targetWord.toUpperCase().split('');
        const guessLetters = guess.split('');
        const result = new Array(this.cols).fill('absent');

        // Check for correct letters first
        for (let i = 0; i < this.cols; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                result[i] = 'correct';
                targetLetters[i] = null;
                guessLetters[i] = null;
            }
        }

        // Check for present letters
        for (let i = 0; i < this.cols; i++) {
            if (guessLetters[i] && targetLetters.includes(guessLetters[i])) {
                result[i] = 'present';
                targetLetters[targetLetters.indexOf(guessLetters[i])] = null;
            }
        }

        // Apply colors to the tiles
        for (let i = 0; i < this.cols; i++) {
            setTimeout(() => {
                const tile = this.board[this.currentRow][i];
                tile.element.classList.add(result[i]);
            }, i * 100);
        }
    }

    shakeRow() {
        const row = document.querySelector(`[data-row="${this.currentRow}"]`);
        row.classList.add('shake');
        setTimeout(() => row.classList.remove('shake'), 500);
    }

    showMessage(text) {
        const message = document.getElementById('message');
        message.textContent = text;
        setTimeout(() => message.textContent = '', 3000);
    }

}

/*function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}*/

// Initialize the game
let game = new WordleGame();