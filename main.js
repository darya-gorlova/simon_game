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
    //console.log(random);
    return random;
  }

  saveComputerMove() {
    const tile = this.getRandomTile();
    computerSequence.push(tile);
    console.log(computerSequence);
    // console.log(level);
  }

  saveHumanMove(tile) {
    humanSequence.push(tile);
  }

  increaseLevel() {
    level += 1;
  }
}

class UI {
  pressTile(color) {
    const tile = document.querySelector(`[data-tile='${color}']`);
    const sound = document.querySelector(`[data-sound='${color}']`);
    tile.classList.add("activated");
    sound.play();
    tile.innerHTML = `<span>${color}</span>`;
    setTimeout(() => {
      tile.classList.remove("activated");
    }, 600);
  }
  activateTiles() {
    _tiles.forEach((tile) => {
      tile.style.pointerEvents = "auto";
      //console.log(tiles);
    });
  }
  deactivateTiles() {
    _tiles.forEach((tile) => {
      tile.style.pointerEvents = "none";
      //console.log(tiles);
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
function computerPlays() {
  updateMessage("Computer plays");
  for (let i = 0; i < level; i++) {
    model.saveComputerMove();
    ui.pressTile(computerSequence[i]);
  }
  model.increaseLevel();
  //ui.activateTiles();
   console.log(level);
}

function humanPlays(tile) {
  updateMessage("Your turn");
  /*model.saveHumanMove(tile);
  console.log(humanSequence);
  ui.pressTile(humanSequence[i]);*/
}

function executeRound(sequence){
  
}

function updateMessage(message) {
  _message.textContent = message;
}
/*_button.addEventListener("click", () => {
  startGame().then(function() {
    ui.activateTiles();
  });

});*/
_button.addEventListener("click", startGame);

_tile_container.addEventListener("click", (event) => {
  const { tile } = event.target.dataset;
  console.log(tile);
  if (tile) humanPlays(tile);
});
