/// <reference path="typing/react.d.ts" />
/// <reference path="typing/react-dom.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as tingy from './tingy';

const Tingy = React.createClass({
  getInitialState: function() {return {
    currentPuzzle: tingy.puzzles[0],
    code: tingy.puzzles[0].starterCode,
    submissions: {},
    currentSubmission: 0,
  }},
  render: function () {
    let result = tingy.evaluateIt(this.state.code);
    return (<div>
      <p>{this.state.currentPuzzle.description}</p>
      <p>Ask a guard a question by passing them a function that takes the correct path
      (either "left" or "right") and returns a boolean. The guard will evaluate your
      query, taking the correct path into consideration, and return you an answer depending
      on the guard\'s own disposition.</p>
      <textarea value={this.state.code} onChange={this.changeCode}  cols={80} rows={6} />
      <br /><br />
      <button>Try it</button>
      <button onClick={this.reset}>Reset</button>
      <p>{result}</p>
    </div>);
  },
  changeCode: function(event) {
    this.setState({code: (event.target as any).value});
  },
  reset: function() {
    this.setState({code: this.state.currentPuzzle.starterCode, result: ""});
  },
});

ReactDOM.render(
  <Tingy />,
  document.getElementById('root')
);
