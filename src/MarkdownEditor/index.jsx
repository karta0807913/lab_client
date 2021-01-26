import React from "react";
import marked from "marked";
import jQuery from "jquery";
import CodeMirror from "codemirror";
import "editor.md/lib/prettify.min.js";

import Editor from "editor.md/editormd.js";
import ImageDialog from "editor.md/plugins/image-dialog/image-dialog";
import CodeBlockDialog from "editor.md/plugins/code-block-dialog/code-block-dialog";

import { initTableEditor } from "./table-editor";

// this package have a bug
import "editor.md/scss/editormd.scss";
import "codemirror/lib/codemirror.css";

export default class MarkdownEditor extends React.Component {

  _editor_view = React.createRef();

  options = {
    width: "100%",
    height: "100%",
    codeFold: true,
    saveHTMLToTextarea: true,    // 保存 HTML 到 Textarea
    searchReplace: true,
    tocm: true,         // Using [TOCM]
    htmlDecode: "style,iframe",  // you can filter tags decode
    //watch : false,                // 关闭实时预览
    //toolbar  : false,             //关闭工具栏
    //previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
    emoji: true,
    taskList: true,
    tex: true,                   // 开启科学公式TeX语言支持，默认关闭
    // flowChart: true,             // 开启流程图支持，默认关闭
    // sequenceDiagram: true,       // 开启时序/序列图支持，默认关闭,
    imageUpload: true,
    imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
  }

  componentDidMount() {
    // init environment
    window.CodeMirror = CodeMirror;
    window.jQuery = jQuery;
    window.Zepto = {};
    window.marked = marked;

    // init class
    this._markdown = this.props.markdown;
    this.Editor = Editor();
    ImageDialog(this.Editor);
    CodeBlockDialog(this.Editor);
    this.toggleEditor(this.props.readOnly);
    if (!this.props.readOnly) {
      setTimeout(() => {
        this.editor.resize();
      }, 100);
    }
  }

  toggleEditor(readOnly = true) {
    this._editor_view.current.innerHTML = `
        <textarea style="display: none">
        </textarea>`;
    this._editor_view.current.className = this.props.className;

    if (readOnly) {
      if (this.editor) {
        this._markdown = this.editor.getMarkdown();
      }
      this.editor = this.Editor.markdownToHTML("editor", {
        ...this.options,
        markdown: this._markdown,
      });
    } else {
      this.editor = this.Editor("editor", {
        ...this.options,
        markdown: this._markdown,
      });

      initTableEditor(this.editor.cm);

      // refresh previewer
      this.editor.unwatch();
      this.editor.watch();
    }
  }

  reset() {
    this._markdown = this.props.markdown;
  }

  getMarkdown() {
    if (this.props.readOnly) {
      return this._markdown;
    } else {
      return this.editor.getMarkdown();
    }
  }

  getHTML() {
    if (this.props.readOnly) {
      return this.editor.HTML();
    } else {
      return this.editor.getHTML();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState && nextState.markdown !== this.props.markdown) {
      this._markdown = nextState.markdown;
    }
    if (nextProps && this.props.readOnly !== nextProps.readOnly) {
      this.toggleEditor(nextProps.readOnly);
    }
    // force react don't update the view
    return false;
  }

  render() {
    // please check toggleEditor for more information
    return (
      <html>
        <div id="editor" ref={this._editor_view}>
        </div>
      </html>
    );
  }
}
