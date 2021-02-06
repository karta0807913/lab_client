import React from "react";

import { Modal, Form, Button, Input, Switch } from "antd";

import * as requests from "../requests";

export default class AddUserModal extends React.Component {

  state = {
    visible: false,
    loading: false
  }

  _form = React.createRef();

  hide = () => {
    this.setState({ visible: false });
  }

  show = () => {
    this.setState({ visible: true });
  }

  submit = async ({ nickname, account, password, is_admin }) => {
    try {
      this.setState({ loading: true });
      await requests.new_user(nickname, account, password, !!is_admin, 0);
      this.hide();
      this.props.onSuccess();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Modal
        title="新增使用者"
        visible={this.state.visible}
        onOk={this.hide}
        onCancel={this.hide}
        footer={[
          <Button key="back" onClick={this.hide}>
            取消
        </Button>,
          <Button
            key="submit"
            onClick={() => {
              this._form.current.submit();
            }}
            loading={this.state.loading}
          >
            送出
        </Button>
        ]}
      >
        <Form
          ref={this._form}
          onFinish={this.submit}
          autoComplete="off"
        >
          <Form.Item
            label="暱稱"
            name="nickname"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="帳號"
            name="account"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密碼"
            name="password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="管理員權限"
            name="is_admin"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}