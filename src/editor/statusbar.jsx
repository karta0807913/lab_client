import React, { createRef } from "react";
import $ from "jquery";
import Cookies from "js-cookie";
import CodeMirror from "@hackmd/codemirror/lib/codemirror";
import config from './config';
import debounce from 'lodash/debounce';

import { availableThemes } from './constants';
import CodeMirrorSpellChecker, { supportLanguages, supportLanguageCodes } from './spellcheck';

const isMac = CodeMirror.keyMap.default === CodeMirror.keyMap.macDefault;
const jumpToAddressBarKeymapName = isMac ? 'Cmd-L' : 'Ctrl-L';

export default class StatusBar extends React.Component {
  constructor(props) {
    super(props);

    this._statusCursor = React.createRef();
    this._statusSelection = React.createRef();
    this._statusFile = React.createRef();
    this._statusIndicators = React.createRef();
    this._statusIndent = React.createRef();
    this._statusKeymap = React.createRef();
    this._statusLength = React.createRef();
    this._statusTheme = React.createRef();
    this._statusSpellcheck = React.createRef();
    this._statusLinter = React.createRef();
    this._statusPreferences = React.createRef();
    this._overrideBrowserKeyMap = React.createRef();

    this._indent_type = React.createRef();
    this._indent_width_label = React.createRef();
    this._indent_width_input = React.createRef();

    this._ui_keymap_label = React.createRef();
    this._ui_keymap_sublime = React.createRef();
    this._ui_keymap_emacs = React.createRef();
    this._ui_keymap_vim = React.createRef();
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    if (!this.props.editor) return;
    this.statusCursor = $(this._statusCursor.current);
    this.statusSelection = $(this._statusSelection.current);
    this.statusFile = $(this._statusFile.current);
    this.statusIndicators = $(this._statusIndicators.current);
    this.statusIndent = $(this._statusIndent.current);
    this.statusKeymap = $(this._statusKeymap.current);
    this.statusLength = $(this._statusLength.current);
    this.statusTheme = $(this._statusTheme.current);
    this.statusSpellcheck = $(this._statusSpellcheck.current);
    this.statusLinter = $(this._statusLinter.current);
    this.statusPreferences = $(this._statusPreferences.current);
    this.updateStatusBar();
  }

  updateStatusBar() {
    if (!this.props.editor) return null;

    var cursor = this.props.editor.getCursor();
    var cursorText = 'Line ' + (cursor.line + 1) + ', Column ' + (cursor.ch + 1);
    this.statusCursor.text(cursorText);
    var fileText = ' — ' + this.props.editor.lineCount() + ' Lines';
    this.statusFile.text(fileText);
    var docLength = this.props.editor.getValue().length;
    this.statusLength.text('Length ' + docLength);
    if (docLength > (config.docmaxlength * 0.95)) {
      this.statusLength.css('color', 'red');
      this.statusLength.attr('title', 'You have almost reached the limit for this document.');
    } else if (docLength > (config.docmaxlength * 0.8)) {
      this.statusLength.css('color', 'orange');
      this.statusLength.attr('title', 'This document is nearly full, consider splitting it or creating a new one.');
    } else {
      this.statusLength.css('color', 'white');
      this.statusLength.attr('title', 'You can write up to ' + config.docmaxlength + ' characters in this document.');
    }

    this.setIndent();
    this.setKeymap();
    this.setTheme();
    this.setSpellcheck();
    this.setLinter();
    this.setPreferences();

    this.handleStatusBarResize();
  }

