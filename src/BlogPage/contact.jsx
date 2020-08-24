import React from "react";

import style from "./style.module.scss";

export default class Contact extends React.Component {
  render() {
    return (
      <section id="contact" className={`${style["bg-gray"]} ${style["section"]}`}>
        <div className="container marginbot-50">
          <div className="section-heading text-center">
            <h2 className="h-bold animated bounceInDown go">與我聯繫</h2>

            <div className="divider-header"></div>
            <a href="#" title="ecsemtchen@gmail.com">ecsemtchen@gmail.com</a>
            <br />
            <a href="#" title="mtchen@ncut.edu.tw">mtchen@ncut.edu.tw</a>
          </div>

        </div>

      </section>
    );
  }
}