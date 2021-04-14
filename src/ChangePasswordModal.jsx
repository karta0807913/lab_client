import React from "react";
import { Modal, Form, Input, Button } from "antd";

export default class ChangePasswordModal extends React.Component {

  state = {
    visible: false,
    loading: true,
  }

  _form = React.createRef();

  show = () => {
    this.setState({ visible: true });
  }

  hide = () => {
    this.setState({ visible: false });
    this._form.current.resetFields();
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        title="修改密碼"
        onCancel={this.hide}
        closable={true}
        footer={
          <>
            <Button onClick={this.hide}>
              取消
            </Button>
            <Button onClick={() => {
              this._form.current.submit();
            }}>
              確定
            </Button>
          </>
        }
      >
        <Form ref={this._form}>
          <Form.Item
            label="舊密碼"
            name="old_password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="新密碼"
            name="new_password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="再次確認新密碼"
            name="new_again_password"
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}