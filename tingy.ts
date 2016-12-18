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
export interface Howjado {
  message: string,
  solved: boolean
}
interface SingleRun {
  guards: Guard[],
  snooper: Snooper,
  answer: Direction,
  allowed_tlqs: number,
  guess: Direction,
  error: Error,
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
    // console.log(`Enter ${this.level} ${g.name}`);
    if (this.level == 0) {
      this.tlq++;
    }
    this.level++;
  }

  exit(ret: boolean) {
    // console.log(`Exit ${this.level} ${ret}`);
    this.level--;
  }
}

function makeGuard(name: string, strategy: Strategy, answer: Direction): Guard {
  return {
    name: name,
    answerer: (q) => {
      const truth = q(answer);

      if (typeof(truth) !== "boolean") {
        throw new Error(`Guard ${name} was asked a non-boolean question`);
      }

      if (strategy == "truther") return truth;
      else if (strategy == "liar") return !truth;
      else if (strategy == "random") return !!Math.floor(Math.random() + 1);
    }
  }
}

function howjado(results: SingleRun[]): Howjado {
  // TODO special case when the answers are all exactly flipped. Because that's pretty close.

  for (let r of results) {
    if (r.error !== null) {
      const guardnames = r.guards.map((g) => g.name).join(", ");
      const message = `You threw an exception when the guards were ${guardnames} and the answer path was ${r.answer}. ${r.error}`
      return {
        message: message,
        solved: false,
      }
    }
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
  const results: SingleRun[] = [];
  const options: Direction[] = ["left", "right"];
  for (let answer of options) {
    const a: Guard = makeGuard("Trubert", "truther", answer);
    const b: Guard = makeGuard("Liara", "liar", answer);
    for (let [g1, g2] of [[a,b],[b,a]]) {
      const snooper: Snooper = new Snooper();
      let guess: Direction = null
      let error: Error = null
      try {
        guess = submission(snooper.wrap(g1), snooper.wrap(g2))
      } catch (ex) {
        error = ex
      }
      results.push({
        guards: [g1, g2],
        answer: answer,
        snooper: snooper,
        allowed_tlqs: 1,
        guess: guess,
        error: error,
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

export function evaluateIt(code: string): Howjado {
  try {
    eval("submission[" + currentSubmission + "] = " + code);
    return l1Engine(submission[currentSubmission]);
  } catch (ex) {
    return {
      message: `${ex.name}: ${ex.message}`,
      solved: false,
    }
  } finally {
    currentSubmission++;
  }
}

let submission = {};
let currentPuzzle = puzzles[0];
let currentSubmission = 0;
//setPuzzle(currentPuzzle);
