import React from "react";
import NewTag from "./NewTag";
import ModifyTag from "./ModifyTag";

import { Table, Button } from "antd";
import {
  PlusOutlined,
  DeleteTwoTone
} from '@ant-design/icons';

import { list_tag, delete_tag } from "../requests";

export default class TagPage extends React.Component {
  state = {
    data: []
  }

  TagTableColumns = [
    {
      title: "標籤ID",
      dataIndex: "id",
      key: "id"
    }, {
      title: "標籤名稱",
      dataIndex: "name",
      key: "name"
    }, {
      title: "修改",
      dataIndex: "update",
      render: (_, record) => {
        let ref = React.createRef();
        return (
          <>
            <ModifyTag ref={ref} parent={this} />
            <a
              onClick={() => {
                ref.current.show(record.id, record.name);
              }}
            >
              修改
          </a>
          </>
        );
      }
    }, {
      title: "刪除",
      render: (_, record) => {
        return (
          <>
            <DeleteTwoTone twoToneColor="#FF0000" onClick={async () => {
              try {
                await delete_tag(record.id);
                this.reload();
              } catch (error) {
                console.log(error);
              }
            }} />
          </>
        );
      }
    }
  ];

  new_tag_ref = React.createRef();

  reload = () => {
    list_tag().then((data) => {
      data.forEach(element => element.key = element.id);
      this.setState({ data });
    });
  }

  componentDidMount() {
    this.reload();
  }

  render() {
    return (
      <div>
        <NewTag ref={this.new_tag_ref} parent={this} />
        <Button
          type="primary"
          onClick={() => {
            this.new_tag_ref.current.show();
          }}
        >
          <PlusOutlined />
          新增標籤
        </Button>
        <Table dataSource={this.state.data} columns={this.TagTableColumns} />
      </div>
    );
  }
}
