const gridContainer = document.querySelector(".grid-container");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

const gridSize = 4; // 4x4 grid
let grid = [];
let score = 0;

function createGrid() {
  grid = [];
  gridContainer.innerHTML = "";
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = 0;
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      gridContainer.appendChild(cell);
    }
  }
  addNewTile();
  addNewTile();
  updateGrid();
}

function updateGrid() {
  const cells = document.querySelectorAll(".grid-cell");
  cells.forEach((cell) => {
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const value = grid[row][col];
    cell.textContent = value > 0 ? value : "";
    cell.dataset.value = value;
  });
  scoreElement.textContent = score;
}

function addNewTile() {
  const emptyCells = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function slideRow(row) {
  const filteredRow = row.filter((num) => num > 0);
  const emptyCells = Array(gridSize - filteredRow.length).fill(0);
  return filteredRow.concat(emptyCells);
}

function combineRow(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] > 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  return row;
}

function moveLeft() {
  for (let i = 0; i < gridSize; i++) {
    let row = grid[i];
    row = slideRow(row);
    row = combineRow(row);
    row = slideRow(row);
    grid[i] = row;
  }
  addNewTile();
  updateGrid();
}

function moveRight() {
  for (let i = 0; i < gridSize; i++) {
    let row = grid[i].slice().reverse();
    row = slideRow(row);
    row = combineRow(row);
    row = slideRow(row);
    grid[i] = row.reverse();
  }
  addNewTile();
  updateGrid();
}

function moveUp() {
  for (let col = 0; col < gridSize; col++) {
    let column = grid.map((row) => row[col]);
    column = slideRow(column);
    column = combineRow(column);
    column = slideRow(column);
    for (let row = 0; row < gridSize; row++) {
      grid[row][col] = column[row];
    }
  }
  addNewTile();
  updateGrid();
}

function moveDown() {
  for (let col = 0; col < gridSize; col++) {
    let column = grid.map((row) => row[col]).reverse();
    column = slideRow(column);
    column = combineRow(column);
    column = slideRow(column);
    column = column.reverse();
    for (let row = 0; row < gridSize; row++) {
      grid[row][col] = column[row];
    }
  }
  addNewTile();
  updateGrid();
}

function handleKeyDown(event) {
  switch (event.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
  }
}

restartButton.addEventListener("click", createGrid);
document.addEventListener("keydown", handleKeyDown);

// Initialize the game
createGrid();
