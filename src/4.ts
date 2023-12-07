type Card = {
  cardNumber: number;
  matches: number;
  value: number;
};

function checkCardForCopies(
  card: Card,
  originalCards: Card[],
  cardCopies: Card[],
  result: number
): number {
  for (let i = 0; i < card.matches; i++) {
    cardCopies.push(originalCards[card.cardNumber + i]);
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

function main(input: string[]) {
  const cards: Card[] = [];
  input.forEach((line) => {
    cards.push(parseCard(line));
  });

  // Part 1
  let answer1: number = 0;
  for (const card of cards) answer1 += card.value;

  // Part 2
  const cardCopies: Card[] = [...cards];
  let answer2: number = cardCopies.length;

  while (cardCopies.length > 0) {
    const card = cardCopies.pop();
    answer2 = checkCardForCopies(card, cards, cardCopies, answer2);
  }

  // Finish
  return { part1: answer1, part2: answer2 };
}

export default main;
