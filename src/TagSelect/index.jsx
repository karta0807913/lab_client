import React from "react";
import BlogTag from "./BlogTag";

import { Select } from 'antd';

import * as requests from "../requests";

export default class TagSelect extends React.Component {
  state = {
    tag_list: [],
    searched_tag_list: new Set(),
    dom_tag_list: []
  }

  load_tags = async () => {
    let tags = await requests.list_tag();
    for (let index in tags) {
      if (this.state.searched_tag_list.has(tags[index].id)) {
        tags.splice(index, 1);
      }
    }
    this.setState({ tag_list: tags });
  }

  selected_tag = async (tag_id) => {
    this.state.searched_tag_list.add(tag_id);
    let index = this.state.tag_list.findIndex(info => info.id === tag_id);
    if (index >= 0) {
      let [tag_info] = this.state.tag_list.splice(index, 1);
      this.state.dom_tag_list.push(
        <BlogTag
          tag_info={tag_info}
          onClose={this.remove_selected_tag}
          key={tag_info.id} />
      );
      this.setState({
        tag_list: this.state.tag_list,
        dom_tag_list: [...this.state.dom_tag_list]
      });
      this.props.onSelect && this.props.onSelect(tag_info);
    }
  }

  remove_selected_tag = async (tag_info) => {
    this.state.tag_list.push(tag_info);
    this.state.searched_tag_list.delete(tag_info.id);
    let index = this.state.dom_tag_list.findIndex(dom => dom.key == tag_info.id);
    this.state.dom_tag_list.splice(index, 1);
    this.setState({ tag_list: this.state.tag_list, dom_tag_list: [...this.state.dom_tag_list] });
    this.props.onRemove && this.props.onRemove(tag_info);
  }

  componentDidMount() {
    if (this.props.searchedTagList) {
      for (let info of this.props.searchedTagList) {
        this.state.searched_tag_list.add(info.id);
        this.state.dom_tag_list.push(
          <BlogTag
            tag_info={info}
            onClose={this.remove_selected_tag}
            key={info.id} />
        );
      }
    }
    this.setState({ dom_tag_list: [...this.state.dom_tag_list] });
    this.load_tags();
  }

  set_selected_tag_list(list) {
    for (let info of list) {
      this.state.searched_tag_list.add(info.id);
    }
    this.setState({ searched_tag_list: this.state.searched_tag_list });
  }

  selected_tag_list() {
    return [...this.state.searched_tag_list];
  }

  selected_tag_list_with_detail() {
    return this.state.dom_tag_list.map(dom => dom.props.tag_info);
  }

  _tag_list() {
    let result = [];
    for (let option of this.state.tag_list) {
      result.push(<Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>);
    }
    return result;
  }

  render() {
    return (
      <div className={this.props.className}>
        <Select
          showSearch
          ref={this._select_ref}
          style={{ width: 100 }}
          placeholder={this.props.placeholder || "搜尋標籤"}
          onSelect={this.selected_tag}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {this._tag_list()}
        </Select>
        {this.state.dom_tag_list}
      </div>
    );
  }
}