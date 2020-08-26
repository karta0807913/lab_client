/**
 * md.js v1.0.0
 * https://github.com/hackmdio/codimd/blob/master/public/js/extra.js
 */

import MarkDownIt from "markdown-it";
import markdownitContainer from 'markdown-it-container';
import Plugin from 'markdown-it-regexp';
import $ from "jquery";

let md = MarkDownIt();
md.use(require('markdown-it-abbr'));
md.use(require('markdown-it-footnote'));
md.use(require('markdown-it-deflist'));
md.use(require('markdown-it-mark'));
md.use(require('markdown-it-ins'));
md.use(require('markdown-it-sub'));
md.use(require('markdown-it-sup'));
md.use(require('markdown-it-mathjax')({
  beforeMath: '<span class="mathjax raw">',
  afterMath: '</span>',
  beforeInlineMath: '<span class="mathjax raw">\\(',
  afterInlineMath: '\\)</span>',
  beforeDisplayMath: '<span class="mathjax raw">\\[',
  afterDisplayMath: '\\]</span>'
}));
md.use(require('markdown-it-imsize'));
md.use(require('markdown-it-ruby'));

function renderContainer(tokens, idx, options, env, self) {
  tokens[idx].attrJoin('role', 'alert');
  tokens[idx].attrJoin('class', 'alert');
  tokens[idx].attrJoin('class', `alert-${tokens[idx].info.trim()}`);
  return self.renderToken(...arguments);
}

md.use(markdownitContainer, 'success', { render: renderContainer });
md.use(markdownitContainer, 'info', { render: renderContainer });
md.use(markdownitContainer, 'warning', { render: renderContainer });
md.use(markdownitContainer, 'danger', { render: renderContainer });
md.use(markdownitContainer, 'spoiler', {
  validate: function(params) {
    return params.trim().match(/^spoiler(\s+.*)?$/);
  },
  render: function(tokens, idx) {
    const m = tokens[idx].info.trim().match(/^spoiler(\s+.*)?$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      const summary = m[1] && m[1].trim();
      if (summary) {
        return `<details><summary>${md.utils.escapeHtml(summary)}</summary>\n`;
      } else {
        return `<details>\n`;
      }
    } else {
      // closing tag
      return '</details>\n';
    }
  }
});

