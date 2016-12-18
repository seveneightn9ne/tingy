"use strict";
var Snooper = (function () {
    function Snooper() {
        this.tlq = 0;
        this.level = 0;
    }
    Snooper.prototype.wrap = function (g) {
        var snooper = this;
        return function (q) {
            snooper.enter(g);
            var ret = g.answerer(q);
            snooper.exit(ret);
            return ret;
        };
    };
    Snooper.prototype.enter = function (g) {
        // console.log(`Enter ${this.level} ${g.name}`);
        if (this.level == 0) {
            this.tlq++;
        }
        this.level++;
    };
    Snooper.prototype.exit = function (ret) {
        // console.log(`Exit ${this.level} ${ret}`);
        this.level--;
    };
    return Snooper;
}());
function makeGuard(name, strategy, answer) {
    return {
        name: name,
        answerer: function (q) {
            var truth = q(answer);
            if (typeof (truth) !== "boolean") {
                throw new Error("Guard " + name + " was asked a non-boolean question");
            }
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
    // TODO special case when the answers are all exactly flipped. Because that's pretty close.
    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
        var r = results_1[_i];
        if (r.error !== null) {
            var guardnames = r.guards.map(function (g) { return g.name; }).join(", ");
            var message = "You threw an exception when the guards were " + guardnames + " and the answer path was " + r.answer + ". " + r.error;
            return {
                message: message,
                solved: false
            };
        }
        var correct = (r.guess === r.answer);
        var legal = (r.snooper.tlq <= r.allowed_tlqs);
        if (!correct) {
            var guardnames = r.guards.map(function (g) { return g.name; }).join(", ");
            var message = "Not quite right. Consider when the guards are " + guardnames + " and the answer path is " + r.answer + ". In that case you guessed " + r.guess + ".";
            return {
                message: message,
                solved: false
            };
        }
        if (!legal) {
            var guardnames = r.guards.map(function (g) { return g.name; }).join(", ");
            var message = "You asked too many questions. When the guards were " + guardnames + " and the answer was " + r.answer + " you asked " + r.snooper.tlq + " questions. Only " + r.allowed_tlqs + " questions are allowed.";
            return {
                message: message,
                solved: false
            };
        }
    }
    return {
        message: "Good job!",
        solved: true
    };
}
var l1Engine = function (submission) {
    var results = [];
    var options = ["left", "right"];
    for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
        var answer = options_1[_i];
        var a = makeGuard("Trubert", "truther", answer);
        var b = makeGuard("Liara", "liar", answer);
        for (var _a = 0, _b = [[a, b], [b, a]]; _a < _b.length; _a++) {
            var _c = _b[_a], g1 = _c[0], g2 = _c[1];
            var snooper = new Snooper();
            var guess = null;
            var error = null;
            try {
                guess = submission(snooper.wrap(g1), snooper.wrap(g2));
            }
            catch (ex) {
                error = ex;
            }
            results.push({
                guards: [g1, g2],
                answer: answer,
                snooper: snooper,
                allowed_tlqs: 1,
                guess: guess,
                error: error
            });
        }
    }
    return howjado(results);
};
exports.puzzles = [{
        name: "2 Guards",
        description: "Ask one question to determine whether \"left\" or \"right\" is correct.",
        engine: l1Engine,
        starterCode: "function(guardA, guardB) {\n  var query = function(direction) { return direction == \"left\"; }\n  return guardA(query) ? \"left\" : \"right\";\n}"
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
        return l1Engine(submission[currentSubmission]);
    }
    catch (ex) {
        return {
            message: ex.name + ": " + ex.message,
            solved: false
        };
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
