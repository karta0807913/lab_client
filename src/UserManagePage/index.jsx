import React from "react";
import AdminSwitch from "./AdminSwitch";
import AddUserModal from "./AddUserModal";

import { EditableCell, EditableRow } from "./Editables";
import { Table, Button } from 'antd';

import * as requests from "../requests";
import style from "./style.module.scss";

export default class UserManagePage extends React.Component {
  columns = [
    {
      title: '使用者編號',
      dataIndex: 'user_id',
    }, {
      title: '使用者名稱',
      dataIndex: 'nickname',
      editable: true,
    }, {
      title: '是否為管理員',
      dataIndex: 'is_admin',
      render: (is_admin, record) => {
        return (
          <AdminSwitch
            isAdmin={is_admin}
            onChange={this.handleOnChange.bind(this, record)}
          />
        );
      }
    }, {
      title: '帳號狀態',
      dataIndex: 'status',
    },
  ];

  state = {
    dataSource: []
  };

  _modal = React.createRef();

  handleOnChange = (record, checked) => {
    return requests.update_user(record.mem_id, { is_admin: checked });
  }

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  componentDidMount() {
    this.reload();
  }

  reload = async () => {
    this.setState({ dataSource: await requests.get_user_list() || [] });
  }

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <div>
        <AddUserModal onSuccess={this.reload} ref={this._modal} />
        <Button
          type="primary"
          style={{
            marginBottom: 16,
          }}
          onClick={() => {
            this._modal.current.show();
          }}
        >
          新增使用者
        </Button>
        <Table
          components={components}
          rowClassName={() => style['editable-row']}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}