const defaultImageRender = md.renderer.rules.image;
md.renderer.rules.image = function(tokens, idx, options, env, self) {
  tokens[idx].attrJoin('class', 'raw');
  return defaultImageRender(...arguments);
};
md.renderer.rules.list_item_open = function(tokens, idx, options, env, self) {
  tokens[idx].attrJoin('class', 'raw');
  return self.renderToken(...arguments);
};
md.renderer.rules.blockquote_open = function(tokens, idx, options, env, self) {
  tokens[idx].attrJoin('class', 'raw');
  return self.renderToken(...arguments);
};
md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
  tokens[idx].attrJoin('class', 'raw');
  return self.renderToken(...arguments);
};
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
  let langName = '';
  let highlighted;

  if (info) {
    langName = info.split(/\s+/g)[0];
    if (/!$/.test(info)) token.attrJoin('class', 'wrap');
    token.attrJoin('class', options.langPrefix + langName.replace(/=$|=\d+$|=\+$|!$|=!$/, ''));
    token.attrJoin('class', 'hljs');
    token.attrJoin('class', 'raw');
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName) || md.utils.escapeHtml(token.content);
  } else {
    highlighted = md.utils.escapeHtml(token.content);
  }

  if (highlighted.indexOf('<pre') === 0) {
    return `${highlighted}\n`;
  }

  return `<pre><code${self.renderAttrs(token)}>${highlighted}</code></pre>\n`;
};
// youtube
const youtubePlugin = new Plugin(
  // regexp to match
  /{%youtube\s*([\d\D]*?)\s*%}/,

  (match, utils) => {
    const videoid = match[1];
    if (!videoid) return
    const div = $('<div class="youtube raw"></div>');
    div.attr('data-videoid', videoid);
    const thumbnailSrc = `//img.youtube.com/vi/${videoid}/hqdefault.jpg`;
    const image = `<img src="${thumbnailSrc}" />`;
    div.append(image);
    const icon = '<i class="icon fa fa-youtube-play fa-5x"></i>';
    div.append(icon);
    return div[0].outerHTML;
  }
);
// vimeo
const vimeoPlugin = new Plugin(
  // regexp to match
  /{%vimeo\s*([\d\D]*?)\s*%}/,

  (match, utils) => {
    const videoid = match[1].split(/[?&=]+/)[0];
    if (!videoid) return;
    const div = $('<div class="vimeo raw"></div>');
    div.attr('data-videoid', videoid);
    const icon = '<i class="icon fa fa-vimeo-square fa-5x"></i>';
    div.append(icon);
    return div[0].outerHTML;
  }
);
// gist
const gistPlugin = new Plugin(
  // regexp to match
  /{%gist\s*([\d\D]*?)\s*%}/,

  (match, utils) => {
    const gistid = match[1].split(/[?&=]+/)[0];
    const code = `<code data-gist-id="${gistid}"></code>`;
    return code;
  }
);
// TOC
const tocPlugin = new Plugin(
  // regexp to match
  /^\[TOC\]$/i,

  (match, utils) => '<div class="toc"></div>'
);
// slideshare
const slidesharePlugin = new Plugin(
  // regexp to match
  /{%slideshare\s*([\d\D]*?)\s*%}/,

  (match, utils) => {
    const slideshareid = match[1].split(/[?&=]+/)[0];
    const div = $('<div class="slideshare raw"></div>');
    div.attr('data-slideshareid', slideshareid);
    return div[0].outerHTML;
  }
);
// speakerdeck
const speakerdeckPlugin = new Plugin(
  // regexp to match
  /{%speakerdeck\s*([\d\D]*?)\s*%}/,

  (match, utils) => {
    const speakerdeckid = match[1];
    const div = $('<div class="speakerdeck raw"></div>');
    div.attr('data-speakerdeckid', speakerdeckid);
    return div[0].outerHTML;
  }
);
// pdf
const pdfPlugin = new Plugin(
  // regexp to match
  /{%pdf\s*([\d\D]*?)\s*%}/,

  (match, utils) => {
    const pdfurl = match[1];
    let vaild = false;
    try {
      new window.URL(pdfurl);
      vaild = true;
    } catch (err) {
    }
    if (!vaild) return match[0];
    const div = $('<div class="pdf raw"></div>');
    div.attr('data-pdfurl', pdfurl);
    return div[0].outerHTML;
  }
);

// const emojijsPlugin = new Plugin(
//   // regexp to match emoji shortcodes :something:
//   // We generate an universal regex that guaranteed only contains the
//   // emojies we have available. This should prevent all false-positives
//   new RegExp(':(' + window.emojify.emojiNames.map((item) => { return RegExp.escape(item); }).join('|') + '):', 'i'),

//   (match, utils) => {
//     const emoji = match[1].toLowerCase();
//     const div = $(`<img class="emoji" alt=":${emoji}:" src="${process.env.PUBLIC_URL}/build/emojify.js/dist/images/basic/${emoji}.png"></img>`);
//     return div[0].outerHTML;
//   }
// );

// yaml meta, from https://github.com/eugeneware/remarkable-meta
function get(state, line) {
  const pos = state.bMarks[line];
  const max = state.eMarks[line];
  return state.src.substr(pos, max - pos);
}

function meta(state, start, end, silent) {
  if (start !== 0 || state.blkIndent !== 0) return false;
  if (state.tShift[start] < 0) return false;
  if (!get(state, start).match(/^---$/)) return false;

  const data = [];
  for (var line = start + 1; line < end; line++) {
    const str = get(state, line);
    if (str.match(/^(\.{3}|-{3})$/)) break;
    if (state.tShift[line] < 0) break;
    data.push(str);
  }

  if (line >= end) return false;

  try {
    md.meta = window.jsyaml.safeLoad(data.join('\n')) || {};
    delete md.metaError;
  } catch (err) {
    md.metaError = err;
    console.warn(err);
    return false;
  }

  state.line = line + 1;

  return true;
}

function metaPlugin(md) {
  md.meta = md.meta || {};
  md.block.ruler.before('code', 'meta', meta, {
    alt: []
  });
}

md.use(metaPlugin);
// md.use(emojijsPlugin);
md.use(youtubePlugin);
md.use(vimeoPlugin);
md.use(gistPlugin);
md.use(tocPlugin);
md.use(slidesharePlugin);
md.use(speakerdeckPlugin);
md.use(pdfPlugin);

export default md;