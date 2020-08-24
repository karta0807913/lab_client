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
      is_shown: false
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

  render() {
    return (
      <div className={style.wrapper}>

        <div
          className={`${style.sidebar} ${this.state.is_shown ? style.show : ""}`}
        >
          <nav
            ref={this._sidebar}>
            <div className="sidebar-header">
              <h3>主選單</h3>
            </div>
            <ul className="list-unstyled components">
              <li>
                <Link to="/index">
                  回首頁
                </Link>
              </li>
              <li>
                <Link to="/file">
                  檔案列表
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className={style.right_context}>
          <div className={style.header}>
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
          <div className={style.main_context}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}