"use strict";
function makeGuard(name, strategy, answer) {
    return {
        name: name,
        answerer: function (q) {
            var truth = q(answer);
            if (strategy == "truther")
                return truth;
            else if (strategy == "liar")
                return !truth;
            else if (strategy == "random")
                return !!Math.floor(Math.random() + 1);
        }
    };
}
function howjado(results) {
    var solved = true;
    var counter = null;
    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
        var r = results_1[_i];
        var rSolved = (r.answer == r.guess);
        solved = solved && rSolved;
        if (!rSolved) {
            counter = r;
        }
    }
    var message = "Good job!";
    if (!solved) {
        var guardnames = counter.guards.map(function (g) { return g.name; }).join(", ");
        message = "Not quite right. Consider when the guards are " + guardnames + " and the answer path is " + counter.answer + ". In that case you guessed " + counter.guess + ".";
    }
    return {
        message: message,
        solved: solved
    };
}
function l1Engine(submission) {
    var results = [];
    var options = ["left", "right"];
    for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
        var answer = options_1[_i];
        var a = makeGuard("Trubert", "truther", answer);
        var b = makeGuard("Liara", "liar", answer);
        for (var _a = 0, _b = [[a, b], [b, a]]; _a < _b.length; _a++) {
            var _c = _b[_a], g1 = _c[0], g2 = _c[1];
            results.push({
                guards: [g1, g2],
                answer: answer,
                guess: submission(g1.answerer, g2.answerer)
            });
        }
    }
    return howjado(results);
}
exports.puzzles = [{
        name: "2 Guards",
        description: "Ask one question to determine whether \"left\" or \"right\" is correct.",
        engine: l1Engine,
        starterCode: "function(guardA, guardB) {\n" +
            "    var query = function(direction) { return direction == \"left\"; }\n" +
            "    return guardA(query);\n" +
            "}"
    }];
/*const submission: Submission = (a, b) => {
  // Excuse me, dearest A. What would you say if I asked you,
  // "is left the answer path?"
  return {"true": "left", "false": "right"}[String(a((_) => a((answer) => answer == "left")))];
}

const badSubmission: Submission = (a, b) => {
  return "left"
}*/
function evaluateIt(code) {
    try {
        eval("submission[" + currentSubmission + "] = " + code);
        return l1Engine(submission[currentSubmission]).message;
    }
    catch (ex) {
        return "<b>There was an error running your code." +
            " Here is the exception:</b><br>" + ex.message;
    }
    finally {
        currentSubmission++;
    }
}
exports.evaluateIt = evaluateIt;
var submission = {};
var currentPuzzle = exports.puzzles[0];
var currentSubmission = 0;
//setPuzzle(currentPuzzle);