  setIndent() {
    if (!this.props.editor) return;
    var cookieIndentType = Cookies.get('indent_type');
    var cookieTabSize = parseInt(Cookies.get('tab_size'));
    var cookieSpaceUnits = parseInt(Cookies.get('space_units'));
    if (cookieIndentType) {
      if (cookieIndentType === 'tab') {
        this.props.editor.setOption('indentWithTabs', true);
        if (cookieTabSize) {
          this.props.editor.setOption('indentUnit', cookieTabSize);
        }
      } else if (cookieIndentType === 'space') {
        this.props.editor.setOption('indentWithTabs', false);
        if (cookieSpaceUnits) {
          this.props.editor.setOption('indentUnit', cookieSpaceUnits);
        }
      }
    }
    if (cookieTabSize) {
      this.props.editor.setOption('tabSize', cookieTabSize);
    }

    var type = $(this._indent_type.current);
    var widthLabel = $(this._indent_width_label.current);
    var widthInput = $(this._indent_width_input.current);

    const setType = () => {
      if (this.props.editor.getOption('indentWithTabs')) {
        Cookies.set('indent_type', 'tab', {
          expires: 365
        });
        type.text('Tab Size:');
      } else {
        Cookies.set('indent_type', 'space', {
          expires: 365
        });
        type.text('Spaces:');
      }
    };
    setType();

    const setUnit = () => {
      var unit = this.props.editor.getOption('indentUnit');
      if (this.props.editor.getOption('indentWithTabs')) {
        Cookies.set('tab_size', unit, {
          expires: 365
        });
      } else {
        Cookies.set('space_units', unit, {
          expires: 365
        });
      }
      widthLabel.text(unit);
    };
    setUnit();

    type.click(() => {
      if (this.props.editor.getOption('indentWithTabs')) {
        this.props.editor.setOption('indentWithTabs', false);
        cookieSpaceUnits = parseInt(Cookies.get('space_units'));
        if (cookieSpaceUnits) {
          this.props.editor.setOption('indentUnit', cookieSpaceUnits);
        }
      } else {
        this.props.editor.setOption('indentWithTabs', true);
        cookieTabSize = parseInt(Cookies.get('tab_size'));
        if (cookieTabSize) {
          this.props.editor.setOption('indentUnit', cookieTabSize);
          this.props.editor.setOption('tabSize', cookieTabSize);
        }
      }
      setType();
      setUnit();
    });
    widthLabel.click(() => {
      if (widthLabel.is(':visible')) {
        widthLabel.addClass('hidden');
        widthInput.removeClass('hidden');
        widthInput.val(this.props.editor.getOption('indentUnit'));
        widthInput.select();
      } else {
        widthLabel.removeClass('hidden');
        widthInput.addClass('hidden');
      }
    });
    widthInput.on('change', () => {
      var val = parseInt(widthInput.val());
      if (!val) val = this.props.editor.getOption('indentUnit');
      if (val < 1) val = 1;
      else if (val > 10) val = 10;

      if (this.props.editor.getOption('indentWithTabs')) {
        this.props.editor.setOption('tabSize', val);
      }
      this.props.editor.setOption('indentUnit', val);
      setUnit();
    });
    widthInput.on('blur', function() {
      widthLabel.removeClass('hidden');
      widthInput.addClass('hidden');
    });
  }

  setKeymap() {
    if (!this.props.editor) return;
    var cookieKeymap = Cookies.get('keymap');
    if (cookieKeymap) {
      this.props.editor.setOption('keyMap', cookieKeymap);
    }

    var label = $(this._ui_keymap_label.current);
    var sublime = $(this._ui_keymap_sublime.current);
    var emacs = $(this._ui_keymap_emacs.current);
    var vim = $(this._ui_keymap_vim.current);

    const setKeymapLabel = () => {
      var keymap = this.props.editor.getOption('keyMap');
      Cookies.set('keymap', keymap, {
        expires: 365
      });
      label.text(keymap);
      this.restoreOverrideEditorKeymap();
      this.setOverrideBrowserKeymap();
    };
    setKeymapLabel();

    sublime.click(() => {
      this.props.editor.setOption('keyMap', 'sublime');
      setKeymapLabel();
    });
    emacs.click(() => {
      this.props.editor.setOption('keyMap', 'emacs');
      setKeymapLabel();
    });
    vim.click(() => {
      this.props.editor.setOption('keyMap', 'vim');
      setKeymapLabel();
    });
  }

