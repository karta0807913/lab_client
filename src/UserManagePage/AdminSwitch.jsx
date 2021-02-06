import React from "react";
import { Popconfirm, Switch } from 'antd';

export default class AdminSwitch extends React.Component {
  state = {
    visible: false,
    is_admin: this.props.isAdmin,
    loading: false,
  }

  toggleVisible = () => {
    this.setState({ visible: !this.state.visible });
  }

  onClick = async () => {
    if (this.state.is_admin) {
      this.toggleSwitch(false);
    } else {
      this.toggleVisible();
    }
  }

  onConfirm = async () => {
    if (!this.state.is_admin) {
      this.toggleSwitch(true);
    }
    this.setState({ visible: false });
  }

  async toggleSwitch(checked = !this.state.is_admin) {
    try {
      this.setState({ loading: true });
      await this.props.onChange(checked);
      this.setState({ is_admin: checked });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Popconfirm
        title="設定為管理員？"
        visible={this.state.visible}
        onCancel={this.toggleVisible}
        onConfirm={this.onConfirm}
      >
        <Switch
          onClick={this.onClick}
          checked={this.state.is_admin}
          loading={this.state.loading}
        />
      </Popconfirm>
    );
  }
}