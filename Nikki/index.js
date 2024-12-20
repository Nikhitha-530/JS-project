const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const diffBtn = document.getElementById('difficulty');

let score = 0;
let lives = 3; // Added lives counter
let gameOver = false; // Added flag to indicate game over
const brickRowCount = 9;
const brickColumnCount = 5;

// Create ball props
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 13,
    speed: 0,
    dx: 0,
    dy: 0
};

// Create paddle props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 100,
    h: 9,
    speed: 8,
    dx: 0
};

// Create brick props
const brickInfo = {
    w: 65,
    h: 18,
    padding: 9,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo };
    }
}

// Draw ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
     ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#6B5B95';
    ctx.fill();
    ctx.closePath();
}

// Draw score on canvas
function drawScore() {
    ctx.font = '20px Verdana';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw lives on canvas
function drawLives() {
    ctx.font = '20px Verdana';
    ctx.fillText(`Lives: ${lives}`, 30, 30);
}

// Draw bricks on canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#6B5B95' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

// Move paddle on canvas
function movePaddle() {
    paddle.x += paddle.dx;

    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

// Move ball on canvas
function moveBall() {
    if (gameOver) return; // Stop ball movement if game is over

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    // Wall collision (top)
    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }

    // Brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x &&
                    ball.x + ball.size < brick.x + brick.w &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.h
                ) {
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });

    // Hit bottom wall - Lose a life
    if (ball.y + ball.size > canvas.height) {
        lives--;
        if (lives === 0) {
            endGame();
            return; // Stop further execution after game ends
        }
        resetBallAndPaddle();
    }
}

// Reset ball and paddle position after losing a life
function resetBallAndPaddle() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4 * (Math.random() < 0.5 ? 1 : -1);
    ball.dy = -4;
    paddle.x = canvas.width / 2 - 40;
}

// Increase score
function increaseScore() {
    score++;

    if (score % (brickRowCount * brickColumnCount) === 0) {
        showAllBricks();
        document.querySelector('.win').style.display = 'block';
    }
}

// Make all bricks appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = true;
        });
    });
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawLives(); // Draw lives
    drawBricks();
}

// End game function
function endGame() {
    gameOver = true;
    document.querySelector('.lose').style.display = 'block';
}

// Update canvas drawing and animation
function update() {
    if (!gameOver) {
        movePaddle();
        moveBall();
        draw();
        requestAnimationFrame(update);
    }
}

// Start the game
function startGame() {
    const startBtn = document.getElementById('start');
    startBtn.style.display = 'none';
    diffBtn.style.display = 'block';
}

// Hide difficulty selection
function hideDiff() {
    diffBtn.style.display = 'none';
}

// Easy mode
function easyMode() {
    ball.speed = 3.5;
    ball.dx = 4;
    ball.dy = -4;
    hideDiff();
}

// Medium mode
function mediumMode() {
    ball.speed = 4.8;
    ball.dx = 5.2;
    ball.dy = -5.2;
    hideDiff();
}

// Hard mode
function hardMode() {
    ball.speed = 5.6;
    ball.dx = 5.9;
    ball.dy = -5.9;
    hideDiff();
}

// Keydown event
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

// Keyup event
function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
}

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

update();
