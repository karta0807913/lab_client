import React from 'react';
import document from "../img/files/document.png";
import document_icon from "../img/files/document_icon.png";
import ppt from "../img/files/ppt.png";
import ppt_icon from "../img/files/ppt_icon.png";
import word from "../img/files/word.png";
import word_icon from "../img/files/word_icon.png";
import unknow from "../img/files/unknow.png";
import unknow_icon from "../img/files/unknow_icon.png";
import img_icon from "../img/files/img_icon.png";
import { concat_url } from "../requests";

import style from "./style.module.scss";

function fileTypeImage(ctype) {
  switch (ctype) {
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return [word, word_icon];
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return [ppt, ppt_icon];
    default:
      return [unknow, unknow_icon];
  }
}

export default class FileBlock extends React.Component {
  render() {
    let img, icon;
    if (this.props.info["Context-Type"].substring(0, 6) === "image/") {
      icon = img_icon;
      img = concat_url(`/file/download?id=${this.props.info.file_id}`).toString();
    } else {
      [img, icon] = fileTypeImage(this.props.info["Context-Type"]);
    }
    return (
      <div
        className={style.file_block}
        onClick={this.props.onClick}
      >
        <div className={style.file_image}>
          <img src={img} />
        </div>
        <div className={style.file_info}>
          <span className={style.file_info_img}>
            <img src={icon}>
            </img>
          </span>
          <span className={style.file_info_txt}>
            {this.props.info.file_name || "未命名"}
          </span>
        </div>
      </div>
    );
  }
}