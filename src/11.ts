type Coordinates = {
  y: number;
  x: number;
};

function processInput(input: string[], empty: Coordinates[]): string[][] {
  let map: string[][] = [];

  input.forEach((line, y) => {
    const row: string[] = line.split("");
    map.push(row);

    // Check if row is empty
    if (!row.includes("#")) {
      empty.push({ y, x: null });
    }
  });

  // Check if column is empty
  for (let x = 0; x < map[0].length; x++) {
    let column: string[] = [];
    for (let y = 0; y < map.length; y++) {
      column.push(map[y][x]);
    }
    if (!column.includes("#")) {
      empty.push({ y: null, x });
    }
  }

  return map;
}

function mapGalaxies(map: string[][]): Coordinates[] {
  const galaxies: Coordinates[] = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "#") {
        galaxies.push({ y: i, x: j });
      }
    }
  }
  return galaxies;
}

function getPairs(galaxies: Coordinates[]): Coordinates[][] {
  const pairs: Coordinates[][] = [];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = 0; j < i; j++) {
      pairs.push([galaxies[i], galaxies[j]]);
    }
  }
  return pairs;
}

function isBetween(
  first: Coordinates,
  second: Coordinates,
  expansion: Coordinates
) {
  return expansion.x === null
    ? (first.y < expansion.y && expansion.y < second.y) ||
        (second.y < expansion.y && expansion.y < first.y)
    : (first.x < expansion.x && expansion.x < second.x) ||
        (second.x < expansion.x && expansion.x < first.x);
}

function solve(
  pairs: Coordinates[][],
  empty: Coordinates[],
  expansionRate: number
): number {
  let result: number = 0;

  console.log(pairs.length);

  pairs.forEach((pair) => {
    const expansions: number = empty.filter((expansion) =>
      isBetween(pair[0], pair[1], expansion)
    ).length;

    result +=
      Math.abs(pair[0].y - pair[1].y) +
      Math.abs(pair[0].x - pair[1].x) -
      expansions +
      expansions * expansionRate;
  });

  return result;
}

function main(input: string[]) {
  let answer1: number = 0;
  let answer2: number = 0;

  const empty: Coordinates[] = [];
  const map: string[][] = processInput(input, empty);
  const galaxies: Coordinates[] = mapGalaxies(map);

  const pairs: Coordinates[][] = getPairs(galaxies);

  // Part 1
  answer1 = solve(pairs, empty, 2);

  // Part 2
  answer2 = solve(pairs, empty, 1000000);

  // Finish
  return { part1: answer1, part2: answer2 };
}

export default main;
