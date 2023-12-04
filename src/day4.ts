import fs from "fs";
import readline from "readline";

const fileStream = fs.createReadStream("src/inputs/day4.txt");
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

type Card = {
  cardNumber: number;
  matches: number;
  value: number;
};

const cards: Card[] = [];

rl.on("line", (line: string) => {
  const card: Card = parseCard(line);
  cards.push(card);
});

rl.on("close", () => {
  // Part 1
  let answer1: number = 0;
  for (const card of cards) answer1 += card.value;

  // Part 2
  const cardCopies: Card[] = [...cards];
  let answer2: number = cardCopies.length;

  while (cardCopies.length > 0) {
    const card = cardCopies.pop();
    answer2 = checkCardForCopies(card, cardCopies, answer2);
  }

  // Finish
  console.log("Answer 1: " + answer1);
  console.log("Answer 2: " + answer2);
});

function checkCardForCopies(
  card: Card,
  cardCopies: Card[],
  result: number
): number {
  for (let i = 0; i < card.matches; i++) {
    cardCopies.push(cards[card.cardNumber + i]);
    result++;
  }

  return result;
}

function parseCard(line: string): Card {
  const card: Card = {
    cardNumber: null,
    matches: 0,
    value: 0,
  };

  card.cardNumber = parseInt(
    line.split(":")[0].replace(/\s+/g, " ").split(" ")[1]
  );

  const numbersString: string = line.split(":")[1];

  // Parse winning numbers
  const winningNumbersString: string = numbersString
    .split(" | ")[0]
    .substring(1);
  const winningNumbers: number[] = [];
  for (let i = 0; i < winningNumbersString.length; i += 3) {
    winningNumbers.push(parseInt(winningNumbersString.substring(i, i + 2)));
  }

  // Parse drawn numbers
  const drawnNumbersString: string = numbersString.split(" | ")[1];
  const drawnNumbers: number[] = [];
  for (let i = 0; i < drawnNumbersString.length; i += 3) {
    drawnNumbers.push(parseInt(drawnNumbersString.substring(i, i + 2)));
  }

  // Find matching numbers
  for (const drawnNumber of drawnNumbers) {
    if (winningNumbers.includes(drawnNumber)) {
      card.matches++;
      if (card.value === 0) card.value = 1;
      else card.value *= 2;
    }
  }
  return card;
}
