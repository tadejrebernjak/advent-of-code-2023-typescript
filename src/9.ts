type History = {
  sequences: number[][];
};

function processInput(input: string[]): History[] {
  const histories: History[] = [];

  input.forEach((line) => {
    const history = { sequences: [[]] };
    const split = line.split(" ");
    split.forEach((numString) => {
      history.sequences[0].push(parseInt(numString));
    });
    histories.push(history);
  });

  return histories;
}

function fillSequences(histories: History[]): void {
  histories.forEach((history) => {
    while (!allZeros(lastElementOf(history.sequences))) {
      const prevSequence: number[] = lastElementOf(history.sequences);
      const newSequence: number[] = [];
      for (let i: number = 0; i < prevSequence.length - 1; i++) {
        newSequence.push(prevSequence[i + 1] - prevSequence[i]);
      }
      history.sequences.push(newSequence);
    }
  });
}

function solve(histories: History[], part: 1 | 2): number {
  let result: number = 0;

  histories.forEach((history) => {
    // Working with a copy so I can re-use this function with the same history array for part 2
    const historyCopy = Object.assign({}, history);

    lastElementOf(historyCopy.sequences).push(0);
    for (let i: number = historyCopy.sequences.length - 2; i >= 0; i--) {
      const currentSequence = historyCopy.sequences[i];
      if (part == 1) {
        currentSequence.push(
          lastElementOf(currentSequence) +
            lastElementOf(historyCopy.sequences[i + 1])
        );
      } else {
        currentSequence.unshift(
          currentSequence[0] - historyCopy.sequences[i + 1][0]
        );
      }
    }
    result +=
      part === 1
        ? lastElementOf(historyCopy.sequences[0])
        : historyCopy.sequences[0][0];
  });

  return result;
}

function lastElementOf(arr) {
  return arr[arr.length - 1];
}

function allZeros(arr: number[]): boolean {
  for (const num of arr) {
    if (num != 0) return false;
  }
  return true;
}

function main(input: string[]) {
  let answer1: number = 0;
  let answer2: number = 0;

  const histories: History[] = processInput(input);
  fillSequences(histories);

  // Part 1
  answer1 = solve(histories, 1);

  // Part 2
  answer2 = solve(histories, 2);

  // Finish
  return { part1: answer1, part2: answer2 };
}

export default main;
