/* global CodeMirror, $, editor, Cookies */
import React from "react";
import ToolBar from "./toolbar";
import StatusBar from "./statusbar";
import CodeMirror from "@hackmd/codemirror/lib/codemirror";
import "./lib/codemirror";
import "./index.css";
import Cookies from "js-cookie";
import $ from "jquery";
import { options, Alignment, FormatType } from '@susisu/mte-kernel';
import debounce from 'lodash/debounce';

import * as utils from './utils';
import config from './config';
import './markdown-lint';
import CodeMirrorSpellChecker, { supportLanguages, supportLanguageCodes } from './spellcheck';
import { initTableEditor } from './table-editor';
import { availableThemes } from './constants';

/* config section */
const isMac = CodeMirror.keyMap.default === CodeMirror.keyMap.macDefault;
const defaultEditorMode = 'gfm';
const viewportMargin = 20;

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: null
    };
    this._textaria = React.createRef();
    this._stausbar = React.createRef();
    this.editor = null;
    this.defaultExtraKeys = {
      F10: function(cm) {
        cm.setOption('fullScreen', !cm.getOption('fullScreen'));
      },
      Esc: function(cm) {
        if (cm.getOption('fullScreen') && !(cm.getOption('keyMap').substr(0, 3) === 'vim')) {
          cm.setOption('fullScreen', false);
        } else {
          return CodeMirror.Pass;
        }
      },
      'Cmd-S': function() {
        return false;
      },
      'Ctrl-S': function() {
        return false;
      },
      Enter: 'newlineAndIndentContinueMarkdownList',
      Tab: function(cm) {
        var tab = '\t';

        // contruct x length spaces
        var spaces = Array(parseInt(cm.getOption('indentUnit')) + 1).join(' ');

        // auto indent whole line when in list or blockquote
        var cursor = cm.getCursor();
        var line = cm.getLine(cursor.line);

        // this regex match the following patterns
        // 1. blockquote starts with "> " or ">>"
        // 2. unorder list starts with *+-
        // 3. order list starts with "1." or "1)"
        var regex = /^(\s*)(>[> ]*|[*+-]\s|(\d+)([.)]))/;

        var match;
        var multiple = cm.getSelection().split('\n').length > 1 ||
          cm.getSelections().length > 1;

        if (multiple) {
          cm.execCommand('defaultTab');
        } else if ((match = regex.exec(line)) !== null) {
          var ch = match[1].length;
          var pos = {
            line: cursor.line,
            ch: ch
          };
          if (cm.getOption('indentWithTabs')) {
            cm.replaceRange(tab, pos, pos, '+input');
          } else {
            cm.replaceRange(spaces, pos, pos, '+input');
          }
        } else {
          if (cm.getOption('indentWithTabs')) {
            cm.execCommand('defaultTab');
          } else {
            cm.replaceSelection(spaces);
          }
        }
      },
      'Cmd-Left': 'goLineLeftSmart',
      'Cmd-Right': 'goLineRight',
      Home: 'goLineLeftSmart',
      End: 'goLineRight',
      'Ctrl-C': function(cm) {
        if (!isMac && cm.getOption('keyMap').substr(0, 3) === 'vim') {
          document.execCommand('copy');
        } else {
          return CodeMirror.Pass;
        }
      },
      'Ctrl-*': cm => {
        utils.wrapTextWith(this.editor, cm, '*');
      },
      'Shift-Ctrl-8': cm => {
        utils.wrapTextWith(this.editor, cm, '*');
      },
      'Ctrl-_': cm => {
        utils.wrapTextWith(this.editor, cm, '_');
      },
      'Shift-Ctrl--': cm => {
        utils.wrapTextWith(this.editor, cm, '_');
      },
      'Ctrl-~': cm => {
        utils.wrapTextWith(this.editor, cm, '~');
      },
      'Shift-Ctrl-`': cm => {
        utils.wrapTextWith(this.editor, cm, '~');
      },
      'Ctrl-^': cm => {
        utils.wrapTextWith(this.editor, cm, '^');
      },
      'Shift-Ctrl-6': cm => {
        utils.wrapTextWith(this.editor, cm, '^');
      },
      'Ctrl-+': cm => {
        utils.wrapTextWith(this.editor, cm, '+');
      },
      'Shift-Ctrl-=': cm => {
        utils.wrapTextWith(this.editor, cm, '+');
      },
      'Ctrl-=': cm => {
        utils.wrapTextWith(this.editor, cm, '=');
      },
      'Shift-Ctrl-Backspace': cm => {
        utils.wrapTextWith(this.editor, cm, 'Backspace');
      }
    };
    this.eventListeners = {};
    this.config = config;

    // define modes from mode mime
    const ignoreOverlay = {
      token: function(stream, state) {
        stream.next();
        return null;
      }
    };

    CodeMirror.defineMode('vega', function(config, modeConfig) {
      return CodeMirror.overlayMode(CodeMirror.getMode(config, 'application/ld+json'), ignoreOverlay);
    });

    CodeMirror.defineMode('markmap', function(config, modeConfig) {
      return CodeMirror.overlayMode(CodeMirror.getMode(config, 'gfm'), ignoreOverlay);
    });
  }

  on(event, cb) {
    this.editor.on(event, (...args) => {
      cb(...args);
    });
  }

  init(textit) {
    this.editor = CodeMirror.fromTextArea(textit, {
      mode: defaultEditorMode,
      backdrop: defaultEditorMode,
      keyMap: 'sublime',
      viewportMargin: viewportMargin,
      styleActiveLine: true,
      lineNumbers: true,
      lineWrapping: true,
      showCursorWhenSelecting: true,
      highlightSelectionMatches: true,
      indentUnit: 4,
      continueComments: 'Enter',
      theme: 'one-dark',
      inputStyle: 'textarea',
      matchBrackets: true,
      autoCloseBrackets: true,
      matchTags: {
        bothTags: true
      },
      autoCloseTags: true,
      foldGutter: true,
      gutters: [
        'CodeMirror-linenumbers',
        'authorship-gutters',
        'CodeMirror-foldgutter'
      ],
      extraKeys: this.defaultExtraKeys,
      flattenSpans: true,
      addModeClass: true,
      readOnly: false,
      autoRefresh: true,
      otherCursors: true,
      placeholder: "← Start by entering a title here\n===\nVisit /features if you don't know what to do.\nHappy hacking :)"
    });

    this.spellchecker = new CodeMirrorSpellChecker(CodeMirror, this._stausbar.current.getExistingSpellcheckLang(), this.editor);
    this.tableEditor = initTableEditor(this.editor);

    return this.editor;
  }

  getEditor() {
    return this.editor;
  }

  componentDidMount() {
    this.init(this._textaria.current);
    this.setState({ editor: this.editor });
  }

  render() {
    return (
      <div>
        <ToolBar editor={this.state.editor} />
        <input type="textarea" ref={this._textaria} />
        <StatusBar
          editor={this.state.editor}
          defaultEditorMode={defaultEditorMode}
          ref={this._stausbar}
        />
      </div>
    );
  }
}
