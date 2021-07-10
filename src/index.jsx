import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./HomePage";
import BlogList from "./BlogList";
import TagPage from "./TagPage";
import FileManagePage from "./FileManagePage";
import UserManagePage from "./UserManagePage";
import ChangePasswordModal from "./ChangePasswordModal";
import CalendarPage from "./CalendarPage";

import { Button, Layout, Menu, Dropdown } from "antd";
import { UserInfoContext } from "./global";

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  MoreOutlined,
  HomeOutlined,
  FolderOpenOutlined,
  TagOutlined,
  UnorderedListOutlined,
  CalendarOutlined
} from '@ant-design/icons';

import LoginModal from "./LoginModal";

import * as requests from "./requests";

import 'antd/dist/antd.css';
import "./index.scss";

class Index extends React.Component {
  state = {
    collapsed: false,
    user_info: null,
    content: <HomePage key={1} />,
  };

  _login_modal = React.createRef();

  menu_on_click = ({ key }) => {
    switch (key) {
      case "1":
        this.setState({ content: <HomePage key={key} /> });
        break;
      case "2":
        this.setState({ content: <BlogList key={key} /> });
        break;
      case "TagPage":
        this.setState({ content: <TagPage key={key} /> });
        break;
      case "UserManage":
        this.setState({ content: <UserManagePage key={key} /> });
        break;
      case "FileManagePage":
        this.setState({ content: <FileManagePage key={key} /> });
      case "Calendar":
        this.setState({ content: <CalendarPage key={key} /> });
    }
  }

  user_menu = (
    <Menu>
      <Menu.Item>
        <a
          onClick={() => {
            this._change_password_modal.current.show();
          }}
        >修改密碼</a>
      </Menu.Item>
    </Menu>
  );

  async componentDidMount() {
    this._get_user_status();
  }

  async _get_user_status() {
    try {
      let user_info = await requests.user_info();
      this.setState({ user_info });
    } catch (error) {
    }
  }

  _change_password_modal = React.createRef();
  _user_status() {
    if (this.state.user_info) {
      return (
        <>
          <ChangePasswordModal ref={this._change_password_modal} />
          <Dropdown overlay={this.user_menu}>
            <div>
              <UserOutlined />
              <span style={{ margin: "0 10px" }}>
                {this.state.user_info.nickname}
              </span>
            </div>
          </Dropdown>
          <Button style={{ margin: "0 10px 0 0" }} onClick={() => {
            requests.logout();
            this.setState({ user_info: null });
            window.location.reload();
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

  _admin_menu() {
    if (this.state.user_info && this.state.user_info.is_admin) {
      return (
        <Menu.SubMenu title="管理員選項" icon={<MoreOutlined />}>
          <Menu.Item key="TagPage" icon={<TagOutlined />}>
            標籤管理
          </Menu.Item>
          <Menu.Item key="FileManagePage" icon={<FolderOpenOutlined />}>
            文件管理
          </Menu.Item>
          <Menu.Item key="UserManage" icon={<UserOutlined />}>
            使用者管理
          </Menu.Item>
        </Menu.SubMenu>
      );
    }
  }

  render() {
    return (
      <Layout>
        <Layout.Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            onClick={this.menu_on_click}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              首頁
            </Menu.Item>
            <Menu.Item key="2" icon={<UnorderedListOutlined />}>
              文章列表
            </Menu.Item>
            <Menu.Item key="Calendar" icon={<CalendarOutlined />}>
              科技部日曆
            </Menu.Item>
            {this._admin_menu()}
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
            className="site-layout-background"
            style={{
              margin: '24px 0 0 16px',
              padding: '12px 12px 0px 12px',
              minHeight: 280,
            }}
          >
            <UserInfoContext.Provider value={this.state.user_info}>
              <div className="site-content">
                {this.state.content}
              </div>
            </UserInfoContext.Provider>
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

