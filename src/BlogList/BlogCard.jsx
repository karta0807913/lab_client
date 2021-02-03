import React from "react";

import { getUser } from "../userset";
import { Skeleton, Card, Avatar, Tag } from 'antd';
import {
  DeleteTwoTone
} from '@ant-design/icons';

import style from "./style.module.scss";

export default class BlogCard extends React.Component {
  state = {
    current_info: {},
    loading: true,
    display: "block"
  }

  on_icon = false

  async set_info(info) {
    let user_info = await getUser(info.user_id);
    info.owner = user_info;
    let date = new Date(info.create_time);
    let description = "於" + date.toISOString().substr(0, 10) + "建立";
    let durning = Date.now() - date;
    durning /= 1000;
    if (durning < 60) {
      description = "在幾秒前建立";
    } else if ((durning /= 60) < 60) {
      description = `在${parseInt(durning)}分鐘前建立`;
    } else if ((durning /= 60) < 24) {
      description = `在${parseInt(durning)}小時前建立`;
    } else if ((durning /= 24) < 7) {
      description = `在${parseInt(durning)}天前建立`;
    }
    info.description = `${user_info.nickname}${description}`;
    this.setState({ current_info: info, loading: false });
  }

  _show_tag() {
    if (this.state.current_info.blog_id) {
      let result = [];
      for (let tag_list of this.state.current_info.tag_list) {
        let tag_info = tag_list.tag_info;
        result.push(<Tag key={tag_info.id}>{tag_info.name}</Tag>);
      }
      return (
        <div className={style.card_cover}>
          {result}
        </div>
      );
    }
  }

  render() {
    return (
      <Card
        className={style.card}
        style={{ display: this.state.display }}
        cover={this._show_tag()}
        actions={[
          <DeleteTwoTone twoToneColor="#ff0000"
            onClick={() => {
              this.on_icon = true;
              if (
                this.props.onDelete &&
                window.confirm(`確定刪除 ${this.state.current_info.title}?`)
              ) {
                this.props.onDelete(this.state.current_info.blog_id);
              }
            }} />
        ]}
        hoverable={true}
        onClick={() => {
          if (this.on_icon) {
            this.on_icon = false;
            return;
          }
          if (!this.state.loading) {
            this.props.onClick(this.state.current_info.blog_id);
          }
        }}
      >
        <Skeleton loading={this.state.loading} avatar active>
          <Card.Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title={this.state.current_info.title}
            description={this.state.current_info.description}
          />
        </Skeleton>
      </Card>
    );
  }
}