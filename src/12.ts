type Node = {
  config: string;
  nums: number[];
};

function solve(input: string[]): number {
  let result: number = 0;

  input.forEach((row) => {
    let rowPossibilites = 1;

    let nums: number[] = [];
    row
      .split(" ")[1]
      .split(",")
      .forEach((numString) => nums.push(parseInt(numString)));
    let config: string[] = row
      .split(" ")[0]
      .replaceAll(/\.+/g, ".")
      .split(".")
      .filter((spring) => spring != "");

    const nodes: Node[] = [];

    for (let i = 0; i < config.length; i++) {
      const node: Node = {
        config: config[i],
        nums: [],
      };
      let length = config[i].length;

      while (length > 0) {
        if (nums[0] === undefined || nums[0] > length) break;
        length -= nums[0] + 1;
        node.nums.push(nums.shift());
      }

      nodes.push(node);
    }

    //console.log(row);
    nodes.forEach((node) => {
      let possibilities = 1;
      //console.log("NODE----------");
      //console.log(node);
      const isolated: Node[] = [];
      let config: string = node.config;
      let nums: number[] = [...node.nums];

      while (config != "") {
        let nextNum: number = nums[0];
        for (let i = 0; i < config.length; i++) {
          if (i === config.length - 1) {
            isolated.push({
              config,
              nums,
            });
            config = "";
            break;
          }
          if (config[i] === "#") {
            if (i === 0) {
              if (i + 1 < nextNum) {
                config = config.slice(1);
                nums[0]--;
                break;
              } else {
                config = config.slice(2);
                nums.shift();
                break;
              }
            }
            let j = i;
            while (config[j + 1] === "#" && j + 1 < config.length) {
              j++;
            }
            if (j + 1 >= nextNum) {
              config = config.slice(j + 2);
              nums.shift();
              break;
            } else {
              isolated.push({
                config: config.slice(0, i),
                nums: [i],
              });
              config = config.slice(j + 1);
              nums[0] -= j + 1;
              break;
            }
          }
        }
      }

      //console.log("ISOLATED----------");
      isolated.forEach((node) => {
        let combinations = 0;
        //console.log(node);
        if (nums.length === 0) {
          return;
        }
        if (nums.length > 1) {
          let sum = 0;
          node.nums.forEach((num) => (sum += num));
          let i = node.config.length - sum;
          for (i; i > 0; i--) {
            combinations += i;
          }
        } else {
          combinations = 1;
          for (let i = 0; i + nums[0] < node.config.length; i++) {
            combinations++;
          }
        }

        possibilities *= combinations <= 0 ? 1 : combinations;
        console.log(node, combinations);
      });
      //console.log(possibilities);
      rowPossibilites *= possibilities;
    });
    result += rowPossibilites;
  });

  return result;
}

function main(input: string[]) {
  let answer1: number = 0;
  let answer2: number = 0;

  // Part 1
  answer1 = solve(input);

  // Part 2

  // Finish
  return { part1: answer1, part2: answer2 };
}

export default main;
