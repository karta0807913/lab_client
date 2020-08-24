import React from "react";
import * as utils from './utils';
import { options, Alignment, FormatType } from '@susisu/mte-kernel';
import { initTableEditor } from './table-editor';

export default class ToolBar extends React.Component {
  constructor(props) {
    super(props);
    this._makeBold = React.createRef();
    this._makeItalic = React.createRef();
    this._makeStrike = React.createRef();
    this._makeHeader = React.createRef();
    this._makeCode = React.createRef();
    this._makeQuote = React.createRef();
    this._makeGenericList = React.createRef();
    this._makeOrderedList = React.createRef();
    this._makeCheckList = React.createRef();
    this._makeLink = React.createRef();
    this._makeImage = React.createRef();
    this._makeTable = React.createRef();
    this._makeLine = React.createRef();
    this._makeComment = React.createRef();

    this._insertRow = React.createRef();
    this._deleteRow = React.createRef();
    this._moveRowUp = React.createRef();
    this._moveRowDown = React.createRef();
    this._insertColumn = React.createRef();
    this._deleteColumn = React.createRef();
    this._moveColumnLeft = React.createRef();
    this._moveColumnRight = React.createRef();
    this._alignLeft = React.createRef();
    this._alignCenter = React.createRef();
    this._alignRight = React.createRef();
    this._alignNone = React.createRef();
    this._opts = options({
      smartCursor: true,
      formatType: FormatType.NORMAL
    });
    this.tableEditor = null;
  }

  componentDidUpdate() {
    if (this.props.editor && !this.tableEditor) {
      this.tableEditor = initTableEditor(this.props.editor);
    }
  }

  makeBold() {
    utils.wrapTextWith(this.props.editor, this.props.editor, '**');
    this.props.editor.focus();
  }

  makeItalic() {
    utils.wrapTextWith(this.props.editor, this.props.editor, '*');
    this.props.editor.focus();
  }

  makeStrike() {
    utils.wrapTextWith(this.props.editor, this.props.editor, '~~');
    this.props.editor.focus();
  }

  makeHeader() {
    utils.insertHeader(this.props.editor);
  }

  makeCode() {
    utils.wrapTextWith(this.props.editor, this.props.editor, '```');
    this.props.editor.focus();
  }

  makeQuote() {
    utils.insertOnStartOfLines(this.props.editor, '> ');
  }

  makeGenericList() {
    utils.insertOnStartOfLines(this.props.editor, '* ');
  }

  makeOrderedList() {
    utils.insertOnStartOfLines(this.props.editor, '1. ');
  }

  makeCheckList() {
    utils.insertOnStartOfLines(this.props.editor, '- [ ] ');
  }

  makeLink() {
    utils.insertLink(this.props.editor, false);
  }

  makeImage() {
    utils.insertLink(this.props.editor, true);
  }

  makeTable() {
    utils.insertText(this.props.editor, '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n');
  }

  makeLine() {
    utils.insertText(this.props.editor, '\n----\n');
  }

  makeComment() {
    utils.insertText(this.props.editor, '> []');
  }


  insertRow() {
    this.tableEditor.insertRow(this._opts);
    this.props.editor.focus();
  }

  deleteRow() {
    this.tableEditor.deleteRow(this._opts);
    this.props.editor.focus();
  }

  moveRowUp() {
    this.tableEditor.moveRow(-1, this._opts);
    this.props.editor.focus();
  }

  moveRowDown() {
    this.tableEditor.moveRow(1, this._opts);
    this.props.editor.focus();
  }

  insertColumn() {
    this.tableEditor.insertColumn(this._opts);
    this.props.editor.focus();
  }

  deleteColumn() {
    this.tableEditor.deleteColumn(this._opts);
    this.props.editor.focus();
  }

  moveColumnLeft() {
    this.tableEditor.moveColumn(-1, this._opts);
    this.props.editor.focus();
  }

  moveColumnRight() {
    this.tableEditor.moveColumn(1, this._opts);
    this.props.editor.focus();
  }

  alignLeft() {
    this.tableEditor.alignColumn(Alignment.LEFT, this._opts);
    this.props.editor.focus();
  }

  alignCenter() {
    this.tableEditor.alignColumn(Alignment.CENTER, this._opts);
    this.props.editor.focus();
  }

  alignRight() {
    this.tableEditor.alignColumn(Alignment.RIGHT, this._opts);
    this.props.editor.focus();
  }

  alignNone() {
    this.tableEditor.alignColumn(Alignment.NONE, this._opts);
    this.props.editor.focus();
  }

