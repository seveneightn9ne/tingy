/// <reference path="typing/react.d.ts" />
/// <reference path="typing/react-dom.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ReactDOM = require("react-dom");
var tingy = require("./tingy");
var CodeMirror = require("react-codemirror");
require("codemirror/mode/javascript/javascript");
var Tingy = React.createClass({
    getInitialState: function () {
        return {
            currentPuzzle: tingy.puzzles[0],
            code: tingy.puzzles[0].starterCode,
            submissions: {},
            currentSubmission: 0
        };
    },
    render: function () {
        var result = tingy.evaluateIt(this.state.code);
        var ed_options = {
            lineNumbers: true,
            readOnly: false,
            mode: "javascript",
            theme: "solarized dark"
        };
        return (React.createElement("div", null,
            React.createElement("p", null, this.state.currentPuzzle.description),
            React.createElement("p", null, "Ask a guard a question by passing them a function that takes the correct path" + " " + "(either \"left\" or \"right\") and returns a boolean. The guard will evaluate your" + " " + "query, taking the correct path into consideration, and return you an answer depending" + " " + "on the guard\\'s own disposition."),
            React.createElement(CodeMirror, { value: this.state.code, onChange: this.changeCode2, options: ed_options }),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement("button", null, "Try it"),
            React.createElement("button", { onClick: this.reset }, "Reset"),
            React.createElement(Result, { result: result })));
    },
    changeCode: function (event) {
        this.setState({ code: event.target.value });
    },
    changeCode2: function (new_code) {
        this.setState({ code: new_code });
    },
    reset: function () {
        this.setState({ code: this.state.currentPuzzle.starterCode, result: "" });
    }
});
;
;
var Result = (function (_super) {
    __extends(Result, _super);
    function Result() {
        return _super.apply(this, arguments) || this;
    }
    Result.prototype.render = function () {
        if (this.props.result === null) {
            return;
        }
        else {
            return (React.createElement("pre", null, this.props.result.message));
        }
    };
    return Result;
}(React.Component));
;
ReactDOM.render(React.createElement(Tingy, null), document.getElementById('root'));
