import React from "react";
import BootModal from "../lib/BootModal";
import * as request from "../requests";

import * as userset from "../userset";

export default class DownloadConfirm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file_info: {
        file_name: ""
      },
      user_data: null
    };
    this._modal = React.createRef();
    this._download = React.createRef();
  }

  async show(file_info) {
    let user_data = await userset.getUser(file_info.user_id);
    await this.setState({ user_data, file_info });
    return this._modal.current.show();
  }

  hide() {
    this._modal.current.hide();
  }

  _modal_context() {
    if (this.state.user_data) {
      return (
        <>
          <div>
            <span>此檔案由{this.state.user_data.nickname}所上傳</span>
          </div>
          <a
            href={request.concat_url(`/file/download?id=${this.state.file_info.file_id}`)}
            target="_blank"
            style={{ display: "none" }}
            ref={this._download}
            download={this.state.file_info.file_name || "未知的檔案"}
          />
        </>
      );
    }
  }

  render() {
    return (
      <BootModal
        title={`是否要下載 ${this.state.file_info.file_name || "未命名"}`}
        ref={this._modal}
        confirm="是"
        cancel="否"
        onSubmit={() => {
          this.hide();
          this._download.current.click();
        }}
      >
        {this._modal_context()}
      </BootModal >
    );
  }
}