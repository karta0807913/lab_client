import React from "react";

import { Table, Pagination } from "antd";
import { file_list } from "../requests";

export default class FileManage extends React.Component {

  limit = 20;

  state = {
    fileList: [],
    total: 0,
  };

  load = async (page = 1) => {
    let offset = (page - 1) * this.limit;
    let { total, result } = await file_list(offset, this.limit);
    result.forEach(element => element.key = element.file_id);
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
          }]}
          dataSource={this.state.fileList}
          pagination={{ total: this.state.total, onChange: this.load }}
        />
      </div>
    );
  }
}