  setTheme() {
    this.statusIndicators.find('.status-theme ul.dropdown-menu').append(availableThemes.map(theme => {
      return $(`<li value="${theme.value}"><a>${theme.name}</a></li>`);
    }));

    const activateThemeListItem = (theme) => {
      this.statusIndicators.find('.status-theme li').removeClass('active');
      this.statusIndicators.find(`.status-theme li[value="${theme}"]`).addClass('active');
    };

    const setTheme = theme => {
      this.props.editor.setOption('theme', theme);
      Cookies.set('theme', theme, {
        expires: 365
      });
      this.statusIndicators.find('.status-theme li').removeClass('active');
      this.statusIndicators.find(`.status-theme li[value="${theme}"]`).addClass('active');
    };

    const cookieTheme = Cookies.get('theme');
    if (cookieTheme && availableThemes.find(theme => cookieTheme === theme.value)) {
      setTheme(cookieTheme);
      activateThemeListItem(cookieTheme);
    } else {
      activateThemeListItem(this.props.editor.getOption('theme'));
    }

    this.statusIndicators.find('.status-theme li').click(function() {
      const theme = $(this).attr('value');
      setTheme(theme);
      activateThemeListItem(theme);
    });
  }

  setSpellcheck() {
    this.statusSpellcheck.find('ul.dropdown-menu').append(supportLanguages.map(lang => {
      return $(`<li value="${lang.value}"><a>${lang.name}</a></li>`);
    }));

    const cookieSpellcheck = Cookies.get('spellcheck');
    if (cookieSpellcheck) {
      let mode = null;
      let lang = 'en_US';

      if (cookieSpellcheck === 'false' || !cookieSpellcheck) {
        mode = this.props.defaultEditorMode;
        this.activateSpellcheckListItem(false);
      } else {
        mode = 'spell-checker';
        if (supportLanguageCodes.includes(cookieSpellcheck)) {
          lang = cookieSpellcheck;
        }
        this.setSpellcheckLang(lang);
      }

      this.props.editor.setOption('mode', mode);
    }

    const spellcheckToggle = this.statusSpellcheck.find('.ui-spellcheck-toggle');

    const checkSpellcheck = () => {
      var mode = this.props.editor.getOption('mode');
      if (mode === this.props.defaultEditorMode) {
        spellcheckToggle.removeClass('active');
      } else {
        spellcheckToggle.addClass('active');
      }
    };

    this.statusIndicators.find('.status-spellcheck li').click(() => {
      const lang = $(this).attr('value');

      if (lang === 'disabled') {
        spellcheckToggle.removeClass('active');

        Cookies.set('spellcheck', false, {
          expires: 365
        });

        this.props.editor.setOption('mode', this.props.defaultEditorMode);
      } else {
        spellcheckToggle.addClass('active');

        Cookies.set('spellcheck', lang, {
          expires: 365
        });

        this.props.editor.setOption('mode', 'spell-checker');
      }

      this.setSpellcheckLang(lang);
    });

    checkSpellcheck();
  }

  setLinter() {
    const linterToggle = this.statusLinter.find('.ui-linter-toggle');

    const updateLinterStatus = (enable) => {
      linterToggle.toggleClass('active', enable);
    };

    linterToggle.click(() => {
      const lintEnable = this.props.editor.getOption('lint');
      this.toggleLinter.bind(this)(!lintEnable);
      updateLinterStatus(!lintEnable);
    });

    const enable = !!Cookies.get('linter');
    this.toggleLinter.bind(this)(enable);
    updateLinterStatus(enable);
  }

