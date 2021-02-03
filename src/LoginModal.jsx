import React from "react";

import { Alert, Modal, Button, Input, Form } from 'antd';

import * as requests from "./requests";

export default class LoginModal extends React.Component {
  static PASSWORD_ERROR = 1;
  static UNKNOW_ERROR = 2;

  _info_form = React.createRef();

  state = {
    visible: false,
    loading: false,
    error: null
  }

  show = () => {
    this.setState({ visible: true });
  }

  hide = () => {
    this.setState({ visible: false });
  }

  login = async ({ account, password }) => {
    try {
      this.setState({ loading: true });
      let user_info = await requests.login(account, password);
      this.setState({ error: null });
      this.hide();
      this.props.onSuccess(user_info);
    } catch (error) {
      if (error.message === "AccountOrPasswordError") {
        this.setState({ error: LoginModal.PASSWORD_ERROR });
      } else {
        console.log(error);
        this.setState({ error: LoginModal.UNKNOW_ERROR });
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  _errors() {
    switch (this.state.error) {
      case LoginModal.PASSWORD_ERROR:
        return (
          <Alert
            message="帳號或密碼錯誤"
            description="請檢查你的帳號密碼"
            type="error"
            closable
          />
        );
      case LoginModal.UNKNOW_ERROR:
        return (
          <Alert
            message="未知的錯誤"
            description="請聯絡系統管理員"
            type="error"
            closable
          />
        );
    }
  }

  render() {
    return (
      <Modal
        title="登入"
        visible={this.state.visible}
        onCancel={this.hide}
        footer={
          <>
            <Button onClick={this.hide}>
              返回
            </Button>
            <Button type="primary" loading={this.state.loading} onClick={() => {
              this._info_form.current.submit();
            }}>
              登入
            </Button>
          </>
        }
      >
        {this._errors()}
        <Form
          ref={this._info_form}
          onFinish={this.login}
        >
          <Form.Item
            label="帳號"
            name="account"
            rules={[{
              required: true,
              message: "請輸入帳號"
            }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密碼"
            name="password"
            rules={[{
              required: true,
              message: "請輸入密碼"
            }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal >
    );
  }
}