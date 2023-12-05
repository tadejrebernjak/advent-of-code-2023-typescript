import fs from "fs";
import readline from "readline";

const fileStream = fs.createReadStream("src/inputs/day5.txt");
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

type Seed = {
  seed: number;
  soil: number;
  fertilizer: number;
  water: number;
  light: number;
  temperature: number;
  humidity: number;
  location: number;
};

type Map = {
  source: string;
  destination: string;
  entries: MapEntry[];
};

type MapEntry = {
  destinationStart: number;
  sourceStart: number;
  length: number;
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

    //seeds.forEach((seed) => (seed[destination] = seed[source]));

    return;
  }

  const split = line.split(" ");
  const length = parseInt(split[2]);
  const sourceStart = parseInt(split[1]);
  const sourceEnd = sourceStart + length;
  const destinationStart = parseInt(split[0]);

  currentMap.entries.push({ destinationStart, sourceStart, length });

  /*seeds
    .filter(
      (seed) =>
        seed[source] !== null &&
        seed[source] >= sourceStart &&
        seed[source] < sourceEnd
    )
    .forEach(
      (seed) =>
        (seed[destination] = destinationStart + (seed[source] - sourceStart))
    );*/
});

/*function initializeSeeds(line: string): void {
  const seedStrings = line.split(" ");

  // PART ONE
  for (const seed of seedStrings) {  
    const seedNumber = parseInt(seed);
    addSeed(seedNumber);
  }

  // PART TWO
  for (let i: number = 0; i < seedStrings.length; i += 2) {
    const seedNumber: number = parseInt(seedStrings[i]);
    let rangeLength: number = parseInt(seedStrings[i + 1]);

    for (let j: number = 0; j < rangeLength; j++) {
      addSeed(seedNumber + j);
    }
  }
}*/

function initializeSeed(seedNumber: number): Seed {
  return {
    seed: seedNumber,
    soil: null,
    fertilizer: null,
    water: null,
    light: null,
    temperature: null,
    humidity: null,
    location: null,
  };
}

function processSeed(seed: Seed): void {
  for (const map of maps) {
    for (const entry of map.entries) {
      if (
        seed[map.source] >= entry.sourceStart &&
        seed[map.source] < entry.sourceStart + entry.length
      ) {
        seed[map.destination] =
          entry.destinationStart + (seed[map.source] - entry.sourceStart);
      }
    }

    if (seed[map.destination] === null)
      seed[(map.destination = seed[map.source])];
  }
}

rl.on("close", () => {
  let answer: number = Number.MAX_SAFE_INTEGER;

  console.log(seedsStrings);
  for (const seedString of seedsStrings) {
    const seed = initializeSeed(parseInt(seedString));
    processSeed(seed);

    console.log(seed);
    if (seed.location < answer) answer = seed.location;
  }

  console.log("Answer: " + answer);
});
