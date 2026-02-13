const resetButton = document.getElementById("reset-button");
const board = document.getElementById("board");
const inputNumberOfPlayer = document.getElementById("number-of-player");
const inputBoardSize = document.getElementById("board-size");
const submitInputButton = document.getElementById("submit-setting");

let totalNumberOfPlayer = 2;
let boardSize = 3;

/**
 * @type {number[][]}
 * number = playerIndex
 */
let mainBoards = [];

// Assume playerIndex start from 1
let currentPlayerIndex = 1;

/**
 * @type {number | null}
 */
let playerIndexWon = null;

var inputNumberOfPlayerValue = "";
var inputBoardSizeValue = "";

function setupEventListener() {
  resetButton.addEventListener("click", function () {
    console.log("reset click");
    if (playerIndexWon) {
      reset();
    } else {
      console.error(
        "THIS SHOULD NEVER APPEAR! BUG! RESET BUTTON CLICKED WITHOUT WINNER",
      );
    }
  });
  inputNumberOfPlayer.addEventListener("change", (e) => {
    const value = e.target.value;
    inputNumberOfPlayerValue = value;
  });
  inputBoardSize.addEventListener("change", (e) => {
    const value = e.target.value;
    inputBoardSizeValue = value;
  });
  submitInputButton.addEventListener("click", function () {
    const parsedNumberOfPlayer = parseInt(inputNumberOfPlayerValue, 10);
    const parsedBoardSize = parseInt(inputBoardSizeValue, 10);
    if (
      isNaN(parsedNumberOfPlayer) ||
      parsedNumberOfPlayer < 2 ||
      parsedNumberOfPlayer > 10
    ) {
      alert("Number of player must be between 2 and 10");
      return;
    }
    if (
      isNaN(parsedBoardSize) ||
      parsedBoardSize < 3 ||
      parsedBoardSize > 10
    ) {
      alert("Board size must be between 3 and 10");
      return;
    }
    totalNumberOfPlayer = parsedNumberOfPlayer;
    boardSize = parsedBoardSize;
    reset();
  });
}

function init() {
  playerIndexWon = null;
  currentPlayerIndex = 1;
  mainBoards = new Array(boardSize)
    .fill(null)
    .map(() => new Array(boardSize).fill(null));
}

function getPlayerIcon(playerIndex) {
  if (!playerIndex) return "-";
  // FIXME: this assume that the playerIndex is less than 10, otherwise it will return empty string
  return ["X", "O", "A", "B", "C", "D", "E", "F", "H", "Y"][playerIndex - 1];
}

function render() {
  // Clear board
  board.innerHTML = "";
  // Reset the board with updated playerIndex in board
  for (let i = 0; i < boardSize; i++) {
    const wrapper = document.createElement("div");
    for (let j = 0; j < boardSize; j++) {
      const button = document.createElement("button");
      button.innerHTML = getPlayerIcon(mainBoards[i][j]);
      button.addEventListener("click", () =>
        onButtonClick(getCurrentPlayer(), i, j),
      );
      wrapper.appendChild(button);
    }
    board.appendChild(wrapper);
  }
  // Show reset button
  resetButton.style.visibility = playerIndexWon ? "visible" : "hidden";
}

function getCurrentPlayer() {
  return currentPlayerIndex;
}

function onButtonClick(playerIndex, x, y) {
  console.log("onButtonClick", playerIndex, x, y);
  const isMoveValid = playerMove(playerIndex, x, y);
  if (!isMoveValid) {
    return;
  }
  render();
  const winner = getWinner(mainBoards);
  if (winner) {
    end(winner);
  } else {
    currentPlayerIndex = getNextPlayer();
  }
}

function playerMove(playerIndex, x, y) {
  if (mainBoards[x][y]) {
    return false;
  }
  mainBoards[x][y] = playerIndex;
  return true;
}

function getWinner(targetBoards) {
  console.log("getWinner");

  // Case 1.A Check diagonals left to right
  let isDiagonalWinA = true;
  const firstASpot = targetBoards[0][0];
  if (!firstASpot) {
    isDiagonalWinA = false;
  } else {
    for (let i = 1; i < boardSize; i++) {
      if (targetBoards[i][i] !== firstASpot) {
        isDiagonalWinA = false;
        break;
      }
    }
  }
  if (isDiagonalWinA) {
    return firstASpot;
  }

  // Case 1.B Check diagonals right to left
  let isDiagonalWinB = true;
  const firstBSpot = targetBoards[0][boardSize - 2];
  if (!firstBSpot) {
    isDiagonalWinA = false;
  } else {
    for (let i = 1; i < boardSize; i++) {
      const rolIndex = i;
      const colIndex = boardSize - i - 1;
      if (targetBoards[rolIndex][colIndex] !== firstBSpot) {
        isDiagonalWinB = false;
        break;
      }
    }
  }
  if (isDiagonalWinB) {
    return firstBSpot;
  }

  // Case 2.
  function checkRowIsAllSame(rowIndex) {
    return (
      !!targetBoards[rowIndex][0] &&
      targetBoards[rowIndex].every((s) => s === targetBoards[rowIndex][0])
    );
  }
  function checkColIsAllSame(colIndex) {
    if (!targetBoards[0][colIndex]) {
      return false;
    }
    for (let i = 1; i < boardSize; i++) {
      if (targetBoards[i][colIndex] !== targetBoards[0][colIndex]) {
        return false;
      }
    }
    return true;
  }

  // Check each col or row
  for (let i = 0; i < boardSize; i++) {
    if (checkColIsAllSame(i)) {
      return targetBoards[0][i];
    }
    if (checkRowIsAllSame(i)) {
      return targetBoards[i][0];
    }
  }

  // No one wins yet
  return undefined;
}

function getNextPlayer() {
  let nextPlayerIndex = currentPlayerIndex + 1;
  if (nextPlayerIndex > totalNumberOfPlayer) {
    return 1;
  }
  return nextPlayerIndex;
}

function end(winnerPlayer) {
  playerIndexWon = winnerPlayer;
  alert(`Player ${playerIndexWon} won`);
  render();
}

function reset() {
  if (confirm("Do you want to reset?")) {
    init();
    render();
  }
}

setupEventListener();
init();
render();