  setPreferences() {
    var overrideBrowserKeymap = $(
      this._overrideBrowserKeyMap.current
    );
    var cookieOverrideBrowserKeymap = Cookies.get(
      'preferences-override-browser-keymap'
    );
    if (cookieOverrideBrowserKeymap && cookieOverrideBrowserKeymap === 'true') {
      overrideBrowserKeymap.prop('checked', true);
    } else {
      overrideBrowserKeymap.prop('checked', false);
    }
    this.setOverrideBrowserKeymap();

    overrideBrowserKeymap.change(() => {
      this.setOverrideBrowserKeymap();
    });
  }

  handleStatusBarResize() {
    const onResize = debounce(() => {
      if (!this.statusBar) {
        return;
      }

      const maxHeight = window.innerHeight - this.statusBar.height() - 50 /* navbar height */ - 10 /* spacing */;
      this.statusBar.find('.status-theme ul.dropdown-menu').css('max-height', `${maxHeight}px`);
    }, 300);

    $(window).resize(onResize);

    onResize();
  }

  resetEditorKeymapToBrowserKeymap() {
    var keymap = this.props.editor.getOption('keyMap');
    if (!this.jumpToAddressBarKeymapValue) {
      this.jumpToAddressBarKeymapValue = CodeMirror.keyMap[keymap][jumpToAddressBarKeymapName];
      delete CodeMirror.keyMap[keymap][jumpToAddressBarKeymapName];
    }
  }

  restoreOverrideEditorKeymap() {
    var keymap = this.props.editor.getOption('keyMap');
    if (this.jumpToAddressBarKeymapValue) {
      CodeMirror.keyMap[keymap][jumpToAddressBarKeymapName] = this.jumpToAddressBarKeymapValue;
      this.jumpToAddressBarKeymapValue = null;
    }
  }

  setOverrideBrowserKeymap() {
    var overrideBrowserKeymap = $(
      this._overrideBrowserKeyMap.current
    );
    if (overrideBrowserKeymap.is(':checked')) {
      Cookies.set('preferences-override-browser-keymap', true, {
        expires: 365
      });
      this.restoreOverrideEditorKeymap();
    } else {
      Cookies.remove('preferences-override-browser-keymap');
      this.resetEditorKeymapToBrowserKeymap();
    }
  }

  activateSpellcheckListItem(lang) {
    this.statusIndicators.find('.status-spellcheck li').removeClass('active');

    if (lang) {
      this.statusIndicators.find(`.status-spellcheck li[value="${lang}"]`).addClass('active');
    } else {
      this.statusIndicators.find('.status-spellcheck li[value="disabled"]').addClass('active');
    }
  }

  toggleLinter(enable) {
    const gutters = this.props.editor.getOption('gutters');
    const lintGutter = 'CodeMirror-lint-markers';

    if (enable) {
      if (!gutters.includes(lintGutter)) {
        this.props.editor.setOption('gutters', [lintGutter, ...gutters]);
      }
      Cookies.set('linter', true, {
        expires: 365
      });
    } else {
      this.props.editor.setOption('gutters', gutters.filter(g => g !== lintGutter));
      Cookies.remove('linter');
    }
    this.props.editor.setOption('lint', enable);
  }

  setSpellcheckLang(lang) {
    if (lang === 'disabled') {
      this.statusIndicators.find('.spellcheck-lang').text('');
      this.activateSpellcheckListItem(false);
      return;
    }

    if (!supportLanguageCodes.includes(lang)) {
      return;
    }

    const langName = this.statusIndicators.find(`.status-spellcheck li[value="${lang}"]`).text();
    this.statusIndicators.find('.spellcheck-lang').text(langName);

    this.spellchecker.setDictLang(lang);
    this.activateSpellcheckListItem(lang);
  }

  getExistingSpellcheckLang() {
    const cookieSpellcheck = Cookies.get('spellcheck');

    if (cookieSpellcheck) {
      return cookieSpellcheck === 'false' ? undefined : cookieSpellcheck;
    } else {
      return undefined;
    }
  }

