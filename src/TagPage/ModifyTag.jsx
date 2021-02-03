import React from "react";

import { Modal, Form, Input, Button } from "antd";
import { modify_tag } from "../requests";

export default class UpdateTag extends React.Component {
  state = {
    visible: false,
    loading: false,
    id: 0,
    context: ""
  }
  form_ref = React.createRef();
  input_ref = React.createRef();

  hide = () => {
    this.setState({ visible: false });
  }

  show = (id, context) => {
    this.setState({ visible: true, id, context });
  }

  submit = async ({ name }) => {
    this.setState({ loading: true });
    try {
      if (name === this.state.context) {
        return;
      }
      await modify_tag(this.state.id, name);
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
        title="更新標籤"
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
              修改
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
            <Input ref={this.input_ref} defaultValue={this.state.context} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}