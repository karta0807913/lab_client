import React from 'react';

import ScrollCompoment from "../lib/ScrollCompoment";
import DownloadConfirm from "./download_confirm";
import { alert } from "../lib/Alert";
import FileBlock from "./block";
import UploadPage from "./upload_page";

import * as request from "../requests";

import style from "./style.module.scss";

export default class FileList extends ScrollCompoment {
  constructor(props) {
    super(props);
    this._upload_form = React.createRef();
    this._download_confirm = React.createRef();
  }

  componentDidMount() {
    this.load_more();
  }

  async _load_more(offset) {
    let file_list = await request.file_list();
    return file_list;
  }

  render() {
    let list = [];
    for (let file of this.state.item_list) {
      list.push(<FileBlock
        info={file}
        key={file.file_id}
        onClick={() => {
          this._download_confirm.current.show(file);
        }}
      />);
    }
    return (
      <div>
        <DownloadConfirm
          ref={this._download_confirm}
        />
        <UploadPage ref={this._upload_form} />
        <div className={style["option_bar"]}>
          <button
            className="btn btn-primary"
            onClick={() => this._upload_form.current.show()}
          >
            上傳檔案
          </button>
        </div>
        <div className={style.container}>
          {list}
        </div>
      </div >
    );
  }
}
