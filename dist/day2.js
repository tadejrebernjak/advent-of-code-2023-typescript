import fs from "fs";
import readline from "readline";
const fileStream = fs.createReadStream("src/inputs/day2.txt");
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
});
const maximum = {
    red: 12,
    green: 13,
    blue: 14,
};
let answer1 = 0;
let answer2 = 0;
rl.on("line", (line) => {
    const game = parseLine(line);
    part1(game);
    part2(game.reveals);
});
rl.on("close", () => {
    console.log("Answer 1: " + answer1);
    console.log("Answer 2: " + answer2);
});
function parseLine(line) {
    const id = parseInt(line.split(":")[0].split(" ")[1]);
    const revealsStrings = line.split(":")[1].trim().split("; ");
    const reveals = [];
    for (const str of revealsStrings) {
        const revealedColorsString = str.split(", ");
        const revealedColors = {
            red: 0,
            green: 0,
            blue: 0,
        };
        for (const revealedColor of revealedColorsString) {
            const color = revealedColor.split(" ")[1];
            const num = parseInt(revealedColor.split(" ")[0]);
            revealedColors[color] = num;
        }
        reveals.push(revealedColors);
    }
    return { id, reveals };
}
function isPossible(revealed, maximum) {
    return (revealed.red <= maximum.red &&
        revealed.green <= maximum.green &&
        revealed.blue <= maximum.blue);
}
function part1(game) {
    let gameIsPossible = true;
    for (const reveal of game.reveals) {
        if (!isPossible(reveal, maximum)) {
            gameIsPossible = false;
            break;
        }
    }
    if (gameIsPossible)
        answer1 += game.id;
}
function part2(reveals) {
    const minimums = {
        red: 0,
        green: 0,
        blue: 0,
    };
    for (const reveal of reveals) {
        if (reveal.red > minimums.red)
            minimums.red = reveal.red;
        if (reveal.green > minimums.green)
            minimums.green = reveal.green;
        if (reveal.blue > minimums.blue)
            minimums.blue = reveal.blue;
    }
    const power = minimums.red * minimums.green * minimums.blue;
    answer2 += power;
}
//# sourceMappingURL=day2.js.map