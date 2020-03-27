import React from 'react';
import FormInput from "./lib/FormInput";
import style from "./LoginPage.module.scss";

import { alert } from "./lib/Alert.js";

import * as requests from "./requests";

export default class LoginPage extends React.Component {
  constructor(...args) {
    super(...args);
    this._form = React.createRef();
    this._account = React.createRef();
    this._password = React.createRef();
  }

  async login() {
    if(this._form.current.checkValidity()) {
      try {
        let result = await requests.login(
          this._account.current.value,
          this._password.current.value
        );
        if (result.ok) {
          window._history.push("/index");
          alert("success");
        } else {
          console.log(result);
          alert("帳號或密碼錯誤");
        }
      } catch(error) {
        console.log(error);
        alert(error);
      }
    } else {
      alert("帳號或密碼錯誤");
    }
  }

  render() {
    return <div className={style.container}>
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
             </div>
           </div>;
  }
}