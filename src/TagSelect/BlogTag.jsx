import React from "react";

import { Tag } from "antd";

export default class BlogTag extends React.Component {
  render() {
    return (
      <Tag closable onClose={() => {
        this.props.onClose(this.props.tag_info);
      }}>
        {this.props.tag_info.name}
      </Tag>
    );
  }
}