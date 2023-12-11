type Coordinates = {
  y: number;
  x: number;
};

type Galaxy = {
  id: number;
  coords: Coordinates;
};

type Pair = {
  galaxies: Galaxy[];
  path: Coordinates[];
};

function processInput(input: string[]): string[][] {
  let map: string[][] = [];

  input.forEach((line) => {
    const row: string[] = line.split("");
    if (row.includes("#")) {
      map.push([...row]);
    } else {
      map.push([...row]);
      map.push([...row]);
    }
  });

  for (let x = 0; x < map[0].length; x++) {
    let column: string[] = [];
    for (let y = 0; y < map.length; y++) {
      column.push(map[y][x]);
    }
    if (!column.includes("#")) {
      map.forEach((row, index, map) => {
        map[index] = [...row.slice(0, x), ".", ...row.slice(x)];
      });
      x++;
    }
  }

  return map;
}

function mapGalaxies(map: string[][]): Galaxy[] {
  const galaxies: Galaxy[] = [];
  let id: number = 1;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "#") {
        galaxies.push({ id, coords: { y: i, x: j } });
        id++;
      }
    }
  }

  return galaxies;
}

/*function makePairs(galaxies: Galaxy[]): Pair[] {
  const pairs: Pair[] = [];

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = 0; j < galaxies.length; j++) {
      console.log(i, j);
      if (j === i) continue;
      if (
        pairs.find(
          (pair) =>
            pair.galaxies.includes(galaxies[i]) &&
            pair.galaxies.includes(galaxies[j])
        ) === undefined
      ) {
        pairs.push({ galaxies: [galaxies[i], galaxies[j]], path: [] });
      }
    }
  }

  return pairs;
}*/

function getPairsMerge(
  galaxies: Galaxy[],
  pairs: Pair[],
  left: number,
  right: number,
  mid: number
) {
  const buffer: Pair[] = new Array(left + right + 1).fill(null);
  let i = left,
    k = left,
    j = mid + 1;

  while (i <= mid && j <= right) {}
}

function makePairs(
  galaxies: Galaxy[],
  pairs: Pair[],
  left: number,
  right: number
): void {
  if (left < right) {
    let mid: number = Math.floor((left + right) / 2);
    makePairs(galaxies, pairs, left, mid);
    makePairs(galaxies, pairs, mid + 1, right);
    getPairsMerge(galaxies, pairs, left, right, mid);
  }
}

function determineDistances(pairs: Pair[]): void {
  pairs.forEach((pair) => {
    const start: Galaxy = pair.galaxies[0];
    const goal: Galaxy = pair.galaxies[1];
    const current: Coordinates = Object.assign({}, start.coords);

    while (current.y != goal.coords.y || current.x != goal.coords.x) {
      if (current.y != goal.coords.y) {
        current.y < goal.coords.y ? current.y++ : current.y--;
      } else {
        current.x < goal.coords.x ? current.x++ : current.x--;
      }

      pair.path.push({ y: current.y, x: current.x });
    }
  });
}

function main(input: string[]) {
  let answer1: number = 0;
  let answer2: number = 0;

  const map: string[][] = processInput(input);
  const galaxies: Galaxy[] = mapGalaxies(map);

  // Part 1
  //const pairs: Pair[] = makePairs(galaxies);
  //determineDistances(pairs);

  //pairs.forEach((pair) => (answer1 += pair.path.length));

  // Part 2

  // Finish

  return { part1: answer1, part2: answer2 };
}

export default main;

function printMap(map: string[][]): void {
  map.forEach((row) => {
    let line: string = "";
    row.forEach((char) => (line += char));
    console.log(line);
  });
}
