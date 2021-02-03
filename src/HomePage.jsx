import React from "react";

import MdPage from "./MdPage";

import * as requests from "./requests";

export default class HomePage extends React.Component {

  mdpage = React.createRef();

  async componentDidMount() {
    let blog = await requests.homepage();
    this.mdpage.current.set_context(blog.title, blog.context);
  }

  render() {
    return (
      <MdPage
        readOnly
        id={1}
        ref={this.mdpage}
        useDefault
        title={"loading..."}
        markdown={""}
      />
    );
  }
}