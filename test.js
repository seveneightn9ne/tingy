/// <reference path="typing/react.d.ts" />
/// <reference path="typing/react-dom.d.ts" />
"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var tingy = require("./tingy");
var Tingy = React.createClass({
    getInitialState: function () {
        return {
            currentPuzzle: tingy.puzzles[0],
            code: tingy.puzzles[0].starterCode,
            result: "",
            submissions: {},
            currentSubmission: 0
        };
    },
    render: function () {
        console.log(this.state);
        return (React.createElement("div", null,
            React.createElement("p", null, this.state.currentPuzzle.description),
            React.createElement("p", null, "Ask a guard a question by passing them a function that takes the correct path" + " " + "(either \"left\" or \"right\") and returns a boolean. The guard will evaluate your" + " " + "query, taking the correct path into consideration, and return you an answer depending" + " " + "on the guard's own disposition."),
            React.createElement("textarea", { value: this.state.code, onChange: this.changeCode, cols: 80, rows: 6 }),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement("button", { onClick: this.tryIt }, "Try it"),
            React.createElement("button", { onClick: this.reset }, "Reset"),
            React.createElement("p", null, this.state.result)));
    },
    changeCode: function (event) {
        console.log("hi");
        console.log(event.target.value);
        this.setState({ code: event.target.value });
    },
    tryIt: function () {
        this.setState({ result: tingy.evaluateIt(this.state.code) });
    },
    reset: function () {
        this.setState({ code: this.state.currentPuzzle.starterCode, result: "" });
    }
});
ReactDOM.render(React.createElement(Tingy, null), document.getElementById('root'));
