/// <reference path="typing/react.d.ts" />
/// <reference path="typing/react-dom.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

class DemoProps {
  public name:string;
}

class Demo extends React.Component<DemoProps, any> {
  private foo:number;
  constructor(props:DemoProps) {
    super(props);
    this.foo = 42;
  }
  render() {
    return <div>Hello world! You are {this.props.name}.</div>
  }
}

ReactDOM.render(
  <Demo name="Jess" />,
  document.getElementById('root')
);
