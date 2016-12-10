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
var DemoProps = (function () {
    function DemoProps() {
    }
    return DemoProps;
}());
var Demo = (function (_super) {
    __extends(Demo, _super);
    function Demo(props) {
        var _this = _super.call(this, props) || this;
        _this.foo = 42;
        return _this;
    }
    Demo.prototype.render = function () {
        return React.createElement("div", null,
            "Hello world! You are ",
            this.props.name,
            ".");
    };
    return Demo;
}(React.Component));
ReactDOM.render(React.createElement(Demo, { name: "Jess" }), document.getElementById('root'));
