import React from 'react';
import style from "./FileBrowser.module.scss";
import { alert } from "./lib/Alert.js";

import * as request from "./requests";

export default class FileBrowser extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      file: undefined
    };
  }

  async componentDidMount() {
    let url = new window.URL(window.location.href);
    let id = url.searchParams.get("id");
    if (id == undefined) {
      return window._history.goBack();
    }
    let file;
    if(!window._file || window._file.id !== id) {
      try {
        file = await request.get_file(id);
        file = await file.json();
      } catch(error) {
        alert("取得檔案時出現問題");
        return window._history.goBack();
      }
    } else {
      file = window._file;
    }
    this.setState({ file: file });
  }

  render() {
    if(this.state.file === undefined) {
      return <div>
               載入中...
             </div>;
    } else {
      return <div className={ style.container }>
               <iframe
                 src={`https://drive.google.com/file/d/${this.state.file.id}/preview`}
               >
               </iframe>
             </div>;
    }
  }
}