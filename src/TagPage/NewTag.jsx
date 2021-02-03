import React from "react";

import { Modal, Form, Input, Button } from "antd";

import { new_tag } from "../requests";

export default class NewTag extends React.Component {
  state = {
    visible: false,
    loading: false,
  }

  form_ref = React.createRef();

  hide = () => {
    this.setState({ visible: false });
  }

  show = () => {
    this.setState({ visible: true });
  }

  submit = async ({ name }) => {
    this.setState({ loading: true });
    try {
      await new_tag(name);
      this.props.parent.reload();
      this.hide();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Modal
        title="新增標籤"
        visible={this.state.visible}
        onCancel={this.hide}
        footer={
          <>
            <Button onClick={this.hide}>
              取消
            </Button>
            <Button
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this.form_ref.current.submit();
              }}
            >
              新增
            </Button>
          </>
        }
      >
        <Form
          ref={this.form_ref}
          onFinish={this.submit}
        >
          <Form.Item
            label="標籤名稱"
            name="name"
            rules={[{
              required: true,
              message: "標籤名稱不可為空"
            }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}