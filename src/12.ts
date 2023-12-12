type Row = {
  config: string;
  nums: number[];
};

/*
function solve(input: string[]): number {
  let result: number = 0;

  input.forEach((row) => {
    let nums: number[] = [];
    row
      .split(" ")[1]
      .split(",")
      .forEach((numString) => nums.push(parseInt(numString)));
    let springs: string[] = row
      .split(" ")[0]
      .replaceAll(/\.+/g, ".")
      .split(".")
      .filter((spring) => spring != "");

    const nodes: Node[] = [];

    for (let i = 0; i < springs.length; i++) {
      const node = {
        springs: springs[i].split(""),
        nums: [],
        possibilities: 0,
      };
      let length = springs[i].length;

      while (length > 0) {
        if (nums[0] === undefined || nums[0] > length) break;
        length -= nums[0] + 1;
        node.nums.push(nums.shift());
      }

      nodes.push(node);
    }

    console.log(row);
    console.log(nodes);

    nodes.forEach((node) => {
      let length = 0;
      let num = 0;
      for (let i = 0; i < node.springs.length; i++) {
        length++;
        if (i+1 < node.springs.length && node.springs[i+1] === "#") {
            if (length > node.nums[num]) {
                node.springs[i] = ".";
            } else {
                let j = i + 1;
            }
        }
      }
    });*/

/*
    
    for (let i = 0; i < springs.length; i++) {
        for (let j = 0; j < springs[i].length; j++) {
            const spring = springs[j];
            const num = nums[k];
            if (spring.length === num) {
                possibilities++;
                k++;
            } else if (spring.length === num + 1) {

            }
        }
    }
    
  });

  return 0;
}*/

function main(input: string[]) {
  let answer1: number = 0;
  let answer2: number = 0;

  const rows: Row[] = [];
  input.forEach((line) => {
    const split = line.split(" ");
    const row: Row = { config: split[0], nums: [] };
    split[1].split(",").forEach((numStr) => row.nums.push(parseInt(numStr)));

    rows.push(row);
  });

  console.log(rows);

  // Part 1
  //answer1 = solve(input);

  // Part 2

  // Finish
  return { part1: answer1, part2: answer2 };
}

export default main;
