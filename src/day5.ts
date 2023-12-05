import fs from "fs";
import readline from "readline";

const fileStream = fs.createReadStream("src/inputs/day5.txt");
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

class Seed {
  seed: number;
  soil: number;
  fertilizer: number;
  water: number;
  light: number;
  temperature: number;
  humidity: number;
  location: number;

  constructor(num: number) {
    this.seed = num;
    this.soil = null;
    this.fertilizer = null;
    this.water = null;
    this.light = null;
    this.temperature = null;
    this.humidity = null;
    this.location = null;
  }

  process = (maps: Map[]) => {
    maps.forEach((map) => {
      for (const entry of map.entries) {
        if (
          this[map.source] >= entry.sourceStart &&
          this[map.source] < entry.sourceStart + entry.length
        ) {
          this[map.destination] =
            entry.destinationStart + (this[map.source] - entry.sourceStart);
          break;
        }
      }

      if (this[map.destination] === null)
        this[map.destination] = this[map.source];
    });
  };
}

type Map = {
  source: string;
  destination: string;
  entries: MapEntry[];
};

type MapEntry = {
  destinationStart: number;
  sourceStart: number;
  sourceEnd: number;
  length: number;
};

type Range = {
  start: number;
  end: number;
};

let seedsStrings: string[] = null;
const maps: Map[] = [];
let currentMap: Map = null;

rl.on("line", (line: string) => {
  if (line === "") return;

  if (line.split(": ")[0] === "seeds") {
    if (seedsStrings === null) seedsStrings = line.split(": ")[1].split(" ");
    return;
  }

  if (line.split(" ")[1] === "map:") {
    const categories = line.split(" ")[0];
    const source = categories.split("-")[0];
    const destination = categories.split("-")[2];

    maps.push({ source, destination, entries: [] });
    currentMap = maps[maps.length - 1];

    return;
  }

  const split = line.split(" ");
  const length = parseInt(split[2]);
  const sourceStart = parseInt(split[1]);
  const sourceEnd = sourceStart + length - 1;
  const destinationStart = parseInt(split[0]);

  currentMap.entries.push({ destinationStart, sourceStart, sourceEnd, length });
});

rl.on("close", () => {
  let answer: number = Number.MAX_SAFE_INTEGER;

  // PART ONE
  for (const seedString of seedsStrings) {
    const seed: Seed = new Seed(parseInt(seedString));
    seed.process(maps);
    if (seed.location < answer) answer = seed.location;
  }
  console.log("Answer 1: " + answer);

  // PART TWO
  maps.forEach((map) =>
    map.entries.sort((a, b) => a.sourceStart - b.sourceStart)
  );

  answer = Number.MAX_SAFE_INTEGER;
  const ranges: Range[] = [];
  for (let i = 0; i < seedsStrings.length; i += 2) {
    ranges.push({
      start: parseInt(seedsStrings[i]),
      end: parseInt(seedsStrings[i]) + parseInt(seedsStrings[i + 1]) - 1,
    });
  }

  for (const i in ranges) {
    const lowestLocation = processRange(0, ranges[i]);
    if (lowestLocation < answer) answer = lowestLocation;
  }

  console.log("Answer 2: " + answer);
});

function processRange(mapIndex: number, range: Range): number {
  if (mapIndex >= maps.length) return range.start;

  const map = maps[mapIndex];
  mapIndex++;

  const subRanges: Range[] = splitRange(range, map);
  mapRanges(subRanges, map);

  let lowest: number = Number.MAX_SAFE_INTEGER;
  for (const range of subRanges) {
    const rangeLowest = processRange(mapIndex, range);
    if (rangeLowest < lowest) lowest = rangeLowest;
  }
  return lowest;
}

function splitRange(originalRange: Range, originalMap: Map): Range[] {
  const map: Map = Object.assign({}, originalMap);
  const range: Range = Object.assign({}, originalRange);

  map.entries = map.entries.filter(
    (entry) =>
      (entry.sourceStart >= range.start && entry.sourceStart <= range.end) ||
      (entry.sourceEnd >= range.start && entry.sourceEnd <= range.end) ||
      (entry.sourceStart <= range.start && entry.sourceEnd >= range.end)
  );

  const ranges: Range[] = [];
  while (range.start <= range.end) {
    if (map.entries.length === 0 || range.end < map.entries[0].sourceEnd) {
      ranges.push({ start: range.start, end: range.end });
      break;
    } else if (range.end === map.entries[0].sourceEnd) {
      ranges.push({ start: range.start, end: range.end - 1 });
      ranges.push({ start: range.end, end: range.end });
      break;
    } else {
      ranges.push({ start: range.start, end: map.entries[0].sourceEnd });
      range.start = map.entries[0].sourceEnd + 1;
      map.entries.shift();
    }
  }
  return ranges;
}

function mapRanges(ranges: Range[], map: Map): void {
  ranges.forEach((range) => {
    const mapEntry: MapEntry = map.entries.filter(
      (entry) =>
        (entry.sourceStart >= range.start && entry.sourceStart <= range.end) ||
        (entry.sourceEnd >= range.start && entry.sourceEnd <= range.end) ||
        (entry.sourceStart <= range.start && entry.sourceEnd >= range.end)
    )[0];
    if (mapEntry != undefined && mapEntry != null) {
      const shift = mapEntry.destinationStart - mapEntry.sourceStart;
      range.start += shift;
      range.end += shift;
    }
  });
}
