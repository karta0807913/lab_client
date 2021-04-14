import React from "react";
import MdPage from "../MdPage";
import BlogCard from "./BlogCard";
import TagSelect from "../TagSelect";

import { Select, Card, Button } from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import * as requests from "../requests";
import style from "./style.module.scss";
import { UserInfoContext } from "../global";

export default class BlogList extends React.Component {
  _container = React.createRef();
  _select_ref = React.createRef();

  static DELETE_ERROR = 1;

  state = {
    card_instance: [],
    card_ref: [],
    error: null,
    is_end: false,
    current_edit: null,
  };

  offset = 0;
  limit = 20;
  reload = false;

  next = () => {
    if (!this.state.is_end) {
      this.offset += this.limit;
      this.load();
    }
  }

  prev = () => {
    if (this.offset - this.limit >= 0) {
      this.offset -= this.limit;
      this.load();
    }
  }

  delete = async (id) => {
    try {
      await requests.delete_blog(id);
      this.load();
    } catch (error) {
      console.log(error);
      this.setState({ error: BlogList.DELETE_ERROR });
    }
  }

  load = async () => {
    for (let card of this.state.card_ref) {
      if (card.current) {
        card.current.setState({ loading: true });
      }
    }
    let result = [];
    let tag_list = this._select_ref.current.selected_tag_list();
    if (tag_list.length == 0) {
      try {
        result = await requests.list_blog(this.limit, this.offset);
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      result = await requests.search_blog_tag(tag_list);
      result = result || [];
      result = result.map(info => info.blog_data);
    }
    this._setup_card(result);
  }

  remove_search_tag = async (tag_info) => {
    this.state.tag_list.push(tag_info);
    this.state.searched_tag_list.delete(tag_info.id);
    let id = this.state.tag_list.find(info => info.id === tag_info.id);
    this.setState({ tag_list: this.state.tag_list });
    this.offset = 0;
    this.load();
  }

  _setup_card(info_list) {
    let end = false;
    for (let index = 0; index < this.state.card_ref.length; ++index) {
      if (index < info_list.length) {
        this.state.card_ref[index].current.set_info(info_list[index]);
        this.state.card_ref[index].current.setState({
          display: "block",
        });
      } else {
        end = true;
        if (this.state.card_ref[index].current.state.display === "none") {
          break;
        }
        this.state.card_ref[index].current.setState({
          display: "none",
        });
      }
      if (end) {
        this.setState({ is_end: true });
      }
    }
  }

  edit = (id) => {
    this.setState({ current_edit: id });
  }

  _errors() {
    switch (this.state.error) {
    }
  }

  constructor(props) {
    super(props);
    this.limit = this.props.limit || this.limit;
    for (let i = 0; i < this.limit; ++i) {
      let ref = React.createRef();
      this.state.card_instance.push(
        <BlogCard
          onDelete={this.delete}
          onClick={this.edit}
          ref={ref}
          key={i + 1}
        />
      );
      this.state.card_ref.push(ref);
    }
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    if (this.reload) {
      this.load();
      this.reload = false;
    }
  }

  _tag_list() {
    let result = [];
    for (let option of this.state.tag_list) {
      result.push(<Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>);
    }
    return result;
  }

  render() {
    if (this.state.current_edit === null) {
      return (
        <>
          <div>
            <TagSelect onRemove={this.load} onSelect={() => {
              this.offset = 0;
              this.load();
            }} ref={this._select_ref} />
          </div>
          <div className={style.context}>
            {this._errors()}
            <UserInfoContext.Consumer>
              {(user_info) => {
                if (user_info) {
                  return (
                    <Card className={style.new_card} hoverable
                      onClick={() => {
                        this.setState({ current_edit: 0 });
                      }}>
                      <PlusOutlined />
                      <div className={style.text}>新增檔案</div>
                    </Card>
                  );
                }
              }}
            </UserInfoContext.Consumer>
            {this.state.card_instance}
            <div className={style.page_control}>
              <div>
                <Button
                  onClick={this.prev}
                  disabled={this.offset - this.limit < 0}
                >
                  Previous
              </Button>
                <Button onClick={this.next} disabled={this.state.is_end}>
                  Older
              </Button>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className={style.editor}>
          <div className={style.header}>
            <Button onClick={() => {
              this.reload = true;
              this.setState({ current_edit: null });
            }} >
              <ArrowLeftOutlined />
            </Button>
          </div>
          <MdPage id={this.state.current_edit} />
        </div>
      );
    }
  }
}