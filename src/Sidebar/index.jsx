import React from "react";
import ncut from "../img/ncut.png";

import { Link } from "react-router-dom";

import { alert } from "../lib/Alert";
import * as requests from "../requests";
import style from "./style.module.scss";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      me: null,
      is_shown: false,
      login: false
    };
    console.log(window._history);
    this._sidebar = React.createRef();
  }

  async componentDidMount() {
    try {
      let me = await requests.me();
      this.setState({ me });
    } catch (error) {
      console.log(error);
      alert("請先登入");
    }
  }

  login_button() {
    if (!this.state.me) {
      return (
        <Link
          to={`${process.env.PUBLIC_URL}/login`}
          className="btn btn-primary"
        >
          由此登入
        </Link>
      );
    } else {
      return (
        <Link to={`${process.env.PUBLIC_URL}/index`} onClick={async () => {
          this.setState({ me: null });
          await requests.logout();
        }} className="btn btn-secondary">
          登出
        </Link>
      );
    }
  }

  menu() {
    if (this.state.me) {
      return (
        <nav
          ref={this._sidebar}>
          <div className="sidebar-header">
            <h3>主選單</h3>
          </div>
          <ul className="list-unstyled components">
            <li>
              <Link to={`${process.env.PUBLIC_URL}/index`}>
                回首頁
                </Link>
            </li>
            <li>
              <Link to={`${process.env.PUBLIC_URL}/file`}>
                檔案列表
                </Link>
            </li>
          </ul>
        </nav>
      );
    } else {
      return (
        <nav
          ref={this._sidebar}>
          <div className="sidebar-header">
            <h3>主選單</h3>
          </div>
          <ul className="list-unstyled components">
            <li>
              <Link to={`${process.env.PUBLIC_URL}/index`}>
                回首頁
                </Link>
            </li>
          </ul>
        </nav>
      );
    }
  }

  render() {
    return (
      <div className={style.wrapper}>
        <div
          className={`${style.sidebar} ${this.state.is_shown ? style.show : ""}`}
        >
          {this.menu()}
        </div>
        <div className={style.right_context}>
          <div className={style.header}>
            <div className={style.header_title}>
              <button
                type="button"
                className={`${style["sidebarCollapse"]} ${this.state.is_shown ? style["show"] : ""}`}
                onClick={() => {
                  this.setState({ is_shown: !this.state.is_shown });
                }}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <img src={ncut} width="50px" height="50px" />
              <span>數位安全研究室</span>
            </div>
            <div className={style.login_button}>
              {this.login_button()}
            </div>
          </div>
          <div className={style.main_context}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}