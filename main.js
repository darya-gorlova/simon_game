let computerSequence = [];
let humanSequence = [];
let level = 1; // up to 20

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
    console.log("random tile created: " + tile);
    computerSequence.push(tile);
    console.log(computerSequence);
  }

  saveHumanMove(tile) {
    humanSequence.push(tile);
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
      }, 2000);
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

async function startGame() {
  _button.style.display = "none";
  ui.deactivateTiles();
  await computerPlays();
  ui.activateTiles();
}

function resetGame(text) {
  computerSequence = [];
  humanSequence = [];
  level = 1;
  updateMessage(text);
  ui.deactivateTiles();
  _button.style.display = "block";
}

async function moveToNextLevel() {
  level += 1;
  //updateMessage("Congratulations! You passed to the next level: " + level);
  humanSequence = [];
  console.log("moved to next level: " + level);
  startGame();
  
}

async function computerPlays() {
  updateMessage("Computer plays...");
  model.saveComputerMove();
  for (let i = 0; i < level; i++) {
    let pressed = await ui.pressTile(computerSequence[i]);
    console.log("computer: " + pressed);
  }
  updateMessage("Your Turn...");
}

async function humanPlays(tile) {
  console.log("human pressed: " + tile);
  model.saveHumanMove(tile);
  let pressed = await ui.pressTile(tile);
  console.log("human: " + pressed);
  evaluateMove();
}

function evaluateMove() {
  for (let i = 0; i < level; i++) {
    if (computerSequence[i] !== humanSequence[i]) {
      resetGame("You pressed wrong tile, game is over");
      return;
    }
  }
  moveToNextLevel();
}

function updateMessage(message) {
  _message.textContent = message;
}

_button.addEventListener("click", startGame);

_tile_container.addEventListener("click", (event) => {
  const { tile } = event.target.dataset;
  if (tile) humanPlays(tile);
});
