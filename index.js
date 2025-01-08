const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// Configuration du canvas
const canvasWidth = 750;
const canvaHeight = 500;
const cellSize = 25;

const rows = canvaHeight / cellSize;
const cols = canvasWidth / cellSize;

canvas.width = canvasWidth;
canvas.height = canvaHeight;


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
    ctx.fillRect(applePosition[0] * cellSize, applePosition[1] * cellSize, cellSize, cellSize);
}


// Configuration du Snake
let x = 0;
let y = 0;
let x_dir = 1;
let y_dir = 0;

let snakeSize = 15;
let snakePosition = [];
let snakeHead = [];

let addNewApple = true;
let applePosition = [];

let score = 0;
let scoreDiv = document.getElementById('score-score');
let gameoverScoreDiv = document.getElementById('gameover-score');
let gameOverDiv = document.getElementById('gameover-container');
let isGameActive = true;
let isGamePaused = false;


document.addEventListener('keydown', (event) => {
    const keyName = event.key;

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


// déplacer le snake sur le canvas
function mooveSnake() {
    snakeHead = [x, y];
    snakePosition.push([x, y]);
    if (snakePosition.length > snakeSize) {
        snakePosition.shift();
    }

    ctx.fillStyle = 'green';
    snakePosition.forEach((pos) => {
        ctx.fillRect(pos[0] * cellSize, pos[1] * cellSize, cellSize, cellSize);
    })

    x += x_dir;
    y += y_dir;
}


// téléporter le snake si il sort du canvas
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


// génère une pomme et l'affiche dans le quadrillage
function addApple() {
    // TODO ajouter qu'on peut pas spawn une pomme sur le snake
    if (addNewApple) {
        let x_apple = Math.floor(Math.random() * (cols));
        let y_apple = Math.floor(Math.random() * (rows));

        applePosition = [x_apple, y_apple];
        addNewApple = false;
    }
}


// Mange une pomme quand la tete du snake passe dessus
function eatApple() {
    if ((applePosition[0] === snakeHead[0]) && (applePosition[1] === snakeHead[1])) {
        snakeSize += 1;
        addNewApple = true;

        // TODO score qui se met a jour une frame trop tot
        score += 1;
        scoreDiv.textContent = score;
    }
}


// gère la collision du snake sur lui même pour perdre
function snakeCollision() {
    // TODO continuer bien les collisions
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
    gameoverScoreDiv.textContent = `Score: ${score}`;
    gameOverDiv.style.display = 'flex';
}


// met en pause le jeu
function pauseGame() {
    // TODO faire en sorte de pouvoir reprendre le jeu
    isGamePaused = !isGamePaused;
}


// permet de relancer une partie
function restartGame() {
    x = 0;
    y = 0;
    x_dir = 1;
    y_dir = 0;

    snakeSize = 15;
    snakePosition = [];
    snakeHead = [];

    addNewApple = true;
    applePosition = [];

    score = 0;
    scoreDiv = document.getElementById('score-score');
    gameoverScoreDiv = document.getElementById('gameover-score');
    gameOverDiv = document.getElementById('gameover-container');
    isGameActive = true;
    isGamePaused = false;

    gameOverDiv.style.display = 'none';
    scoreDiv.textContent = '0';

    gameLoop();
}


// lance la boucle du jeu
function gameLoop() {
    if (isGameActive && !isGamePaused) {
        resetCanvas();

        mooveSnake();

        snakeCollision();
        changeSnakePosition();
        addApple();
        eatApple();

        setTimeout(() => {
            requestAnimationFrame(gameLoop)
        }, 200);
    }
}

gameLoop();
