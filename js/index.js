const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// Configuration du canva
const canvasWidth = 750;
const canvaHeight = 500;
const cellSize = 25;

const rows = canvaHeight / cellSize;
const cols = canvasWidth / cellSize;

canvas.width = canvasWidth;
canvas.height = canvaHeight;

// div utiles
let scoreText = document.getElementById('score-score');
let highscore = localStorage.getItem('highscore')
let highscoreText = document.getElementById('highscore-score');
highscoreText.textContent = highscore;
let gameoverScoreDiv = document.getElementById('gameover-score');
let gameOverDiv = document.getElementById('gameover-container');
let startGameDiv = document.getElementById('startgame-container');
let pauseGameDiv = document.getElementById('pausegame-container');
let leaderboardDiv = document.getElementById('leaderboard-container');
let popupHighScoreDiv = document.getElementById('popup-highscore-container');
let closePopupHighscore = document.getElementById('close-popup-highscore');
let closeLeaderboard = document.getElementById('close-leaderboard');
closePopupHighscore.addEventListener('click', () => {
    popupHighScoreDiv.style.display = 'none';
})
closeLeaderboard.addEventListener('click', () => {
    leaderboardDiv.style.display = 'none';
})

let nameHighscore = document.getElementById('name-highscore');

async function addUser() {
    // console.log(nameHighscore.value)
    await addHighScore(nameHighscore.value, score)
    popupHighScoreDiv.style.display = 'none';
}

// Configuration du Snake
let x = 0;
let y = 0;
let x_dir = 0;
let y_dir = 0;

let snakeSize = 0;
let snakePosition = [];
let snakeHead = [];

let applePosition = [];

let score = 0;
let isGameActive = false;
let isGamePaused = false;


// Configuration des touches pressables
document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    // TODO: empecher un "demi tour" si 2 touches pressées trop vite
    if (keyName === 'ArrowUp' && !(y_dir > 0)) {
        x_dir = 0;
        y_dir = -1;
    }
    if (keyName === 'ArrowDown' && !(y_dir < 0)) {
        x_dir = 0;
        y_dir = 1;
    }
    if (keyName === 'ArrowLeft' && !(x_dir > 0)) {
        x_dir = -1;
        y_dir = 0;
    }
    if (keyName === 'ArrowRight' && !(x_dir < 0)) {
        x_dir = 1;
        y_dir = 0;
    }

    if (keyName === 'Enter') {
        pauseGame();
    }
});


// Fonction pour dessiner le damier en fond du canvas
function drawCheckerboard() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const isGreen = (row + col) % 2 === 0;
            ctx.fillStyle = isGreen ? '#82C46C' : '#95A595';

            const x = col * cellSize;
            const y = row * cellSize;
            ctx.fillRect(x, y, cellSize, cellSize);
        }
    }
}

// dessiner une première fois le quadrillage du canvas
drawCheckerboard();


// Fonction pour clear le canva et afficher le quadrillage
function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCheckerboard();

    // afficher la pomme a chaque frame
    ctx.fillStyle = 'red';
    ctx.fillRect(applePosition[0] * cellSize + 1, applePosition[1] * cellSize + 1, cellSize - 2, cellSize - 2);
}


// déplacer le snake sur le canvas
function mooveSnake() {
    snakeHead = [x, y];
    snakePosition.push([x, y]);
    if (snakePosition.length > snakeSize) {
        snakePosition.shift();
    }

    ctx.fillStyle = 'green';
    snakePosition.forEach((pos) => {
        ctx.fillRect(pos[0] * cellSize + 1, pos[1] * cellSize + 1, cellSize-2, cellSize-2);
    })

    x += x_dir;
    y += y_dir;

    changeSnakePosition();
}


// passer d'un mur à l'autre si le snake sort du canvas
function changeSnakePosition() {
    if (x >= canvasWidth / cellSize) {
        x = 0;
    }
    if (x < 0) {
        x = canvasWidth / cellSize - 1;
    }
    if (y >= canvaHeight / cellSize) {
        y = 0;
    }
    if (y < 0) {
        y = canvaHeight / cellSize - 1;
    }
}


// ajoute une pomme sur le plateau
function addApple() {
    // TODO empecher de faire apparaitre une pomme dans le snake
    let x_apple = Math.floor(Math.random() * (cols));
    let y_apple = Math.floor(Math.random() * (rows));

    applePosition = [x_apple, y_apple];

}


// Mange une pomme quand la tete du snake passe dessus et en ajoute une nouvelle
function eatApple() {
    if ((applePosition[0] === snakeHead[0]) && (applePosition[1] === snakeHead[1])) {
        snakeSize += 3;
        score += 1;
        scoreText.textContent = score;
        addApple();
    }
}


// gère la collision du snake sur lui même pour perdre
function snakeCollision() {
    function posEquals(pos1, pos2) {
        if (pos1.length !== pos2.length) {
            return false;
        }
        for (let i = 0; i < pos1.length; i++) {
            if (pos1[i] !== pos2[i]) {
                return false;
            }
        }
        return true;
    }

    const snakePositionWithoutHead = snakePosition.slice(0, snakePosition.length - 1);
    if (snakePositionWithoutHead.some(item => posEquals(item, snakeHead))) {
        stopGame();
    }
}


// arrête le jeu
function stopGame() {
    isGameActive = false;
    if (score > highscore) {
        localStorage.setItem('highscore', score);
        highscoreText.textContent = score;
        gameoverScoreDiv.textContent = `New high score : ${score} !`;
        popupHighScoreDiv.style.display = 'flex';
    } else {
        gameoverScoreDiv.textContent = `Score : ${score}`;
    }
    gameOverDiv.style.display = 'flex';
}


// met en pause le jeu
function pauseGame() {
    if (isGameActive) {
        if (isGamePaused) {
            isGamePaused = false;
            pauseGameDiv.style.display = 'none';
            gameLoop();
        } else {
            isGamePaused = true;
            pauseGameDiv.style.display = 'flex';
        }
    }
}


// permet de relancer une partie
function startGame() {
    x = 1;
    y = 1;
    x_dir = 1;
    y_dir = 0;

    snakeSize = 3;
    snakePosition = [];
    snakeHead = [];

    applePosition = [];

    score = 0;
    isGameActive = true;
    isGamePaused = false;

    gameOverDiv.style.display = 'none';
    startGameDiv.style.display = 'none';
    pauseGameDiv.style.display = 'none';
    scoreText.textContent = '0';

    addApple();
    gameLoop();
}


// lance la boucle du jeu
function gameLoop() {
    if (isGameActive && !isGamePaused) {
        resetCanvas();

        mooveSnake();

        snakeCollision();
        eatApple();

        setTimeout(() => {
            requestAnimationFrame(gameLoop)
        }, 100);
    }
}


// affiche le leaderboard global
async function showLeaderboard() {
    const scores = await getHighScores();

    leaderboardDiv.style.display = 'flex';

    const tableBody = document.querySelector("#leaderboard-scores tbody");
    tableBody.innerHTML = '';

    scores.forEach(score => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = score.name;
        row.appendChild(nameCell);

        const scoreCell = document.createElement("td");
        scoreCell.textContent = score.score;
        row.appendChild(scoreCell);

        tableBody.appendChild(row);
    });
}