  activateSpellcheckListItem(lang) {
    this.statusIndicators.find('.status-spellcheck li').removeClass('active');

    if (lang) {
      this.statusIndicators.find(`.status-spellcheck li[value="${lang}"]`).addClass('active');
    } else {
      this.statusIndicators.find('.status-spellcheck li[value="disabled"]').addClass('active');
    }
  }

  render() {
    if (!this.props.editor) return null;
    return (
      <div className="status-bar">
        <div className="status-info">
          <div className="status-cursor">
            <span
              ref={this._statusCursor}
              className="status-line-column"
            />
            <span
              ref={this._statusSelection}
              className="status-selection" />
          </div>
          <div ref={this._statusFile} className="status-file"></div>
        </div>
        <div ref={this._statusIndicators} className="status-indicators">
          <div ref={this._statusLength} className="status-length"></div>
          <div
            ref={this._statusPreferences}
            className="status-preferences dropup toggle-dropdown pull-right"
          >
            <a
              id="preferencesLabel"
              className="ui-preferences-label text-uppercase"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              title="Click to change preferences"
            >
              <i className="fa fa-wrench fa-fw"></i>
            </a>
            <ul className="dropdown-menu" aria-labelledby="preferencesLabel">
              <li
                className="ui-preferences-override-browser-keymap">
                <a>
                  <label>
                    Allow override browser keymap&nbsp;&nbsp;
                    <input type="checkbox" ref={this._overrideBrowserKeyMap} />
                  </label>
                </a>
              </li>
            </ul>
          </div>
          <div
            ref={this._statusKeymap}
            className="status-keymap dropup pull-right"
          >
            <a
              id="keymapLabel"
              ref={this._ui_keymap_label}
              className="ui-keymap-label text-uppercase"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              title="Click to change keymap"
            >
              Sublime
            </a>
            <ul className="dropdown-menu" aria-labelledby="keymapLabel">
              <li
                ref={this._ui_keymap_sublime}
                className="ui-keymap-sublime"><a>Sublime</a></li>
              <li
                ref={this._ui_keymap_emacs}
                className="ui-keymap-emacs"><a>Emacs</a></li>
              <li
                ref={this._ui_keymap_vim}
                className="ui-keymap-vim"><a>Vim</a></li>
            </ul>
          </div>
          <div ref={this._statusIndent} className="status-indent">
            <div
              ref={this._indent_type}
              className="indent-type"
              title="Click to switch indentation type"
            >Spaces:</div>
            <div
              ref={this._indent_width_label}
              className="indent-width-label"
              title="Click to change indentation size"
            >
              4
            </div>
            <input
              ref={this._indent_width_input}
              className="indent-width-input hidden"
              type="number"
              min="1"
              max="10"
              maxlength="2"
              size="2"
            />
          </div>
          <div ref={this._statusTheme} className="status-theme dropup">
            <a
              id="themeLabel"
              className="ui-theme-label text-uppercase"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              title="Select theme"
            >
              <i className="fa fa-paint-brush fa-fw"></i>
            </a>
            <ul
              className="dropdown-menu"
              aria-labelledby="themeLabel"
              style={{ "overflow": "auto" }}
            >
            </ul>
          </div>
          <div
            ref={this._statusSpellcheck}
            className="status-spellcheck dropup pull-right">
            <a
              className="ui-spellcheck-toggle"
              title="Toggle spellcheck"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false">
              <i className="fa fa-check fa-fw"></i>
              <span className="spellcheck-lang"></span>
            </a>
            <ul className="dropdown-menu" aria-labelledby="themeLabel">
              <li value="disabled"><a>Disabled</a></li>
            </ul>
          </div>
          <div ref={this.statusLinter} className="status-linter">
            <a className="ui-linter-toggle" title="Toggle linter">
              <i className="fa fa-lightbulb-o fa-fw"></i>
            </a>
          </div>
        </div>
      </div>

    );
  }
}