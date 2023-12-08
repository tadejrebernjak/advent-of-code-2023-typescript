type Node = {
  node: string;
  L: string;
  R: string;
};

function processInput(input: string[]): Node[] {
  const nodes: Node[] = [];

  input.forEach((line) => {
    const split = line.split(" = ");
    const directions = split[1].split(", ");
    const L = directions[0].slice(1);
    const R = directions[1].slice(0, directions[1].length - 1);

    nodes.push({ node: split[0], L, R });
  });

  return nodes;
}

function part1(nodes: Node[], directions: string[]): number {
  let result: number = 0;
  let currentNode: Node = nodes.find((node) => node.node === "AAA");
  let directionIndex: number = 0;

  while (currentNode.node != "ZZZ") {
    if (directionIndex >= directions.length) directionIndex = 0;
    currentNode = nodes.find(
      (node) => node.node === currentNode[directions[directionIndex]]
    );
    result++;
    directionIndex++;
  }

  return result;
}

function part2(map: Node[], directions: string[]): number {
  const nodes: Node[] = [];
  const steps: number[] = [];
  map
    .filter((node) => node.node[node.node.length - 1] == "A")
    .forEach((node) => nodes.push(node));

  nodes.forEach((currentNode) => {
    let i = 0;
    let directionIndex: number = 0;

    while (currentNode.node[currentNode.node.length - 1] != "Z") {
      if (directionIndex >= directions.length) directionIndex = 0;
      currentNode = map.find(
        (node) => node.node === currentNode[directions[directionIndex]]
      );
      i++;
      directionIndex++;
    }

    steps.push(i);
  });

  const gcd = (a, b) => (a ? gcd(b % a, a) : b);
  const lcm = (a, b) => (a * b) / gcd(a, b);

  return steps.reduce(lcm);
  // The answer is the lowest common multiple of all of the starting nodes' required steps to reach their goal
}

function main(input: string[]) {
  const directions: string[] = input[0].split("");
  input.splice(0, 2);
  const nodes: Node[] = processInput(input);

  // Part 1
  const answer1: number = part1(nodes, directions);

  // Part 2
  const answer2: number = part2(nodes, directions);

  // Finish
  return { part1: answer1, part2: answer2 };
}

export default main;
