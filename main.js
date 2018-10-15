const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const STEP = 25;
const SIZE = STEP * STEP;
const ROW = [...Array(25).keys()].map(n => n * STEP);
const GRID = Array(25).fill(ROW);
const BOARD = GRID.map((r, i) => r.map(c => Tile(i * STEP, c)));
const OPTIONS = {
  road: "grey",
  housing: "lightgreen",
  commercial: "blue",
  mixed: "pink",
  industry: "yellow"
};
const OVERFLOW = canvas.height - SIZE;

const Tile = (x, y) => ({ x, y, content: undefined });

ctx.fillStyle = "black";
ctx.fillRect(0, SIZE, SIZE, OVERFLOW);
const forceInRange = n => Math.max(0, Math.min(SIZE - 1, n));
const inRect = ([clickx, clicky], [x, y, w, h]) => {
  return clickx > x && clickx < x + w && clicky > y && clicky < y + h;
};
const colorCell = (x, y, color = "green") => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, STEP, STEP);
  ctx.strokeRect(x, y, STEP, STEP);
};
BOARD.forEach(r => r.forEach(({ x, y }) => colorCell(x, y, "green")));

const optionBlock = Object.entries(OPTIONS).map(([{}, color], i) => {
  ctx.fillStyle = color;
  const center = -((Object.keys(OPTIONS).length / 2) * STEP) + i * STEP;
  const pos = SIZE / 2 + center;
  ctx.fillRect(pos, SIZE + OVERFLOW / 2, STEP, STEP);
  return {
    x: pos,
    y: SIZE + OVERFLOW / 2
  };
});

let userfill = "blue";
canvas.addEventListener(
  "click",
  function(e) {
    if (e.offsetY > SIZE) {
      if (
        inRect(
          [e.offsetX, e.offsetY],
          [
            optionBlock[0].x,
            optionBlock[0].y,
            Object.keys(OPTIONS).length * STEP,
            STEP
          ]
        )
      ) {
        const [, color] = Object.entries(OPTIONS)[
          Math.floor(e.offsetX / STEP - optionBlock[0].x / STEP)
        ];
        userfill = color;
      }
    } else {
      const y = forceInRange(e.offsetY);
      const x = forceInRange(e.offsetX);
      const row = BOARD[Math.floor(x / STEP)];
      const cell = row.find(c => c.y === Math.floor(y / STEP) * STEP);
      colorCell(cell.x, cell.y, userfill);
    }
  },
  false
);
