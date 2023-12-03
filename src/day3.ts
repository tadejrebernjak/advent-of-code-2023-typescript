import fs from "fs";
import readline from "readline";

const fileStream = fs.createReadStream("src/inputs/day3.txt");

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

const engine: string[][] = [];

rl.on("line", (line: string) => {
  engine.push(line.split(""));
});

rl.on("close", () => {
  const answer: Answer = processEngine(engine);
  console.log("Answer 1: " + answer.partNumbers);
  console.log("Answer 2: " + answer.gearRatios);
});

type NumberEntry = {
  value: number;
  line: number;
  start: number;
  end: number;
};

type Answer = {
  partNumbers: number;
  gearRatios: number;
};

type Gear = {
  line: number;
  index: number;
  ratio: number;
};

type Position = {
  line: number;
  index: number;
};

function processEngine(engine: string[][]): Answer {
  const numbers: NumberEntry[] = getNumbers(engine);

  let partNumbers: number = 0;
  for (let i = numbers.length - 1; i >= 0; i--) {
    if (isPartNumber(numbers[i], engine)) partNumbers += numbers[i].value;
    else numbers.splice(i, 1);
  }

  let gearRatios: number = 0;
  const gears: Gear[] = getGears(engine, numbers);
  for (const gear of gears) {
    gearRatios += gear.ratio;
  }

  return { partNumbers, gearRatios };
}

function getNumbers(engine: string[][]): NumberEntry[] {
  const numbers: NumberEntry[] = [];

  for (const i in engine) {
    const line: string[] = engine[i];
    let currentNumberStart: number = -1;
    let currentNumberEnd: number = -1;
    for (const j in line) {
      if (parseInt(j) <= currentNumberEnd) continue;

      const char: string = line[j];
      if (isDigit(char)) {
        const number: string = getFullNumber(line, parseInt(j), char);
        currentNumberStart = parseInt(j);
        currentNumberEnd = parseInt(j) + number.length - 1;

        numbers.push({
          value: parseInt(number),
          line: parseInt(i),
          start: currentNumberStart,
          end: currentNumberEnd,
        });
      }
    }
  }

  return numbers;
}

function getGears(engine: string[][], partNumbers: NumberEntry[]): Gear[] {
  const gears: Gear[] = [];

  for (const i in engine) {
    for (const j in engine[i]) {
      if (engine[i][j] === "*")
        gears.push({ line: parseInt(i), index: parseInt(j), ratio: 0 });
    }
  }

  for (let i = gears.length - 1; i >= 0; i--) {
    const gear = gears[i];
    const positions = getAdjacentPositions(gear, engine);
    const adjacentPartNumbers: NumberEntry[] = [];

    for (const position of positions) {
      const adjacentPartNumber = getPartNumber(
        position.line,
        position.index,
        partNumbers
      );
      if (adjacentPartNumber != null)
        adjacentPartNumbers.push(adjacentPartNumber);
    }

    const uniqueNumbers: NumberEntry[] = [...new Set(adjacentPartNumbers)];
    if (uniqueNumbers.length === 2) {
      gear.ratio = 1;
      for (const number of uniqueNumbers) gear.ratio *= number.value;
    } else {
      gears.splice(i, 1);
    }
  }

  return gears;
}

function getAdjacentPositions(gear: Gear, engine: string[][]): Position[] {
  const adjacentPositions: Position[] = [];
  const canCheckLeft = gear.index > 0;
  const canCheckRight = gear.index < engine[gear.line].length - 1;
  const canCheckUp = gear.line > 0;
  const canCheckDown = gear.line < engine.length - 1;

  if (canCheckLeft)
    adjacentPositions.push({ line: gear.line, index: gear.index - 1 });
  if (canCheckRight)
    adjacentPositions.push({ line: gear.line, index: gear.index + 1 });
  if (canCheckUp)
    adjacentPositions.push({ line: gear.line - 1, index: gear.index });
  if (canCheckDown)
    adjacentPositions.push({ line: gear.line + 1, index: gear.index });
  if (canCheckLeft && canCheckUp)
    adjacentPositions.push({ line: gear.line - 1, index: gear.index - 1 });
  if (canCheckLeft && canCheckDown)
    adjacentPositions.push({ line: gear.line + 1, index: gear.index - 1 });
  if (canCheckRight && canCheckUp)
    adjacentPositions.push({ line: gear.line - 1, index: gear.index + 1 });
  if (canCheckRight && canCheckDown)
    adjacentPositions.push({ line: gear.line + 1, index: gear.index + 1 });

  return adjacentPositions;
}

function getPartNumber(
  line: number,
  index: number,
  partNumbers: NumberEntry[]
): NumberEntry {
  for (const partNumber of partNumbers) {
    if (
      line === partNumber.line &&
      index >= partNumber.start &&
      index <= partNumber.end
    )
      return partNumber;
  }

  return null;
}

function isPartNumber(number: NumberEntry, engine: string[][]): boolean {
  const canCheckLeft = number.start > 0;
  const canCheckRight = number.end < engine[number.line].length - 1;
  const canCheckUp = number.line > 0;
  const canCheckDown = number.line < engine.length - 1;
  const i = number.line;

  if (canCheckLeft && isSymbol(engine[i][number.start - 1])) return true;
  if (canCheckLeft && canCheckUp && isSymbol(engine[i - 1][number.start - 1]))
    return true;
  if (canCheckLeft && canCheckDown && isSymbol(engine[i + 1][number.start - 1]))
    return true;

  if (canCheckRight && isSymbol(engine[i][number.end + 1])) return true;
  if (canCheckRight && canCheckUp && isSymbol(engine[i - 1][number.end + 1]))
    return true;
  if (canCheckRight && canCheckDown && isSymbol(engine[i + 1][number.end + 1]))
    return true;

  for (let j: number = number.start; j <= number.end; j++) {
    if (
      (canCheckUp && isSymbol(engine[i - 1][j])) ||
      (canCheckDown && isSymbol(engine[i + 1][j]))
    )
      return true;
  }

  return false;
}

function getFullNumber(line: string[], index: number, number: string): string {
  index++;
  if (index >= line.length || !isDigit(line[index])) return number;

  number += line[index];
  return getFullNumber(line, index, number);
}

function isDigit(char: string): boolean {
  return char >= "0" && char <= "9";
}

function isSymbol(char: string): boolean {
  return !isDigit(char) && char != ".";
}
