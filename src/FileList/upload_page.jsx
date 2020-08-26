import React from "react";
import BootModal from "../lib/BootModal";
import FormInput from "../lib/FormInput";

import * as request from "../requests";

export default class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this._upload_file = React.createRef();
    this._upload_file_name = React.createRef();
    this._bootmodal = React.createRef();
  }

  show() {
    this._bootmodal.current.show();
  }

  hide() {
    this._bootmodal.current.hide();
  }

  render() {
    return (
      <BootModal
        title="上傳檔案"
        cancel="取消"
        confirm="上傳"
        ref={this._bootmodal}

        onSubmit={async () => {
          if (this._upload_file.current.files.length !== 1) {
            alert("尚未選擇檔案");
            return;
          }
          let info = {
            filename: this._upload_file_name.current.value() ||
              this._upload_file.current.files[0].name
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
    );
  }
}