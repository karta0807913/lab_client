import React from "react";

import { Table } from "antd";
import { file_list } from "../requests";
import { CloudDownloadOutlined } from "@ant-design/icons";

export default class FileManage extends React.Component {

  limit = 20;

  state = {
    fileList: [],
    total: 0,
  };

  load = async (page = 1) => {
    let offset = (page - 1) * this.limit;
    let { total, result } = await file_list(offset, this.limit);
    result.forEach((element, index) => {
      element.key = element.file_id;
      element = {
        ...element,
        ...element.user_data,
      };
      result[index] = element;
    });
    this.setState({ total, fileList: result });
  }

  componentWillMount() {
    this.load();
  }

  render() {
    return (
      <div>
        <Table
          columns={[{
            title: "檔案名稱",
            dataIndex: "file_name"
          }, {
            title: "使用者ID",
            dataIndex: "user_id"
          }, {
            title: "使用者名稱",
            dataIndex: "nickname"
          }, {
            title: "檔案下載",
            render: (value) => {
              return (
                <a href={`/file/download?id=${value.file_id}`}>
                  <CloudDownloadOutlined />
                </a>
              );
            }
          }]}
          dataSource={this.state.fileList}
          pagination={{ total: this.state.total, onChange: this.load }}
        />
      </div>
    );
  }
}
