type Coordinates = {
  y: number;
  x: number;
};

type Move = {
  from: "north" | "south" | "east" | "west";
  pos: Coordinates;
};

type Pipe = {
  char: string;
  connections: string[];
};

let width: number, height: number;

const pipes: Pipe[] = [
  { char: "|", connections: ["north", "south"] },
  { char: "-", connections: ["east", "west"] },
  { char: "L", connections: ["north", "east"] },
  { char: "J", connections: ["north", "west"] },
  { char: "7", connections: ["south", "west"] },
  { char: "F", connections: ["south", "east"] },
  { char: "S", connections: ["south", "east", "west", "east"] },
  { char: ".", connections: [] },
];

function getChar(map: string[][], pos: Coordinates): string {
  return map[pos.y][pos.x];
}

function isOutOfBounds(pos: Coordinates): boolean {
  return pos.y < 0 || pos.y >= height || pos.x < 0 || pos.x >= width;
}

function findStart(map: string[][]): Coordinates {
  for (let i: number = 0; i < height; i++) {
    for (let j: number = 0; j < width; j++) {
      if (map[i][j] === "S") return { y: i, x: j };
    }
  }
  console.log("Couldn't find start coords");
  return null;
}
function findLoopStart(map: string[][], start: Coordinates): Move {
  let pos: Coordinates;
  // north
  pos = { y: start.y - 1, x: start.x };
  if (
    !isOutOfBounds(pos) &&
    pipes
      .find((pipe) => pipe.char === getChar(map, pos))
      .connections.includes("south")
  )
    return { from: "south", pos };

  // south
  pos = { y: start.y + 1, x: start.x };
  if (
    !isOutOfBounds(pos) &&
    pipes
      .find((pipe) => pipe.char === getChar(map, pos))
      .connections.includes("north")
  )
    return { from: "north", pos };

  // west
  pos = { y: start.y, x: start.x - 1 };
  if (
    !isOutOfBounds(pos) &&
    pipes
      .find((pipe) => pipe.char === getChar(map, pos))
      .connections.includes("east")
  )
    return { from: "east", pos };

  // east
  pos = { y: start.y, x: start.x + 1 };
  return { from: "west", pos };
}

function loopFinished(loop: Coordinates[]): boolean {
  const first = loop[0];
  const last = loop[loop.length - 1];

  return first.x === last.x && first.y === last.y;
}

function findNextPipe(
  map: string[][],
  pos: Coordinates,
  from: "south" | "north" | "east" | "west"
): Move {
  const pipe: Pipe = Object.assign(
    {},
    pipes.find((pipe) => pipe.char === getChar(map, pos))
  );
  const to = pipe.connections.filter((connection) => connection != from)[0];

  switch (to) {
    case "south":
      return { from: "north", pos: { y: pos.y + 1, x: pos.x } };
    case "north":
      return { from: "south", pos: { y: pos.y - 1, x: pos.x } };
    case "east":
      return { from: "west", pos: { y: pos.y, x: pos.x + 1 } };
    case "west":
      return { from: "east", pos: { y: pos.y, x: pos.x - 1 } };
  }
}

function replaceJunk(map: string[][], loop: Coordinates[]): void {
  for (let i: number = 0; i < height; i++) {
    for (let j: number = 0; j < width; j++) {
      if (loop.find((coords) => coords.y === i && coords.x === j) === undefined)
        map[i][j] = ".";
    }
  }
}

function replaceS(map: string[][], loop: Coordinates[]): void {
  const start = loop[0];
  const adjacentPipes = [loop[1], loop[loop.length - 1]];

  const directions: string[] = [];

  for (const adjacent of adjacentPipes) {
    if (start.y < adjacent.y) directions.push("south");
    if (start.y > adjacent.y) directions.push("north");
    if (start.x < adjacent.x) directions.push("east");
    if (start.x > adjacent.x) directions.push("west");
  }

  const pipe = pipes.find(
    (pipe) =>
      pipe.connections.includes(directions[0]) &&
      pipe.connections.includes(directions[1])
  ).char;

  map[start.y][start.x] = pipe;
}

function main(input: string[]) {
  let answer1: number = 0;
  let answer2: number = 0;

  const map: string[][] = [];
  input.forEach((line) => map.push(line.split("")));

  height = map.length;
  width = map[0].length;

  // Part 1
  const loop: Coordinates[] = [];
  loop.push(findStart(map));

  let move: Move = findLoopStart(map, loop[0]);
  loop.push(move.pos);

  while (!loopFinished(loop)) {
    move = findNextPipe(map, loop[loop.length - 1], move.from);
    loop.push(move.pos);
  }
  loop.splice(loop.length - 1, 1);

  answer1 = loop.length / 2;

  // Part 2
  replaceJunk(map, loop);
  replaceS(map, loop);

  for (let i = 0; i < height; i++) {
    let inside: boolean = false;
    let up: boolean = null;

    for (let j = 0; j < width; j++) {
      const char: string = map[i][j];

      if (char === ".") {
        // If it's a junk part, that's considered inside, add 1
        if (inside) answer2++;
        continue;
      }

      if (char === "|") {
        // Passing through the loop if we were outside we are now inside and vice versa
        inside = !inside;
        continue;
      }

      if (char === "L" || char === "F") {
        // Entering a passage -> if character is L then the pipe is facing up, else it's facing down
        up = char === "L";
        continue;
      }

      if (char === "J" || char === "7") {
        // Either exiting a passage or crossing the pipe
        if (char === (up ? "7" : "J")) inside = !inside; // An "L" leading to a "7" would mean passing through the pipe
        up = null;
      }
    }
  }

  // Finish
  return { part1: answer1, part2: answer2 };
}

export default main;

/*
function printMap(map: string[][]): void {
  map.forEach((line) => {
    let output = "";
    line.forEach((char) => (output += char));
    console.log(output);
  });
}
*/
