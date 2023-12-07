type Digit = {
  str: string;
  value: number;
};

const digits: Digit[] = [
  { str: "one", value: 1 },
  { str: "two", value: 2 },
  { str: "three", value: 3 },
  { str: "four", value: 4 },
  { str: "five", value: 5 },
  { str: "six", value: 6 },
  { str: "seven", value: 7 },
  { str: "eight", value: 8 },
  { str: "nine", value: 9 },
];

function replaceDigits(str: string): string {
  for (const digit of digits) {
    str = str.replaceAll(
      digit.str,
      digit.str[0] + digit.value.toString() + digit.str[digit.str.length - 1]
    );
  }
  return str;
}

function processInput(input: string[], part: 1 | 2): number {
  let result = 0;

  input.forEach((line) => {
    let first: number = 0;
    let last: number = 0;

    if (part === 2) line = replaceDigits(line);

    for (const char of line) {
      let num: number;

      if (char >= "0" && char <= "9") {
        num = parseInt(char);

        if (first === 0) {
          first = num;
        }

        last = num;
      }
    }
    const combined: string = first.toString() + last.toString();
    result += parseInt(combined);
  });

  return result;
}

function main(input: string[]) {
  // Part 1
  const answer1: number = processInput(input, 1);

  // Part 2
  const answer2: number = processInput(input, 2);

  // Finish
  return { part1: answer1, part2: answer2 };
}

export default main;
