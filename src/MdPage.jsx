import React from "react";
import md from "./md";
import Editor from "./editor";
// import CodeMirror from "codemirror";

export default class MdPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    // this._input = React.createRef();
    // this.editor = new Editor();
  }
  componentDidMount() {
    // this.setState({ data: md.render("### HI") });
    // this._input.current.value = "AAAAAAAAAAAAAAAAAAAAAAAAA";
    // this.editor.init(this._input.current);
    // this.editor.addStatusBar();
    // this.editor.addToolBar();
    // this.editor.updateStatusBar();
    // this.editor.editor.setOption('foldGutter', false);
    // this.editor.editor.setOption('foldGutter', true);
    // this.editor.editor.setOption('scrollbarStyle', "native");
    // // CodeMirror.fromTextArea(this._input.current);
    // console.log(Editor);
    // console.log(this.editor);
  }

  render() {
    return (
      <Editor />
    );
  }
}