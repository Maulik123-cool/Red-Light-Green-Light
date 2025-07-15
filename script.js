const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startButton");
const statusText = document.getElementById("status");

let player = {
  x: 180,
  y: 550,
  width: 40,
  height: 40,
  color: "lime",
  speed: 2
};

let keys = {};
let greenLight = true;
let gameRunning = false;
let gameOver = false;
let gameWon = false;
let intervalId;

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

startBtn.addEventListener("click", startGame);

function startGame() {
  // Reset everything
  player.y = 550;
  greenLight = true;
  gameOver = false;
  gameWon = false;
  gameRunning = true;
  statusText.textContent = "Green Light! 🟢";
  keys = {};

  // Light change timer
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    greenLight = !greenLight;
    statusText.textContent = greenLight ? "Green Light! 🟢" : "Red Light! 🔴";
  }, 2000 + Math.random() * 2000);

  gameLoop();
}

function update() {
  if (!gameRunning || gameOver || gameWon) return;

  // Moving up
  if ((keys["ArrowUp"] || keys["w"])) {
    if (greenLight) {
      player.y -= player.speed;
    } else {
      gameOver = true;
      gameRunning = false;
      clearInterval(intervalId);
      statusText.textContent = "💀 You moved during Red Light! GAME OVER";
    }
  }

  // Win check
  if (player.y <= 20) {
    gameWon = true;
    gameRunning = false;
    clearInterval(intervalId);
    statusText.textContent = "🏁 You reached the finish! YOU WIN!";
  }
}

function drawDoll() {
  ctx.fillStyle = greenLight ? "green" : "red";
  ctx.beginPath();
  ctx.arc(200, 60, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("👧", 185, 70);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawFinishLine() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 10, canvas.width, 5);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFinishLine();
  drawDoll();
  drawPlayer();
}

function gameLoop() {
  update();
  draw();
  if (!gameOver && !gameWon) {
    requestAnimationFrame(gameLoop);
  }
}
