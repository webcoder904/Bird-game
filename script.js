const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 50,
    y: canvas.height / 2 - 15,
    width: 30,
    height: 30,
    speed: 2,
    velocity: 0,
    gravity: 0.1,
    jumpStrength: 4,
};

const pipes = [];

let score = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipeX, openingY) {
    const pipeWidth = 50;
    const pipeHeight = canvas.height - openingY;
    
    // Draw upper pipe
    ctx.fillStyle = '#228B22'; // Forest Green
    ctx.fillRect(pipeX, 0, pipeWidth, openingY);
    
    // Draw lower pipe
    ctx.fillStyle = '#228B22';
    ctx.fillRect(pipeX, openingY + 80, pipeWidth, pipeHeight);
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function draw() {
    if (gameOver) {
        ctx.fillStyle = '#000';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 15);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }

    drawBird();

    if (frames % 100 === 0) {
        const openingY = Math.floor(Math.random() * (canvas.height - 200)) + 100;
        pipes.push({ x: canvas.width, openingY });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= bird.speed;

        if (pipes[i].x < -50) {
            pipes.splice(i, 1);
            score++;
        }

        drawPipe(pipes[i].x, pipes[i].openingY);

        if (
            bird.x < pipes[i].x + 50 &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].openingY || bird.y + bird.height > pipes[i].openingY + 80)
        ) {
            gameOver = true;
        }
    }

    drawScore();
    frames++;

    requestAnimationFrame(draw);
}

function jump() {
    if (!gameOver) {
        bird.velocity = -bird.jumpStrength;
    } else {
        resetGame();
    }
}

function resetGame() {
    bird.y = canvas.height / 2 - 15;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frames = 0;
    gameOver = false;
    requestAnimationFrame(draw);
}

document.addEventListener('keydown', jump);

let frames = 0;
draw();
