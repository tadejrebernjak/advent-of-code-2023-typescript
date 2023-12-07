type Race = {
  time: number;
  bestDistance: number;
};

function getWinningPossibilities(race: Race): number {
  let possibilites: number = 0;
  for (let i: number = 0; i <= race.time; i++) {
    const distance = i * (race.time - i);
    if (distance > race.bestDistance) possibilites++;
  }

  return possibilites;
}

function processInput(input: string[]): Race[] {
  const races: Race[] = [];

  input.forEach((line) => {
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

  return races;
}

function main(input: string[]) {
  let answer1: number = 0;
  let answer2: number = 0;

  const races: Race[] = processInput(input);

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
  return { part1: answer1, part2: answer2 };
}

export default main;
