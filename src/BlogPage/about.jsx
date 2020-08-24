import React from "react";
import MugShot from "../img/blog/hero-bg2_opt.jpg";

import style from "./style.module.scss";

export default class About extends React.Component {
  render() {
    return (
      <section className={style.section}>
        <div className={style["marginbot-50"]}>
          <div className="section-heading text-center animated bounceInDown">
            <h2 className="h-bold">關於我自己</h2>
            <div className="divider-header"></div>
            <img
              id="site-title"
              src={MugShot}
              alt=""
            />
          </div>
        </div>

        <div className="container">
          <div className="text-center">
            <p>
              本人目前著重於應用安全實務與理論密碼研究。
            </p>
            <p>
              專長：密碼學，數位簽章，身份認證，電子錢幣，數位浮水印協定
            </p>
          </div>
        </div>
      </section>
    );
  }
}