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

function parseLine(line: string): Game {
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

function processInput(input: string[]): Game[] {
  const games = [];

  input.forEach((line: string) => {
    games.push(parseLine(line));
  });

  return games;
}

function isPossible(revealed: Colors, maximum: Colors): boolean {
  return (
    revealed.red <= maximum.red &&
    revealed.green <= maximum.green &&
    revealed.blue <= maximum.blue
  );
}

function part1(games: Game[]): number {
  let result: number = 0;

  games.forEach((game) => {
    let gameIsPossible: boolean = true;
    for (const reveal of game.reveals) {
      if (!isPossible(reveal, maximum)) {
        gameIsPossible = false;
        break;
      }
    }

    if (gameIsPossible) result += game.id;
  });

  return result;
}

function part2(games: Game[]): number {
  let result: number = 0;

  games.forEach((game) => {
    const minimums: Colors = {
      red: 0,
      green: 0,
      blue: 0,
    };

    for (const reveal of game.reveals) {
      if (reveal.red > minimums.red) minimums.red = reveal.red;
      if (reveal.green > minimums.green) minimums.green = reveal.green;
      if (reveal.blue > minimums.blue) minimums.blue = reveal.blue;
    }

    const power: number = minimums.red * minimums.green * minimums.blue;
    result += power;
  });

  return result;
}

function main(input: string[]) {
  const games = processInput(input);

  // Part 1
  const answer1: number = part1(games);

  // Part 2
  const answer2: number = part2(games);

  // Finish
  return { part1: answer1, part2: answer2 };
}

export default main;
