import fs from "fs";
import readline from "readline";

const fileStream = fs.createReadStream("src/inputs/day2.txt");

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

type Colors = {
  red: number;
  green: number;
  blue: number;
};

type Game = {
  id: number;
  reveals: Colors[];
};

const maximum: Colors = {
  red: 12,
  green: 13,
  blue: 14,
};

let answer1: number = 0;
let answer2: number = 0;

rl.on("line", (line) => {
  const game: Game = parseLine(line);

  part1(game);
  part2(game.reveals);
});

rl.on("close", () => {
  console.log("Answer 1: " + answer1);
  console.log("Answer 2: " + answer2);
});

function parseLine(line): Game {
  const id: number = parseInt(line.split(":")[0].split(" ")[1]);
  const revealsStrings: string[] = line.split(":")[1].trim().split("; ");
  const reveals: Colors[] = [];

  for (const str of revealsStrings) {
    const revealedColorsString: string[] = str.split(", ");
    const revealedColors: Colors = {
      red: 0,
      green: 0,
      blue: 0,
    };
    for (const revealedColor of revealedColorsString) {
      const color: string = revealedColor.split(" ")[1];
      const num: number = parseInt(revealedColor.split(" ")[0]);
      revealedColors[color] = num;
    }
    reveals.push(revealedColors);
  }

  return { id, reveals };
}

function isPossible(revealed: Colors, maximum: Colors): boolean {
  return (
    revealed.red <= maximum.red &&
    revealed.green <= maximum.green &&
    revealed.blue <= maximum.blue
  );
}

function part1(game: Game) {
  let gameIsPossible: boolean = true;
  for (const reveal of game.reveals) {
    if (!isPossible(reveal, maximum)) {
      gameIsPossible = false;
      break;
    }
  }

  if (gameIsPossible) answer1 += game.id;
}

function part2(reveals: Colors[]) {
  const minimums: Colors = {
    red: 0,
    green: 0,
    blue: 0,
  };

  for (const reveal of reveals) {
    if (reveal.red > minimums.red) minimums.red = reveal.red;
    if (reveal.green > minimums.green) minimums.green = reveal.green;
    if (reveal.blue > minimums.blue) minimums.blue = reveal.blue;
  }

  const power: number = minimums.red * minimums.green * minimums.blue;
  answer2 += power;
}