  render() {
    if (!this.props.editor) {
      return null;
    }
    return (
      <div className={`toolbar ${this.props.className || ""}`} >
        <div className="btn-toolbar" role="toolbar" aria-label="Editor toolbar">
          <div className="btn-group" role="group">
            <a ref={this._makeBold} onClick={() => this.makeBold()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Bold">
              <i className="fa fa-bold fa-fw"></i>
            </a>
            <a ref={this._makeItalic} onClick={() => this.makeItalic()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Italic">
              <i className="fa fa-italic fa-fw"></i>
            </a>
            <a ref={this._makeStrike} onClick={() => this.makeStrike()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Strikethrough">
              <i className="fa fa-strikethrough fa-fw"></i>
            </a>
            <a ref={this._makeHeader} onClick={() => this.makeHeader()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Heading">
              <i className="fa fa-h1 fa-fw">H</i>
            </a>
            <a ref={this._makeCode} onClick={() => this.makeCode()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Code">
              <i className="fa fa-code fa-fw"></i>
            </a>
            <a ref={this._makeQuote} onClick={() => this.makeQuote()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Quote">
              <i className="fa fa-quote-right fa-fw"></i>
            </a>
            <a ref={this._makeGenericList} onClick={() => this.makeGenericList()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="List">
              <i className="fa fa-list fa-fw"></i>
            </a>
            <a ref={this._makeOrderedList} onClick={() => this.makeOrderedList()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Numbered List">
              <i className="fa fa-list-ol fa-fw"></i>
            </a>
            <a ref={this._makeCheckList} onClick={() => this.makeCheckList()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Check List">
              <i className="fa fa-check-square fa-fw"></i>
            </a>
            <a ref={this._makeLink} onClick={() => this.makeLink()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Link">
              <i className="fa fa-link fa-fw"></i>
            </a>
            <a ref={this._makeImage} onClick={() => this.makeImage()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Image">
              <i className="fa fa-image fa-fw"></i>
            </a>
            <a ref={this._makeTable} onClick={() => this.makeTable()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Table">
              <i className="fa fa-table fa-fw"></i>
            </a>
            <a ref={this._makeLine} onClick={() => this.makeLine()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Line">
              <i className="fa fa-minus fa-fw"></i>
            </a>
            <a ref={this._makeComment} onClick={() => this.makeComment()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Comment">
              <i className="fa fa-comment fa-fw"></i>
            </a>
          </div>
          <span className="btn-group table-tools hidden-xs" style={{ "display": "none" }}>
            <span className="separator" style={{ "margin-left": "-10px" }}>|</span>
            <span>Row</span>
            <a ref={this._insertRow} onClick={() => this.insertRow()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Insert Row">
              <i className="fa fa-plus-circle fa-fw"></i>
            </a>
            <a ref={this._deleteRow} onClick={() => this.deleteRow()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Delete Row">
              <i className="fa fa-minus-circle fa-fw"></i>
            </a>
            <a ref={this._moveRowUp} onClick={() => this.moveRowUp()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Move Row Up">
              <i className="fa fa-long-arrow-up fa-fw"></i>
            </a>
            <a ref={this._moveRowDown} onClick={() => this.moveRowDown()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Move Row Down">
              <i className="fa fa-long-arrow-down fa-fw"></i>
            </a>
            <span>Column</span>
            <a ref={this._insertColumn} onClick={() => this.insertColumn()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Insert Column">
              <i className="fa fa-plus-circle fa-fw"></i>
            </a>
            <a ref={this._deleteColumn} onClick={() => this.deleteColumn()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Delete Column">
              <i className="fa fa-minus-circle fa-fw"></i>
            </a>
            <a ref={this._moveColumnLeft} onClick={() => this.moveColumnLeft()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Move Column Left">
              <i className="fa fa-long-arrow-left fa-fw"></i>
            </a>
            <a ref={this._moveColumnRight} onClick={() => this.moveColumnRight()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Move Column Right">
              <i className="fa fa-long-arrow-right fa-fw"></i>
            </a>
            <span>Alignment</span>
            <a ref={this._alignLeft} onClick={() => this.alignLeft()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Align Left">
              <i className="fa fa-align-left fa-fw"></i>
            </a>
            <a ref={this._alignCenter} onClick={() => this.alignCenter()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Align Center">
              <i className="fa fa-align-center fa-fw"></i>
            </a>
            <a ref={this._alignRight} onClick={() => this.alignRight()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Align Right">
              <i className="fa fa-align-right fa-fw"></i>
            </a>
            <a ref={this._alignNone} onClick={() => this.alignNone()} className="btn btn-sm btn-dark text-uppercase" data-toggle="" role="button" aria-haspopup="true" aria-expanded="false" title="Align None">
              <i className="fa fa-ban fa-fw"></i>
            </a>
          </span>
        </div>
      </div>
    );
  }
}