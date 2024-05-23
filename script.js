const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');

let dinoImg = new Image();
dinoImg.src = 'png-transparent-dinosaur-drawing-color-dinosaur-child-color-infant.png';

let cactusImg = new Image();
cactusImg.src = 'pngtree-cartoon-cactus-png-image_6095736.jpg';

let imagesLoaded = 0;
let totalImages = 2;

dinoImg.onload = () => { imagesLoaded++; checkImagesLoaded(); };
cactusImg.onload = () => { imagesLoaded++; checkImagesLoaded(); };

function checkImagesLoaded() {
    if (imagesLoaded === totalImages) {
        startBtn.disabled = false;
    }
}

let dino = {
    x: 50,
    y: 150,
    width: 40,  // Lebih besar dari sebelumnya
    height: 40, // Lebih besar dari sebelumnya
    dx: 2,      // Kecepatan gerakan horizontal
    dy: 0,
    gravity: 0.6,
    jump: -15,  // Lompatan lebih tinggi
    grounded: true
};

let obstacles = [];
let frameCount = 0;
let gameOver = false;

startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', jump);

function startGame() {
    gameOver = false;
    obstacles = [];
    frameCount = 0;
    dino.x = 50;
    dino.y = canvas.height - dino.height;
    dino.dy = 0;
    dino.grounded = true;
    loop();
}

function loop() {
    if (gameOver) return;
    update();
    draw();
    requestAnimationFrame(loop);
}

function update() {
    frameCount++;
    dino.dy += dino.gravity;
    dino.y += dino.dy;

    if (dino.y + dino.height > canvas.height) {
        dino.y = canvas.height - dino.height;
        dino.dy = 0;
        dino.grounded = true;
    }

    dino.x += dino.dx;

    if (dino.x > canvas.width) {
        dino.x = -dino.width; // Jika keluar dari kanan kanvas, kembali dari kiri
    }

    if (frameCount % 150 === 0) {
        let obstacle = {
            x: canvas.width,
            y: canvas.height - 40,
            width: 40,
            height: 40
        };
        obstacles.push(obstacle);
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= 2; // Menggerakkan kaktus ke kiri

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1); // Menghapus kaktus jika keluar dari layar
        }

        if (detectCollision(dino, obstacle)) {
            gameOver = true;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    obstacles.forEach(obstacle => {
        ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Kamu Noob', canvas.width / 2 - 100, canvas.height / 2);
    }
}

function jump(e) {
    if (e.code === 'Space' && dino.grounded) {
        dino.dy = dino.jump;
        dino.grounded = false;
    }
}

function detectCollision(dino, obstacle) {
    return dino.x < obstacle.x + obstacle.width &&
           dino.x + dino.width > obstacle.x &&
           dino.y < obstacle.y + obstacle.height &&
           dino.y + dino.height > obstacle.y;
}
