const smallFieldAttributes = { width: 10, height: 10, bombs: 10, free: 90 };
const midFieldAttributes = { width: 16, height: 16, bombs: 40, free: 216 };
const bigFieldAttributes = { width: 30, height: 16, bombs: 99, free: 381 };
let fieldArray = [];
let FieldAttributes = [];
let bombCounter;
let timerStarted = false;
let startTime = 0;
let timerInterval = null;
let currentDifficulty;
let bombGenerated = false;
const color = [
  "blue",
  "green",
  "red",
  "blue",
  "red",
  "cyan",
  "magenta",
  "grey",
];

export function generateField(e) {
  let checkField;
  if (typeof e !== "string") {
    checkField = e.target.id;
  } else {
    checkField = e;
  }
  currentDifficulty = checkField;
  resetGame();
  switch (checkField) {
    case "fieldSmall":
      FieldAttributes = smallFieldAttributes;
      break;
    case "fieldMid":
      FieldAttributes = midFieldAttributes;
      break;
    case "fieldBig":
      FieldAttributes = bigFieldAttributes;
      break;
  }
  bombCounter = FieldAttributes.bombs;
  refreshBombCounter("start");
  let field = document.getElementById("gameField");
  field.innerHTML = "";

  fieldArray = Array.from({ length: FieldAttributes.height }, () =>
    Array(FieldAttributes.height).fill(0)
  );

  for (let i = 0; i < FieldAttributes.height; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < FieldAttributes.width; j++) {
      let col = document.createElement("div");
      col.classList.add("col", "closed");

      let colId = i + "-" + j;
      col.id = colId;

      col.addEventListener("click", (open) => {
        if (
          col.classList.contains("closed") &&
          !col.classList.contains("flag")
        ) {
          openField(colId);
        } else if (col.classList.contains("opened")) {
          quickReveal(colId);
        }
      });

      col.addEventListener("contextmenu", (event) => {
        event.preventDefault();

        if (
          col.classList.contains("closed") &&
          !col.classList.contains("flag")
        ) {
          col.classList.add("flag");
          refreshBombCounter("down");
        } else if (col.classList.contains("flag")) {
          col.classList.remove("flag");
          refreshBombCounter("up");
        }
      });

      row.appendChild(col);
    }
    field.appendChild(row);
  }
}

export function smileyReset() {
  generateField(currentDifficulty);
}

function refreshBombCounter(state) {
  let stringBombCounter;

  if (state === "start") {
    bombCounter = FieldAttributes.bombs;
  } else if (state === "down") {
    bombCounter--;
  } else {
    bombCounter++;
  }

  if (bombCounter < 0) {
    stringBombCounter = Math.abs(bombCounter).toString().padStart(2, "0");

    document.getElementById("bombCounterFirstDigit").src =
      "src/assets/img/d-.svg";
    document.getElementById("bombCounterSecondDigit").src =
      "src/assets/img/d" + stringBombCounter[0] + ".svg";
    document.getElementById("bombCounterThirdDigit").src =
      "src/assets/img/d" + stringBombCounter[1] + ".svg";
  } else {
    stringBombCounter = bombCounter.toString().padStart(3, "0");

    document.getElementById("bombCounterFirstDigit").src =
      "src/assets/img/d" + stringBombCounter[0] + ".svg";
    document.getElementById("bombCounterSecondDigit").src =
      "src/assets/img/d" + stringBombCounter[1] + ".svg";
    document.getElementById("bombCounterThirdDigit").src =
      "src/assets/img/d" + stringBombCounter[2] + ".svg";
  }
}

