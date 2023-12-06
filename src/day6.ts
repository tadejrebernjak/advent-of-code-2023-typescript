import fs from "fs";
import readline from "readline";

const fileStream = fs.createReadStream("src/inputs/day6.txt");
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

type Race = {
  time: number;
  bestDistance: number;
};

const races: Race[] = [];

rl.on("line", (line: string) => {
  line = line.replaceAll(/\s\s+/g, " ");
  const split: string[] = line.split(": ");
  const propertyName: string = split[0];
  const valueStrings: string[] = split[1].split(" ");

  if (propertyName === "Time") {
    valueStrings.forEach((value) => {
      races.push({ time: parseInt(value), bestDistance: null });
    });
  } else if (propertyName === "Distance") {
    valueStrings.forEach((value, i) => {
      races[i].bestDistance = parseInt(value);
    });
  }
});

rl.on("close", () => {
  let answer1: number = 0;
  let answer2: number = 0;

  // Part 1
  races.forEach((race) => {
    let possibilites = getWinningPossibilities(race);

    if (possibilites > 0) {
      if (answer1 === 0) answer1 = 1;
      answer1 *= possibilites;
    }
  });

  // Part 2
  let time: string = "";
  let distance: string = "";
  races.forEach((race) => {
    time += race.time.toString();
    distance += race.bestDistance.toString();
  });

  const race: Race = { time: parseInt(time), bestDistance: parseInt(distance) };
  answer2 = getWinningPossibilities(race);

  // Finish
  console.log("Answer 1: " + answer1);
  console.log("Answer 2: " + answer2);
});

function getWinningPossibilities(race: Race): number {
  let possibilites: number = 0;
  for (let i: number = 0; i <= race.time; i++) {
    const distance = i * (race.time - i);
    if (distance > race.bestDistance) possibilites++;
  }

  return possibilites;
}
