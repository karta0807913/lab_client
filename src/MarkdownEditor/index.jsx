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

  componentDidMount() {
    window.CodeMirror = CodeMirror;
    window.jQuery = jQuery;
    window.Zepto = {};
    window.marked = marked;

    this.editor = Editor();
    ImageDialog(this.editor);
    CodeBlockDialog(this.editor);
    if (this.props.readOnly) {

      console.log(this.props.markdown);
      this.editor = this.editor.markdownToHTML("editor", {
        markdown: this.props.markdown,
        htmlDecode: "style,script,iframe",  // you can filter tags decode
        //toc             : false,
        tocm: true,    // Using [TOCM]
        emoji: true,
        taskList: true,
        tex: true,  // 默认不解析
      });
    } else {
      this.editor = this.editor("editor", {
        width: "100%",
        height: "100%",
        codeFold: true,
        saveHTMLToTextarea: true,    // 保存 HTML 到 Textarea
        searchReplace: true,
        tocm: true,         // Using [TOCM]
        markdown: this.props.markdown,
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
      });

      initTableEditor(this.editor.cm);
      setTimeout(() => {
        this.editor.resize();
      }, 100);
    }
  }

  getMarkdown() {
    return this.editor.getMarkdown();
  }

  getHTML() {
    return this.editor.getHTML();
  }

  render() {
    return (
      <div id="editor">
        <textarea style={{ display: "none" }}>
        </textarea>
      </div>
    );
  }
}
