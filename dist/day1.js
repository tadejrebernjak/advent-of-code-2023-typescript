import fs from "fs";
import readline from "readline";
const fileStream = fs.createReadStream("src/inputs/day1.txt");
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
});
const digits = [
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
let answer = 0;
rl.on("line", (line) => {
    let first = 0;
    let last = 0;
    line = replaceDigits(line);
    for (const char of line) {
        let num;
        if (char >= "0" && char <= "9") {
            num = parseInt(char);
            if (first === 0) {
                first = num;
            }
            last = num;
        }
    }
    const combined = first.toString() + last.toString();
    answer += parseInt(combined);
});
rl.on("close", () => {
    console.log("Answer: " + answer);
});
function replaceDigits(str) {
    for (const digit of digits) {
        str = str.replaceAll(digit.str, digit.str[0] + digit.value.toString() + digit.str[digit.str.length - 1]);
    }
    return str;
}
//# sourceMappingURL=day1.js.map