import React from 'react';
import Form from "./lib/Form";
import FormInput from "./lib/FormInput";
import style from "./LoginPage.module.scss";
import BootModel from "./lib/BootModal";

import { alert } from "./lib/Alert";

import * as requests from "./requests";

export default class LoginPage extends React.Component {
  constructor(...args) {
    super(...args);
    this._form = React.createRef();
    this._account = React.createRef();
    this._password = React.createRef();
    this._sign_up = React.createRef();
    this._sign_up_form = React.createRef();
  }

  async componentDidMount() {
    try {
      let me = await requests.me();
      alert("已經登入過，將跳轉至首頁");
      return window._history.push(process.env.PUBLIC_URL + "/index");
    } catch (error) {
    }
  }

  async login() {
    if (this._form.current.checkValidity()) {
      try {
        let result = await requests.login(
          this._account.current.value,
          this._password.current.value
        );

        window._history.push("/index");
        alert("登入成功");
      } catch (error) {
        console.log(error);
        alert("帳號或密碼錯誤");
      }
    } else {
      alert("帳號或密碼錯誤");
    }
  }

  render() {
    return (
      <>
        <div className={style.container}>
          <BootModel
            ref={this._sign_up}
            cancel="取消"
            confirm="註冊"
            title="請輸入基本資料"
            onSubmit={async () => {
              if (this._sign_up_form.current.valid()) {
                let data = this._sign_up_form.current.raw();
                if (data.password !== data.password_confirm) {
                  alert("兩次輸入密碼不一致");
                  return;
                }
                try {
                  await requests.sign_up(data.nickname, data.account, data.password);
                  this._sign_up.current.hide();
                } catch (error) {
                  console.log(error);
                  alert("註冊失敗");
                }
              }
            }}
          >
            <Form ref={this._sign_up_form}>
              <FormInput title="暱稱" name="nickname" required />
              <FormInput title="帳號" name="account" required />
              <FormInput title="密碼"
                type="password" name="password" required />
              <FormInput title="確認密碼"
                type="password" name="password_confirm" required />
            </Form>
          </BootModel>
          <div className={style.login_page}>
            <center className="mb-3 mt-3">登入頁面</center>
            <form ref={this._form}>
              <FormInput
                type="text"
                title="account"
                inputRef={this._account}
                required
              />
              <FormInput
                type="text"
                inputRef={this._password}
                title="password"
                required
              />
            </form>
            <div className={style.btn_content}>
              <button
                className={`btn btn-primary ${style.btn}`}
                onClick={this.login.bind(this)}
              >
                登入
                 </button>
            </div>
            <div className={style.sign_up}>
              <span
                className="text-secondary"
                onClick={() => {
                  this._sign_up.current.show();
                }}>
                註冊帳號
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }
}