type Direction = "left" | "right";
type Strategy = "liar" | "truther" | "random";
type Query = (answer: Direction) => boolean;
interface Guard {
  name: string,
  answerer: GuardAnswerer
}
type GuardAnswerer = (query: Query) => boolean;
type Submission = (g1: GuardAnswerer, g2: GuardAnswerer) => Direction;
type Engine = (submission: Submission) => Howjado;
interface Howjado {
  message: string,
  solved: boolean
}
interface Justarun {
  guards: Guard[],
  snooper: Snooper,
  answer: Direction,
  allowed_tlqs: number,
  guess: Direction
}
class Snooper {
  public tlq: number;

  private level: number;

  constructor() {
    this.tlq = 0;
    this.level = 0;
  }

  wrap(g: Guard): GuardAnswerer {
    const snooper = this;
    return (q: Query) => {
      snooper.enter(g);
      const ret = g.answerer(q);
      snooper.exit(ret);
      return ret;
    }
  }

  enter(g: Guard) {
    console.log(`Enter ${this.level} ${g.name}`);
    if (this.level == 0) {
      this.tlq++;
    }
    this.level++;
  }

  exit(ret: boolean) {
    console.log(`Exit ${this.level} ${ret}`);
    this.level--;
  }
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
  // TODO special case when the answers are all exactly flipped. Because that's pretty close.

  for (let r of results) {
    const correct = (r.guess === r.answer);
    const legal = (r.snooper.tlq <= r.allowed_tlqs);
    if (!correct) {
      const guardnames = r.guards.map((g) => g.name).join(", ");
      const message = `Not quite right. Consider when the guards are ${guardnames} and the answer path is ${r.answer}. In that case you guessed ${r.guess}.`
      return {
        message: message,
        solved: false
      }
    }
    if (!legal) {
      const guardnames = r.guards.map((g) => g.name).join(", ");
      const message = `You asked too many questions. When the guards were ${guardnames} and the answer was ${r.answer} you asked ${r.snooper.tlq} questions. Only ${r.allowed_tlqs} questions are allowed.`
      return {
        message: message,
        solved: false
      }
    }
  }
  return {
    message: "Good job!",
    solved: true
  }
}

const l1Engine: Engine = function(submission: Submission): Howjado {
  const results: Justarun[] = [];
  const options: Direction[] = ["left", "right"];
  for (let answer of options) {
    const a: Guard = makeGuard("Trubert", "truther", answer);
    const b: Guard = makeGuard("Liara", "liar", answer);
    for (let [g1, g2] of [[a,b],[b,a]]) {
      const snooper: Snooper = new Snooper();
      results.push({
        guards: [g1, g2],
        answer: answer,
        snooper: snooper,
        allowed_tlqs: 1,
        guess: submission(snooper.wrap(g1), snooper.wrap(g2))
      });
    }
  }

  return howjado(results);
}

export interface Puzzle {
  name: string,
  description: string,
  engine: (submission: Submission) => Howjado,
  starterCode: string,
}

export const puzzles: Puzzle[] = [{
  name: "2 Guards",
  description: "Ask one question to determine whether \"left\" or \"right\" is correct.",
  engine: l1Engine,
  starterCode: `function(guardA, guardB) {
  var query = function(direction) { return direction == \"left\"; }
  return guardA(query) ? "left" : "right";
}`,
}]

/*const submission: Submission = (a, b) => {
  // Excuse me, dearest A. What would you say if I asked you,
  // "is left the answer path?"
  return {"true": "left", "false": "right"}[String(a((_) => a((answer) => answer == "left")))];
}

const badSubmission: Submission = (a, b) => {
  return "left"
}*/

export function evaluateIt(code: string): string {
  try {
    eval("submission[" + currentSubmission + "] = " + code);
    return l1Engine(submission[currentSubmission]).message;
  } catch (ex) {
    return "<b>There was an error running your code." +
      " Here is the exception:</b><br>" + ex.message;
  } finally {
    currentSubmission++;
  }
}

let submission = {};
let currentPuzzle = puzzles[0];
let currentSubmission = 0;
//setPuzzle(currentPuzzle);
