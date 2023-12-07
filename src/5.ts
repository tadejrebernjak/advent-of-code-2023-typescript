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
          this[map.source] >= entry.source.start &&
          this[map.source] < entry.source.end
        ) {
          this[map.destination] =
            entry.destinationStart + (this[map.source] - entry.source.start);
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

type Range = {
  start: number;
  end: number;
};

type MapEntry = {
  destinationStart: number;
  source: Range;
};

function processRange(mapIndex: number, range: Range, maps: Map[]): number {
  if (mapIndex >= maps.length) return range.start;

  const map = maps[mapIndex];
  mapIndex++;

  const subRanges: Range[] = splitRange(range, map);
  mapRanges(subRanges, map);

  let lowest: number = Number.MAX_SAFE_INTEGER;
  for (const range of subRanges) {
    const rangeLowest = processRange(mapIndex, range, maps);
    if (rangeLowest < lowest) lowest = rangeLowest;
  }
  return lowest;
}

function splitRange(originalRange: Range, originalMap: Map): Range[] {
  const map: Map = Object.assign({}, originalMap);
  const range: Range = Object.assign({}, originalRange);

  map.entries = map.entries.filter(
    (entry) =>
      (entry.source.start >= range.start && entry.source.start <= range.end) ||
      (entry.source.end >= range.start && entry.source.end <= range.end) ||
      (entry.source.start <= range.start && entry.source.end >= range.end)
  );

  const ranges: Range[] = [];
  while (range.start <= range.end) {
    const nextMapEntry: MapEntry = map.entries[0];

    if (nextMapEntry === undefined) {
      // rangeStart rangeEnd
      ranges.push({ start: range.start, end: range.end });
      break;
    } else if (nextMapEntry.source.start > range.start) {
      // rangeStart | mapStart ...
      ranges.push({ start: range.start, end: nextMapEntry.source.start - 1 });
      range.start = nextMapEntry.source.start;
    } else if (range.end < nextMapEntry.source.end) {
      // mapStart | rangeStart rangeEnd | mapEnd
      ranges.push({ start: range.start, end: range.end });
      break;
    } else {
      // mapStart | rangeStart | mapEnd | rangeEnd
      ranges.push({ start: range.start, end: nextMapEntry.source.end });
      range.start = nextMapEntry.source.end + 1;
      map.entries.shift();
    }
  }
  return ranges;
}

function mapRanges(ranges: Range[], map: Map): void {
  ranges.forEach((range) => {
    const mapEntry: MapEntry = map.entries.filter(
      (entry) =>
        entry.source.start <= range.start && entry.source.end >= range.end
    )[0];
    if (mapEntry != undefined && mapEntry != null) {
      const shift = mapEntry.destinationStart - mapEntry.source.start;
      range.start += shift;
      range.end += shift;
    }
  });
}

function processInput(input: string[]): Map[] {
  const maps: Map[] = [];
  let currentMap: Map = null;

  input.forEach((line) => {
    if (line === "") return;

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

    currentMap.entries.push({
      destinationStart,
      source: { start: sourceStart, end: sourceEnd },
    });
  });

  return maps;
}

function main(input: string[]) {
  let answer1: number = Number.MAX_SAFE_INTEGER;
  let answer2: number = Number.MAX_SAFE_INTEGER;

  const seedsStrings: string[] = input.shift().split(": ")[1].split(" ");
  const maps: Map[] = processInput(input);

  // Part 1
  for (const seedString of seedsStrings) {
    const seed: Seed = new Seed(parseInt(seedString));
    seed.process(maps);
    if (seed.location < answer1) answer1 = seed.location;
  }

  // Part 2
  maps.forEach((map) =>
    map.entries.sort((a, b) => a.source.start - b.source.start)
  );

  const ranges: Range[] = [];
  for (let i = 0; i < seedsStrings.length; i += 2) {
    ranges.push({
      start: parseInt(seedsStrings[i]),
      end: parseInt(seedsStrings[i]) + parseInt(seedsStrings[i + 1]) - 1,
    });
  }

  for (const range of ranges) {
    const lowestLocation = processRange(0, range, maps);
    if (lowestLocation < answer2) answer2 = lowestLocation;
  }

  // Finish
  return { part1: answer1, part2: answer2 };
}

export default main;