function quickReveal(colId) {
  let trackedFlags = 0;
  let x = parseInt(colId.split("-")[0]);
  let y = parseInt(colId.split("-")[1]);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const newX = x + dx;
      const newY = y + dy;
      if (
        newX >= 0 &&
        newX < FieldAttributes.height &&
        newY >= 0 &&
        newY < FieldAttributes.width
      ) {
        const elementId = newX + "-" + newY;
        const element = document.getElementById(elementId);

        if (element && element.classList.contains("flag")) {
          trackedFlags++;
        }
      }
    }
  }

  if (trackedFlags == fieldArray[x][y]) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const newX = x + dx;
        const newY = y + dy;

        if (
          newX >= 0 &&
          newX < FieldAttributes.height &&
          newY >= 0 &&
          newY < FieldAttributes.width
        ) {
          const elementId = newX + "-" + newY;
          const element = document.getElementById(elementId);

          if (
            element &&
            !element.classList.contains("flag") &&
            !element.classList.contains("opened")
          ) {
            if (fieldArray[newX][newY] == "B") {
              gameOver();
            } else {
              element.classList.add("opened");
              element.classList.remove("closed");
              colorNumber(newX, newY);
              checkWin();
              if (fieldArray[newX][newY] !== 0) {
                element.innerText = fieldArray[newX][newY];
              } else {
                checkForNull(elementId);
              }
            }
          }
        }
      }
    }
  }
  checkWin();
}

function openField(colId) {
  if (!timerStarted) {
    startTimer();
  }

  if (!bombGenerated) {
    generateBombs(colId);
    bombGenerated = true;
  }

  let [x, y] = colId.split("-").map(Number);

  let toOpen = document.getElementById(colId);
  if (fieldArray[x][y] !== "B" && fieldArray[x][y] !== 0) {
    toOpen.classList.remove("closed");
    toOpen.classList.add("opened");
    toOpen.innerHTML = fieldArray[x][y];
    colorNumber(x, y);
    checkWin(x, y);
  } else if (fieldArray[x][y] === 0) {
    checkForNull(colId);
  } else {
    gameOver(colId);
  }
}

function colorNumber(x, y) {
  let setColor = document.getElementById(x + "-" + y);
  switch (fieldArray[x][y]) {
    case 1:
      setColor.style.color = color[0];
      break;
    case 2:
      setColor.style.color = color[1];
      break;
    case 3:
      setColor.style.color = color[2];
      break;
    case 4:
      setColor.style.color = color[3];
      break;
    case 5:
      setColor.style.color = color[4];
      break;
    case 6:
      setColor.style.color = color[5];
      break;
    case 7:
      setColor.style.color = color[6];
      break;
    case 8:
      setColor.style.color = color[7];
      break;
  }
}

function checkForNull(colId) {
  let [x, y] = colId.split("-").map(Number);

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let newX = x + i;
      let newY = y + j;

      if (
        newX >= 0 &&
        newX < fieldArray.length &&
        newY >= 0 &&
        newY < fieldArray[0].length
      ) {
        let toOpen = document.getElementById(newX + "-" + newY);

        if (toOpen && toOpen.classList.contains("closed")) {
          toOpen.classList.remove("closed");
          toOpen.classList.add("opened");
          if (fieldArray[newX][newY] !== 0) {
            toOpen.innerHTML = fieldArray[newX][newY];
            colorNumber(newX, newY);
          }

          if (fieldArray[newX][newY] === 0) {
            let newColId = newX + "-" + newY;
            checkForNull(newColId);

            if (document.getElementById(newColId).classList.contains("flag")) {
              document.getElementById(newColId).classList.remove("flag");
              bombCounter++;
              document.getElementById("bombCounter").innerHTML = bombCounter;
            }
          }
        }
      }
    }
  }
}

function gameOver(colId) {
  stopTimer();
  changeSmiley("sad");

  for (let i = 0; i < FieldAttributes.height; i++) {
    for (let j = 0; j < FieldAttributes.width; j++) {
      let reveal = document.getElementById(i + "-" + j);
      if (
        fieldArray[i][j] === "B" &&
        !document.getElementById(i + "-" + j).classList.contains("flag")
      ) {
        reveal.classList.remove("closed");
        reveal.classList.add("opened");
        reveal.classList.add("bomb");
      } else if (
        fieldArray[i][j] === "B" &&
        document.getElementById(i + "-" + j).classList.contains("flag")
      ) {
        reveal.classList.add("flagmine");
      } else if (
        document.getElementById(i + "-" + j).classList.contains("closed")
      ) {
        reveal.style.pointerEvents = "none";
      }
    }
  }
}

function changeSmiley(state) {
  if (state == "sad") {
    document
      .querySelectorAll(".smile")
      .forEach((smiley) => smiley.classList.add("hidden"));
    document.getElementById("smileSad").classList.remove("hidden");
  } else if (state == "won") {
    document
      .querySelectorAll(".smile")
      .forEach((smiley) => smiley.classList.add("hidden"));
    document.getElementById("smileGlasses").classList.remove("hidden");
  }
}

