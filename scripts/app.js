const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Játék változók
let currentWord, correctLetters, nemTalalt;
const maxGuesses = 6;

const resetGame = () => {
    // Játék&&UI visszaállítás
    correctLetters = [];
    nemTalalt = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${nemTalalt} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = async () => {
    try {
        // JSON beolvasása
        const response = await fetch('words.json');
        const data = await response.json();

        // Random szó választás
        const { word, hint } = data[Math.floor(Math.random() * data.length)];

        // Szó&&utalás kiírása
        currentWord = word;
        document.querySelector(".hint-text b").innerText = hint;

        // Játék reset
        resetGame();
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

const gameOver = (isVictory) => {
    // Játék utáni panel megjelenítése releváns adtatokkal
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}

const initGame = (button, clickedLetter) => {
    // Itt ellenőrizzük hogy a betű benne van-e
    if(currentWord.includes(clickedLetter)) {
        // Ezzel jelenítjük meg a kitalált betűket
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // Ha nem talált frissítjük a nemTalalt változó értékét&&az akasztófa képet
        nemTalalt++;
        hangmanImage.src = `images/hangman-${nemTalalt}.svg`;
    }
    button.disabled = true; // Megnyomott gombok letiltása
    guessesText.innerText = `${nemTalalt} / ${maxGuesses}`;

    // Ha valamelyik igaz, hívjuk a gameOver functiont.
    if(nemTalalt === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Gombok
const hungarianCharacters = ['a', 'á', 'b', 'c', 'd', 'e', 'é', 'f', 'g', 'h', 'i', 'í', 'j', 'k', 'l', 'm', 'n', 'o', 'ó', 'ö', 'ő', 'p', 'q', 'r', 's', 't', 'u', 'ú', 'ü', 'ű', 'v', 'w', 'x', 'y', 'z'];

for (let char of hungarianCharacters) {
    
    const button = document.createElement("button");
    button.innerText = char;
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, char));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);