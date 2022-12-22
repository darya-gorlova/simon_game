let computerSequence = [];
let humanSequence = [];
let level = 1;

const _button = document.querySelector(".button");
const _message = document.querySelector(".message");
const _tile_container = document.querySelector(".tile-container");
const _tiles = [..._tile_container.children];

class Model {
  getRandomTile() {
    const tiles = ["red", "green", "blue", "yellow"];
    const random = tiles[Math.floor(Math.random() * tiles.length)];
    return random;
  }

  saveComputerMove() {
    const tile = this.getRandomTile();
    computerSequence.push(tile);
    console.log("computer");
    console.log(computerSequence);
  }

  //return index at which tile is saved
  saveHumanMove(tile) {
    const length = humanSequence.push(tile);
    console.log("human");
    console.log(humanSequence);
    return length - 1;
  }
}

class UI {
  async pressTile(color) {
    const tile = document.querySelector(`[data-tile='${color}']`);
    const sound = document.querySelector(`[data-sound='${color}']`);
    tile.classList.add("activated");
    sound.play();
    return new Promise((resolve) => {
      setTimeout(() => {
        tile.classList.remove("activated");
        resolve(color + " tile bound successfully");
      }, 200);
    });
  }
  activateTiles() {
    _tiles.forEach((tile) => {
      tile.style.pointerEvents = "auto";
    });
  }
  deactivateTiles() {
    _tiles.forEach((tile) => {
      tile.style.pointerEvents = "none";
    });
  }
}

const model = new Model();
const ui = new UI();

function startGame() {
  _button.style.display = "none";
  ui.deactivateTiles();
  computerPlays();
}

function resetGame(text) {
  computerSequence = [];
  humanSequence = [];
  level = 1;
  updateMessage(text);
  _button.style.display = "block";
}

async function computerPlays() {
  await updateMessage("Computer plays...");
  model.saveComputerMove();
  for (let i = 0; i < level; i++) {
    await ui.pressTile(computerSequence[i]);
    await delay(700);
  }
  updateMessage("Your Turn...");
  ui.activateTiles();
}

function humanPlays(tile) {
  const atIndex = model.saveHumanMove(tile);
  ui.pressTile(tile);
  evaluateMove(atIndex);
}
function evaluateMove(index) {
  if (computerSequence[index] !== humanSequence[index]) {
    resetGame("You pressed wrong tile, game is over");
    ui.deactivateTiles();
    return;
  }
  if (computerSequence.length === humanSequence.length) {
    moveToNextLevel("Congratulations! You passed to the next level: ");
    ui.deactivateTiles();
    return;
  }
}
async function moveToNextLevel(text) {
  level += 1;
  await updateMessage(text + level);
  humanSequence = [];
  setTimeout(() => {
    startGame();
  }, 2000);
}

async function updateMessage(message) {
  _message.textContent = message;
  await delay(1000);
}
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

_button.addEventListener("click", startGame);

_tile_container.addEventListener("click", (event) => {
  const { tile } = event.target.dataset;
  if (tile) humanPlays(tile);
});