function generateBombs(colId) {
  let numBombs = FieldAttributes.bombs;
  let bombsPlaced = 0;
  let x = parseInt(colId.split("-")[0], 10);
  let y = parseInt(colId.split("-")[1], 10);
  fieldArray[x][y] = 0;

  function isInSafeZone(row, col) {
    return row >= x - 1 && row <= x + 1 && col >= y - 1 && col <= y + 1;
  }

  while (bombsPlaced < numBombs) {
    let row = Math.floor(Math.random() * FieldAttributes.height);
    let col = Math.floor(Math.random() * FieldAttributes.width);

    if (fieldArray[row][col] !== "B" && !isInSafeZone(row, col)) {
      fieldArray[row][col] = "B";
      bombsPlaced++;
    }
  }

  for (let row = 0; row < FieldAttributes.height; row++) {
    for (let col = 0; col < FieldAttributes.width; col++) {
      if (fieldArray[row][col] === "B") continue;

      let bombCount = 0;

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          let newRow = row + dx;
          let newCol = col + dy;
          if (isValid(newRow, newCol) && fieldArray[newRow][newCol] === "B") {
            bombCount++;
          }
        }
      }

      if (!(row === x && col === y)) {
        fieldArray[row][col] = bombCount;
      }
    }
  }
}

function startTimer() {
  if (!timerStarted) {
    timerStarted = true;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  timerStarted = false;
  document.getElementById("timerFirstDigit").src = "src/assets/img/d0.svg";
  document.getElementById("timerSecondDigit").src = "src/assets/img/d0.svg";
  document.getElementById("timerThirdDigit").src = "src/assets/img/d0.svg";
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  const stringElapsedTime = elapsedTime.toString().padStart(3, "0");

  document.getElementById("timerFirstDigit").src =
    "src/assets/img/d" + stringElapsedTime[0] + ".svg";
  document.getElementById("timerSecondDigit").src =
    "src/assets/img/d" + stringElapsedTime[1] + ".svg";
  document.getElementById("timerThirdDigit").src =
    "src/assets/img/d" + stringElapsedTime[2] + ".svg";
}

function isValid(x, y) {
  return (
    x >= 0 && x < FieldAttributes.height && y >= 0 && y < FieldAttributes.width
  );
}

function resetSmile() {
  document.getElementById("smileSad").classList.add("hidden");
  document.getElementById("smileGlasses").classList.add("hidden");
  document.getElementById("smileHappy").classList.remove("hidden");
}

function resetGame() {
  bombGenerated = false;
  resetTimer();
  resetSmile();
}

function checkWin() {
  for (let x = 0; x < fieldArray.length; x++) {
    for (let y = 0; y < fieldArray[x].length; y++) {
      if (fieldArray[x][y] !== "B" && !isRevealed(x, y)) {
        return false;
      }
    }
  }
  changeSmiley("won");
  stopTimer();
  for (let i = 0; i < FieldAttributes.height; i++) {
    for (let j = 0; j < FieldAttributes.width; j++) {
      let revealBombs = document.getElementById(i + "-" + j);
      if (
        fieldArray[i][j] === "B" &&
        !document.getElementById(i + "-" + j).classList.contains("flag")
      ) {
        revealBombs.classList.add("flag");
      }
    }
  }
}   

function isRevealed(x, y) {
  return document.getElementById(x + "-" + y).classList.contains("opened");
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    generateField("fieldSmall");
  }, 0);
});

let currentHoveredDiv = null;

// Event Listener für Mausbewegung über ein Div
document.querySelectorAll(".closed").forEach(div => {
  div.addEventListener("mouseenter", function() {
    currentHoveredDiv = this.id; // Speichert die ID des aktuellen Divs
  });

  div.addEventListener("mouseleave", function() {
    currentHoveredDiv = null; // Setzt zurück, wenn die Maus das Div verlässt
  });
});

// Event Listener für Leertaste
document.addEventListener("keydown", function(event) {
  if (event.code === "Space") {
    if (currentHoveredDiv) {
      console.log(`Leertaste gedrückt über: ${currentHoveredDiv}`);
    } else {
      console.log("Leertaste gedrückt, aber nicht über einem Div");
    }
  }
});