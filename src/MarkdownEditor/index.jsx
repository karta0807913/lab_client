import React from "react";
import marked from "marked";
import jQuery from "jquery";
import CodeMirror from "codemirror";
import "editor.md/lib/prettify.min.js";

import style from "./style.module.scss";

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
    this.toggleEditor(!!this.props.readOnly);
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
    this._editor_view.current.style = "";

    if (readOnly) {
      if (this.editor) {
        this._markdown = this.editor.getMarkdown();
      }
      this.Editor.markdownToHTML("editor", {
        ...this.options,
        markdown: this._markdown,
      });
      this.editor = null;
    } else {
      this.editor = this.Editor("editor", {
        ...this.options,
        markdown: this._markdown,
      });

      initTableEditor(this.editor.cm);

      setTimeout(() => {
        this.editor.resize();
      }, 100);

      // refresh previewer
      this.editor.unwatch();
      this.editor.watch();
    }
  }

  reset() {
    this.editor.cm.setValue(this._markdown);
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

  lock() {
    this.editor.hideToolbar();
    this.editor.cm.setOption("readOnly", true);
  }

  resume() {
    this.editor.showToolbar();
    this.editor.cm.setOption("readOnly", false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let update_flag = false;
    let readOnly = this.props.readOnly;
    if (nextProps && this.props.readOnly !== nextProps.readOnly) {
      readOnly = nextProps.readOnly;
      update_flag = true;
    }
    if (nextProps && nextProps.markdown !== this.props.markdown) {
      console.log("markdown changed...");
      if (this.props.readOnly) {
        this._markdown = nextProps.markdown;
      } else {
        this.editor.cm.setValue(nextProps.markdown);
      }
      update_flag = true;
    }
    if (update_flag) {
      this.toggleEditor(!!readOnly);
    }
    // force react don't update the view
    return false;
  }

  render() {
    // please check toggleEditor for more information
    return (
      <main className={style.main}>
        <div className={style.editor} id="editor" ref={this._editor_view}>
        </div>
      </main>
    );
  }
}
