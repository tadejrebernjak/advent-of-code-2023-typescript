import fs from "fs";
import readline from "readline";

const latestDay = 8;

const args = process.argv.slice(2);

if (args.length === 1 && args[0] === "all") {
  for (let i = 1; i <= latestDay; i++) await runDay(i);
} else if (
  args.length === 1 &&
  !isNaN(parseInt(args[0])) &&
  parseInt(args[0]) >= 0 &&
  parseInt(args[0]) <= latestDay
) {
  runDay(args[0]);
} else {
  console.log(`Please pass only ONE argument: [1-${latestDay}] OR 'all'`);
}

async function runDay(day) {
  // Importing script for given day
  const { default: script } = await import(`./dist/${day}.js`);

  // Reading input file for given day
  const fileStream = fs.createReadStream(`src/inputs/${day}.txt`);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const input = [];
  rl.on("line", (line) => {
    input.push(line);
  });

  rl.on("close", () => {
    const answer = script(input);

    console.log(`-----Day ${day}-----`);
    console.log("Part 1:", answer.part1);
    console.log("Part 2:", answer.part2, "\n");
  });
}
