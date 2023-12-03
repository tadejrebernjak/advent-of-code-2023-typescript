import fs from "fs";
import readline from "readline";
const fileStream = fs.createReadStream("src/inputs/day3.txt");
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
});
const engine = [];
rl.on("line", (line) => {
    engine.push(line.split(""));
});
rl.on("close", () => {
    const answer = processEngine(engine);
    console.log("Answer 1: " + answer.partNumbers);
    console.log("Answer 2: " + answer.gearRatios);
});
function processEngine(engine) {
    const numbers = getNumbers(engine);
    let partNumbers = 0;
    for (let i = numbers.length - 1; i >= 0; i--) {
        if (isPartNumber(numbers[i], engine))
            partNumbers += numbers[i].value;
        else
            numbers.splice(i, 1);
    }
    let gearRatios = 0;
    const gears = getGears(engine, numbers);
    for (const gear of gears) {
        gearRatios += gear.ratio;
    }
    return { partNumbers, gearRatios };
}
function getNumbers(engine) {
    const numbers = [];
    for (const i in engine) {
        const line = engine[i];
        let currentNumberStart = -1;
        let currentNumberEnd = -1;
        for (const j in line) {
            if (parseInt(j) <= currentNumberEnd)
                continue;
            const char = line[j];
            if (isDigit(char)) {
                const number = getFullNumber(line, parseInt(j), char);
                currentNumberStart = parseInt(j);
                currentNumberEnd = parseInt(j) + number.length - 1;
                numbers.push({
                    value: parseInt(number),
                    line: parseInt(i),
                    start: currentNumberStart,
                    end: currentNumberEnd,
                });
            }
        }
    }
    return numbers;
}
function getGears(engine, partNumbers) {
    const gears = [];
    for (const i in engine) {
        for (const j in engine[i]) {
            if (engine[i][j] === "*")
                gears.push({ line: parseInt(i), index: parseInt(j), ratio: 0 });
        }
    }
    for (let i = gears.length - 1; i >= 0; i--) {
        const gear = gears[i];
        const positions = getAdjacentPositions(gear, engine);
        const adjacentPartNumbers = [];
        for (const position of positions) {
            const adjacentPartNumber = getPartNumber(position.line, position.index, partNumbers);
            if (adjacentPartNumber != null)
                adjacentPartNumbers.push(adjacentPartNumber);
        }
        const uniqueNumbers = [...new Set(adjacentPartNumbers)];
        if (uniqueNumbers.length === 2) {
            gear.ratio = 1;
            for (const number of uniqueNumbers)
                gear.ratio *= number.value;
        }
        else {
            gears.splice(i, 1);
        }
    }
    return gears;
}
function getAdjacentPositions(gear, engine) {
    const adjacentPositions = [];
    const canCheckLeft = gear.index > 0;
    const canCheckRight = gear.index < engine[gear.line].length - 1;
    const canCheckUp = gear.line > 0;
    const canCheckDown = gear.line < engine.length - 1;
    if (canCheckLeft)
        adjacentPositions.push({ line: gear.line, index: gear.index - 1 });
    if (canCheckRight)
        adjacentPositions.push({ line: gear.line, index: gear.index + 1 });
    if (canCheckUp)
        adjacentPositions.push({ line: gear.line - 1, index: gear.index });
    if (canCheckDown)
        adjacentPositions.push({ line: gear.line + 1, index: gear.index });
    if (canCheckLeft && canCheckUp)
        adjacentPositions.push({ line: gear.line - 1, index: gear.index - 1 });
    if (canCheckLeft && canCheckDown)
        adjacentPositions.push({ line: gear.line + 1, index: gear.index - 1 });
    if (canCheckRight && canCheckUp)
        adjacentPositions.push({ line: gear.line - 1, index: gear.index + 1 });
    if (canCheckRight && canCheckDown)
        adjacentPositions.push({ line: gear.line + 1, index: gear.index + 1 });
    return adjacentPositions;
}
function getPartNumber(line, index, partNumbers) {
    for (const partNumber of partNumbers) {
        if (line === partNumber.line &&
            index >= partNumber.start &&
            index <= partNumber.end)
            return partNumber;
    }
    return null;
}
function isPartNumber(number, engine) {
    const canCheckLeft = number.start > 0;
    const canCheckRight = number.end < engine[number.line].length - 1;
    const canCheckUp = number.line > 0;
    const canCheckDown = number.line < engine.length - 1;
    const i = number.line;
    if (canCheckLeft && isSymbol(engine[i][number.start - 1]))
        return true;
    if (canCheckLeft && canCheckUp && isSymbol(engine[i - 1][number.start - 1]))
        return true;
    if (canCheckLeft && canCheckDown && isSymbol(engine[i + 1][number.start - 1]))
        return true;
    if (canCheckRight && isSymbol(engine[i][number.end + 1]))
        return true;
    if (canCheckRight && canCheckUp && isSymbol(engine[i - 1][number.end + 1]))
        return true;
    if (canCheckRight && canCheckDown && isSymbol(engine[i + 1][number.end + 1]))
        return true;
    for (let j = number.start; j <= number.end; j++) {
        if ((canCheckUp && isSymbol(engine[i - 1][j])) ||
            (canCheckDown && isSymbol(engine[i + 1][j])))
            return true;
    }
    return false;
}
function getFullNumber(line, index, number) {
    index++;
    if (index >= line.length || !isDigit(line[index]))
        return number;
    number += line[index];
    return getFullNumber(line, index, number);
}
function isDigit(char) {
    return char >= "0" && char <= "9";
}
function isSymbol(char) {
    return !isDigit(char) && char != ".";
}
//# sourceMappingURL=day3.js.map