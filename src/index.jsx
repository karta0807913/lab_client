import React from "react";
import ReactDOM from "react-dom";
import MarkdownEditor from "./MarkdownEditor";
import MdPage from "./MdPage";

import { Button, Layout, Menu } from "antd";

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import LoginModal from "./LoginModal";

import * as requests from "./requests";

import 'antd/dist/antd.css';
import "./index.scss";

class Index extends React.Component {
  state = {
    collapsed: false,
    user_info: null,
    content: <MdPage readOnly markdown="# 1" title="Title" />
  };

  _login_modal = React.createRef();

  componentDidMount() {
    this._get_user_status();
  }

  async _get_user_status() {
    try {
      let user_info = await requests.user_info();
      this.setState({ user_info });
    } catch (error) {
    }
  }

  _user_status() {
    if (this.state.user_info) {
      return (
        <>
          <UserOutlined />
          <span style={{ margin: "0 10px" }}>
            {this.state.user_info.nickname}
          </span>
          <Button style={{ margin: "0 10px 0 0" }} onClick={() => {
            this.setState({ user_info: null });
          }}>登出</Button>
        </>
      );
    } else {
      return (
        <>
          <LoginModal
            ref={this._login_modal}
            onSuccess={(user_info) => {
              this.setState({ user_info });
            }}
          />
          <Button
            type="primary"
            style={{
              margin: "0 10px"
            }}
            onClick={() => {
              this._login_modal.current.show();
            }}>
            登入
          </Button>
        </>
      );
    }
  }

  render() {
    return (
      <Layout>
        <Layout.Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout className="site-layout">
          <Layout.Header
            className="site-layout-background site-layout-header" style={{ padding: 0 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => {
                this.setState({ collapsed: !this.state.collapsed });
              },
            })}
            <div className="user_status">
              {this._user_status()}
            </div>
          </Layout.Header>
          <Layout.Content
            className="site-layout-background site-content"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            <div className="site-content">
              {this.state.content}
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

ReactDOM.render(
  <Index />,
  document.getElementById("root")
);

