import React from 'react';
import ScrollCompoment from "./lib/ScrollCompoment.js";
import * as request from "./requests";

import style from "./FileList.module.scss";

export default class FileList extends ScrollCompoment {
  componentDidMount() {
    this.load_more();
  }

  async _load_more(offset) {
    let result = await request.file_list();
    let file_list = await result.json();
    console.log(file_list);
    return file_list.files;
  }

  render() {
    let list = [];
    for(let file of this.state.item_list) {
      list.push(<FileBlock
                  info={file}
                  key={file.id}
                  onClick={()=> {
                    window._file = file;
                    window._history.push("/view?id=" + file.id);
                  }}
                />);
    }
    return <div className={ style.container }>
             { list }
           </div>;
  }
}

class FileBlock extends React.Component {
  render() {
    return <div
             className={style.file_block}
             onClick={this.props.onClick}
           >
             <div className={style.file_image}>
               <img src={ this.props.info.thumbnailLink || this.props.info.iconLink }/>
             </div>
             <div className={style.file_info}>
               <span className={style.file_info_img}>
                 <img src={ this.props.info.iconLink }>
                 </img>
               </span>
               <span className={style.file_info_txt}>
                 { this.props.info.name }
               </span>
             </div>
           </div>;
  }
}