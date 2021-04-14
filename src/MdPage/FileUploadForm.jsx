import React from "react";

import { Modal, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { concat_url, remove_file } from "../requests";

export default class FileUploadForm extends React.Component {

  _upload_ref = React.createRef();

  state = {
    visible: false,
    file_list: [],
  }

  show = () => {
    this.setState({ visible: true });
  }

  hide = () => {
    this.setState({ visible: false });
    let file_list = [];
    for (let file of this._upload_ref.current.fileList) {
      if (file.status !== "done") {
        continue;
      }
      let result = {};
      result.file_id = file.file_id || file.response.file_id;
      result.file_name = file.name;
      file_list.push(result);
    }
    this.props.callback && this.props.callback(file_list);
  }

  remove_file = async (file) => {
    if (file.response) {
      return remove_file(file.response.file_id);
    } else {
      return remove_file(file.uid);
    }
  }

  set_file_list(file_list) {
    file_list.forEach((element) => {
      element.uid = element.file_id;
      element.name = element.file_name;
      element.status = "done";
      element.url = concat_url("/file/download?id=" + element.file_id).toString();
    });
    this.setState({ file_list });
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        title="檔案上傳"
        closable={true}
        footer={null}
        onCancel={this.hide}
      >
        <Upload.Dragger
          action={concat_url("/file/upload")}
          withCredentials={true}
          defaultFileList={this.state.file_list}
          ref={this._upload_ref}
          onRemove={this.remove_file}
          data={(file) => {
            return {
              options: new Blob([JSON.stringify({
                filename: file.name,
                blog_id: this.props.blog_id,
              })], {
                type: "application/json"
              })
            };
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">拖拉或是點擊上傳</p>
          <p className="ant-upload-hint">
            請不要亂上傳檔案，因為是實驗室內部使用的所以沒有做限制
          </p>
          <p className="ant-upload-hint">
            單檔案上限為10Gb，超過將會被拒絕
          </p>
        </Upload.Dragger>
      </Modal >
    );
  }

}