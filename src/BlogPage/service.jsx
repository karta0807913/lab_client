import React from "react";

import style from "./style.module.scss";

export default class Service extends React.Component {
  render() {
    return (
      <section id="service" className={`${style["bg-gray"]} ${style["section"]}`}>
        <div className="container marginbot-50">
          <div className="section-heading text-center">
            <h2 className="h-bold">產學合作項目</h2>
            <div className={style["divider-header"]}></div>
          </div>
        </div>

        <div className="text-center">
          <div className="container">

            <div className={style["service"]}>
              <div className="col-md-4">
                <div className="animated rotateInDownLeft go">
                  <div className={style["service-box"]}>
                    <div className={style["service-icon"]}>
                      <span className={style["fa-laptop"]}></span>
                    </div>
                    <div className="service-desc">
                      <h5>Web Design (網頁設計)</h5>
                      <div className={style["divider-header"]}></div>
                      <p>
                        前後端網頁平台設計與開發，包含相關API設計與開發。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="animated rotateInDownLeft slow go">
                  <div className={style["service-box"]}>
                    <div className={style["service-icon"]}>
                      <span className={style["fa-terminal"]}></span>
                    </div>
                    <div className="service-desc">
                      <h5>Linux System 架設與佈屬</h5>
                      <div className={style["divider-header"]}></div>
                      <p>
                        Linux Ubuntu &amp;&amp; Windows系統環境架設與相關套件安裝與佈屬。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="animated rotateInDownLeft slower go">
                  <div className={style["service-box"]}>
                    <div className={style["service-icon"]}>
                      <span className={style["fa-code"]}></span>
                    </div>
                    <div className="service-desc">
                      <h5>Programming Design</h5>
                      <div className={style["divider-header"]}></div>
                      <p>
                        自動化系統開發與設計(python 工單排程模組撰寫)，與AI課程教學(Keras與TensorFlow教學)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
}