// Отримання посилань на елементи гри
const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.game-start');
const resetButton = document.querySelector('.game-reset');

// Зображення змійки та їжі
const snakeImage = new Image();
snakeImage.src = 'img/part1.png';
const foodImage = new Image();
foodImage.src = 'img/cherry.png';

// Розмір та розташування елементів гри
const canvasSize = 400;
const gridSize = 20;
const snakeSize = 20;
const foodSize = 20;
const gameSpeed = 100; // затримка в мілісекундах

// Ініціалізація гри
let snake = [{ x: 200, y: 200 }]; // початкові координати змійки
let food = {}; // початкові координати їжі
let direction = 'right'; // початковий напрямок руху
let score = 0;
let gameIsRunning = false;
let gameLoop;

// Функція початку гри
function startGame() {
  snake = [{ x: 200, y: 200 }];
  direction = 'right';
  score = 0;
  gameIsRunning = true;
  scoreElement.textContent = `Очки: ${score}`;
  createFood();
  gameLoop = setInterval(updateGame, gameSpeed);
}

// Функція оновлення гри
function updateGame() {
  clearCanvas();
  moveSnake();
  drawSnake();
  drawFood();
  checkCollision();
}

// Функція очищення полотна
function clearCanvas() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
}

// Функція переміщення змійки
function moveSnake() {
  const head = { x: snake[0].x, y: snake[0].y };

  if (direction === 'right') head.x += gridSize;
  if (direction === 'left') head.x -= gridSize;
  if (direction === 'up') head.y -= gridSize;
  if (direction === 'down') head.y += gridSize;

  snake.unshift(head);

  if (!hasEatenFood()) {
    snake.pop();
  }
}

// Функція перевірки з'їдання їжі
function hasEatenFood() {
  if (snake[0].x === food.x && snake[0].y === food.y) {
    score++;
    scoreElement.textContent = `Очки: ${score}`;
    createFood();
    return true;
  }
  return false;
}

// Функція створення нової їжі
function createFood() {
  food = {
    x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
  };

  // Перевірка, щоб їжа не з'являлася на змійці
  for (const segment of snake) {
    if (segment.x === food.x && segment.y === food.y) {
      createFood();
      break;
    }
  }
}

// Функція перевірки зіткнення змійки зі стінками або самою собою
function checkCollision() {
  const head = snake[0];

  // Перевірка зіткнення зі стінками
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvasSize ||
    head.y >= canvasSize
  ) {
    endGame();
  }

  // Перевірка зіткнення з самою собою
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
      break;
    }
  }
}

// Функція закінчення гри
function endGame() {
  gameIsRunning = false;
  clearInterval(gameLoop);
  ctx.font = '20px Arial';
  ctx.fillText('Кінець гри', canvasSize / 2 - 50, canvasSize / 2);
}

// Функція малювання змійки
function drawSnake() {
  for (const segment of snake) {
    ctx.drawImage(snakeImage, segment.x, segment.y, snakeSize, snakeSize);
  }
}

// Функція малювання їжі
function drawFood() {
  ctx.drawImage(foodImage, food.x, food.y, foodSize, foodSize);
}

// Функція обробки натискання клавіш
function handleKeyPress(event) {
  if (!gameIsRunning) return;

  const key = event.key;

  if (key === 'ArrowUp' && direction !== 'down') {
    direction = 'up';
  } else if (key === 'ArrowDown' && direction !== 'up') {
    direction = 'down';
  } else if (key === 'ArrowLeft' && direction !== 'right') {
    direction = 'left';
  } else if (key === 'ArrowRight' && direction !== 'left') {
    direction = 'right';
  }
}

// Функція перезапуску гри
function resetGame() {
  clearInterval(gameLoop);
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  gameIsRunning = false;
  scoreElement.textContent = 'Очки: 0';
}

// Додавання обробників подій
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
document.addEventListener('keydown', handleKeyPress);
