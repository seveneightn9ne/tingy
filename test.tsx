/// <reference path="typing/react.d.ts" />
/// <reference path="typing/react-dom.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as tingy from './tingy';
import * as CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';

const Tingy = React.createClass({
  getInitialState: function() {return {
    currentPuzzle: tingy.puzzles[0],
    code: tingy.puzzles[0].starterCode,
    submissions: {},
    currentSubmission: 0,
  }},
  render: function () {
    const result = tingy.evaluateIt(this.state.code);
    const ed_options = {
      lineNumbers: true,
      readOnly: false,
      mode: "javascript",
      theme: "solarized dark"
    };

    return (<div>
      <p>{this.state.currentPuzzle.description}</p>
      <p>Ask a guard a question by passing them a function that takes the correct path
      (either "left" or "right") and returns a boolean. The guard will evaluate your
      query, taking the correct path into consideration, and return you an answer depending
      on the guard\'s own disposition.</p>
      <CodeMirror value={this.state.code} onChange={this.changeCode2} options={ed_options} />
      <br /><br />
      <button>Try it</button>
      <button onClick={this.reset}>Reset</button>
      <Result result={result} />
    </div>);
  },
  changeCode: function(event) {
    this.setState({code: (event.target as any).value});
  },
  changeCode2: function(new_code) {
    this.setState({code: new_code});
  },
  reset: function() {
    this.setState({code: this.state.currentPuzzle.starterCode, result: ""});
  },
});

interface ResultProps {
  result: tingy.Howjado | null,
};

interface ResultState {};

class Result extends React.Component<ResultProps, ResultState> {
  render() {
    if (this.props.result === null) {
      return;
    } else {
      return (<pre>{this.props.result.message}</pre>);
    }
  }
};

ReactDOM.render(
  <Tingy />,
  document.getElementById('root')
);

