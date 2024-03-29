import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { user_change_password } from "./requests";

export default class ChangePasswordModal extends React.Component {

  state = {
    visible: false,
    loading: false,
  }

  _form = React.createRef();

  show = () => {
    this.setState({ visible: true });
  }

  hide = () => {
    this.setState({ visible: false });
    this._form.current.resetFields();
  }

  submit = async ({ new_password, old_password }) => {
    this.setState({ loading: true });
    try {
      await user_change_password(old_password, new_password);
      this.hide();
    } catch (error) {
      console.log(error);
    } finally {
      this._form.current.resetFields();
      this.setState({ loading: false });
    }
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
            <Button
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this._form.current.submit();
              }}>
              確定
            </Button>
          </>
        }
      >
        <Form
          ref={this._form}
          onFinish={this.submit}
        >
          <Form.Item
            label="舊密碼"
            name="old_password"
            rules={[{
              required: true,
              messages: "請輸入舊密碼"
            }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="新密碼"
            name="new_password"
            rules={[{
              required: true,
              messages: "請輸入新密碼"
            }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            hasFeedback
            dependencies={['new_password']}
            name="confirm-password"
            label="再次確認新密碼"
            rules={[{
              required: true,
              messages: "請輸入新密碼"
            }, ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('兩次輸入的密碼不符'));
              }
            })]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal >
    );
  }
}