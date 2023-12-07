import fs from "fs";
import readline from "readline";

const fileStream = fs.createReadStream("src/inputs/day7.txt");
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

const cardPowers: Map<string, number> = new Map([
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["T", 10],
  ["J", 11],
  ["Q", 12],
  ["K", 13],
  ["A", 14],
]);

type HandType = {
  type: string;
  power: number;
};

type Hand = {
  cards: string;
  bid: number;
  type: HandType;
  cardsPower: number;
};

type CardEntry = {
  card: string;
  count: number;
};

const hands: Hand[] = [];

function getCardEntries(cards: string, ruleset: 1 | 2): CardEntry[] {
  const entries: CardEntry[] = [];

  if (ruleset === 1) {
    // Part 1
    for (const card of cards) {
      const entry: CardEntry = entries.find((entry) => entry.card === card);
      if (entry === undefined) entries.push({ card, count: 1 });
      else entry.count++;
    }
  } else {
    // Part 2
    let jokers: number = 0;

    for (const card of cards) {
      if (card === "J") {
        jokers++;
      } else {
        const entry: CardEntry = entries.find((entry) => entry.card === card);
        if (entry === undefined) entries.push({ card, count: 1 });
        else entry.count++;
      }
    }

    if (jokers === 5) {
      entries.push({ card: "J", count: 5 });
    } else {
      entries.sort((a, b) => b.count - a.count);
      for (jokers; jokers > 0; jokers--) {
        entries[0].count++;
      }
    }
  }
  return entries;
}

function getHandType(cards: string, ruleset: 1 | 2): HandType {
  const entries: CardEntry[] = getCardEntries(cards, ruleset);

  switch (entries.length) {
    case 1:
      return { type: "Five of a kind", power: 7 };
    case 2:
      if (entries.filter((entry) => entry.count === 4).length === 1)
        return { type: "Four of a kind", power: 6 };
      else return { type: "Full house", power: 5 };
    case 3:
      if (entries.filter((entry) => entry.count === 3).length === 1)
        return { type: "Three of a kind", power: 4 };
      else return { type: "Two pair", power: 3 };
    case 4:
      return { type: "One pair", power: 2 };
    case 5:
      return { type: "High card", power: 1 };
    default:
      return null;
  }
}

function getCardsPower(cards: string): number {
  let power: number = 0;

  for (let i: number = 0; i < cards.length; i++) {
    power += Math.pow(100, i) * cardPowers.get(cards[cards.length - 1 - i]);
  }

  return power;
}

function processHands(hands: Hand[], ruleset: 1 | 2): void {
  hands.forEach((hand) => {
    hand.type = getHandType(hand.cards, ruleset);
    hand.cardsPower = getCardsPower(hand.cards);
  });

  hands.sort(
    (a, b) => a.type.power - b.type.power || a.cardsPower - b.cardsPower
  );
}

function getWinnings(hands: Hand[]): number {
  let result = 0;

  hands.forEach((hand, index) => {
    result += hand.bid * (index + 1);
  });

  return result;
}

rl.on("line", (line: string) => {
  const split = line.trim().split(" ");
  const hand = {
    cards: split[0],
    bid: parseInt(split[1]),
    type: null,
    cardsPower: null,
  };

  hands.push(hand);
});

rl.on("close", () => {
  let answer1: number = 0;
  let answer2: number = 0;

  // Part 1
  processHands(hands, 1);
  answer1 = getWinnings(hands);

  // Part 2
  cardPowers.set("J", 1);
  processHands(hands, 2);
  answer2 = getWinnings(hands);

  // Finish
  console.log("Answer 1:", answer1);
  console.log("Answer 2:", answer2);
});
