import React from 'react';

import ScrollCompoment from "../lib/ScrollCompoment";
import DownloadConfirm from "./download_confirm";
import FormInput from "../lib/FormInput";
import BootModal from "../lib/BootModal";
import { alert } from "../lib/Alert";
import FileBlock from "./block";

import * as request from "../requests";

import style from "./style.module.scss";

export default class FileList extends ScrollCompoment {
  constructor(props) {
    super(props);
    this._upload_form = React.createRef();
    this._upload_file = React.createRef();
    this._upload_file_name = React.createRef();
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
        <BootModal
          title="上傳檔案"
          cancel="取消"
          confirm="上傳"
          ref={this._upload_form}
          onSubmit={async () => {
            if (this._upload_file.current.files.length !== 1) {
              alert("尚未選擇檔案");
              return;
            }
            let info = {
              filename: this._upload_file_name.current.value() || this._upload_file.current.files[0].name
            };
            await request.upload_file(info, this._upload_file.current.files[0]);
            this._upload_form.current.hide();
          }}
        >
          <FormInput
            type="text"
            title="檔案名稱（非必填）"
            ref={this._upload_file_name}
          />
          <input type="file" ref={this._upload_file} />
        </BootModal>
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
