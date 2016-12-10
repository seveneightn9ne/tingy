type Direction = "left" | "right";
type Strategy = "liar" | "truther" | "random";
type Query = (answer: Direction) => boolean;
interface Guard {
  name: string,
  answerer: GuardAnswerer
}
type GuardAnswerer = (query: Query) => boolean;
type Submission = (g1: GuardAnswerer, g2: GuardAnswerer) => Direction;
interface Howjado {
  message: string,
  solved: boolean
}
interface Justarun {
  guards: Guard[],
  answer: Direction,
  guess: Direction
}

function makeGuard(name: string, strategy: Strategy, answer: Direction): Guard {
  return {
    name: name,
    answerer: (q) => {
      const truth = q(answer);
      if (strategy == "truther") return truth;
      else if (strategy == "liar") return !truth;
      else if (strategy == "random") return !!Math.floor(Math.random() + 1);
    }
  }
}

function howjado(results: Justarun[]): Howjado {
  let solved: boolean = true;
  let counter: Justarun = null
  for (let r of results) {
    const rSolved = (r.answer == r.guess);
    solved = solved && rSolved;
    if (!rSolved) {
      counter = r
    }
  }
  let message: string = "Good job!";
  if (!solved) {
    const guardnames = counter.guards.map((g) => g.name).join(", ");
    message = `Not quite right. Consider when the guards are ${guardnames} and the answer path is ${counter.answer}. In that case you guessed ${counter.guess}.`
  }
  return {
    message: message,
    solved: solved,
  }
}

function l1Engine(submission: Submission): Howjado {
  const results: Justarun[] = [];
  const options: Direction[] = ["left", "right"];
  for (let answer of options) {
    const a: Guard = makeGuard("Trubert", "truther", answer);
    const b: Guard = makeGuard("Liara", "liar", answer);
    for (let [g1, g2] of [[a,b],[b,a]]) {
      results.push({
        guards: [g1, g2],
        answer: answer,
        guess: submission(g1.answerer, g2.answerer)
      });
    }
  }

  return howjado(results);
}

interface Puzzle {
  name: string,
  description: string,
  engine: (submission: Submission) => Howjado,
  starterCode: string,
}

const puzzles: Puzzle[] = [{
  name: "2 Guards",
  description: "Ask one question to determine whether \"left\" or \"right\" is correct.",
  engine: l1Engine,
  starterCode: "function(guardA, guardB) {\n" +
    "    var query = function(direction) { return direction == \"left\"; }\n" +
    "    return guardA(query);\n" +
    "}",
}]

/*const submission: Submission = (a, b) => {
  // Excuse me, dearest A. What would you say if I asked you,
  // "is left the answer path?"
  return {"true": "left", "false": "right"}[String(a((_) => a((answer) => answer == "left")))];
}

const badSubmission: Submission = (a, b) => {
  return "left"
}*/

function setPuzzle(puzzle: Puzzle, confirm = false): void {
  const currentCode = document.getElementById('code').value;
  if (confirm && currentCode != "" && currentCode != currentPuzzle.starterCode) {
    if (!confirm("Clear out your current code?")) {
      console.log("Aborting setPuzzle.");
      return;
    }
  }
  document.getElementById('instructions').innerHTML = puzzle.description;
  document.getElementById('code').value = puzzle.starterCode;
  currentPuzzle = puzzle;
}

function evaluateIt(): void {
  document.getElementById('result').innerHTML = "";
  try {
    eval("submission[" + currentSubmission + "] = " +
         document.getElementById('code').value);
    document.getElementById('result').innerHTML =
        l1Engine(submission[currentSubmission]).message;
  } catch (ex) {
    document.getElementById('result').innerHTML = "<b>There was an error running your code." +
      " Here is the exception:</b><br>" + ex.message;
  } finally {
    currentSubmission++;
  }
}

/*function main(): void {
  document.getElementById('result').innerHTML = l1Engine(badSubmission).message;
}*/

//main();
let submission = {};
let currentPuzzle = puzzles[0];
let currentSubmission = 0;
setPuzzle(currentPuzzle);
