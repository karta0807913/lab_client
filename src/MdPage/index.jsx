import React from "react";
import { Alert, Button, Modal, Input, Tag, Dropdown, Menu } from "antd";

import { PaperClipOutlined } from "@ant-design/icons";

import MarkdownEditor from "../MarkdownEditor";
import TagSelect from "../TagSelect";
import FileUploadForm from "./FileUploadForm";

import { UserInfoContext } from "../global";

import * as requests from "../requests";
import "./style.scss";

export default class MdPage extends React.Component {

  static FileNotFoundError = 1;
  static PermissionDeniedError = 2;
  static UnknowError = 3;

  _editor = React.createRef();
  _title_input = React.createRef();
  _select = React.createRef();
  _upload_form = React.createRef();

  state = {
    readOnly: true,
    title: "檔案讀取中",
    markdown: "# 請稍候...",
    error: null,
    id: this.props.id,
    modal_visible: false,
    tag_list: [],
    file_list: [],
    owner: {},
    uploadFileButtonLoading: false,
  };

  editMode = () => {
    this.setState({ readOnly: false });
  }

  readMode = () => {
    this.setState({ readOnly: true });
  }

  cancel = () => {
    this._editor.current.reset();
    this.readMode();
  }

  _create_blog = async () => {
    this._editor.current.lock();
    let markdown = this._editor.current.getMarkdown();
    let title = this.state.title;
    let tag_list = this._select.current.selected_tag_list();
    try {
      let result = await requests.new_blog(title, markdown, tag_list);
      this.setState({ id: result.blog_id, tag_list: this._select.current.selected_tag_list_with_detail() });
    } catch (error) {
      throw error;
    } finally {
      this._editor.current.resume();
    }
  }

  submit = async () => {
    if (!this.state.id) {
      // create new blog
      try {
        await this._create_blog();
        this.setState({ readOnly: true });
      } catch (error) {
        console.log(error);
      }
    } else {
      // update blog
      let markdown = this._editor.current.getMarkdown();
      let title = this.state.title;
      let tag_list = this._select.current.selected_tag_list();
      let { new_tag, deleted_tag } = this._diff_tag_list(this.state.tag_list.map(element => element.id), tag_list);
      for (let tag of new_tag) {
        requests.add_blog_tag(this.state.id, tag).catch(console.log);
      }
      for (let tag of deleted_tag) {
        requests.delete_blog_tag(this.state.id, tag).catch(console.log);
      }
      try {
        await requests.update_blog(this.state.id, title, markdown);
        this.setState({ readOnly: true, tag_list: this._select.current.selected_tag_list_with_detail() });
      } catch (error) {
        this._editor.current.resume();
      }
    }
  }

  _set_file_list = (file_list) => {
    this.setState({ file_list });
  }

  _diff_tag_list(prevTag, nextTag) {
    let prevSet = new Set(prevTag);
    let new_tag = [];
    while (nextTag.length !== 0) {
      let tag_id = nextTag.shift();
      if (!prevSet.delete(tag_id)) {
        new_tag.push(tag_id);
      }
    }
    return { new_tag, deleted_tag: [...prevSet] };
  }

  _show_modal = () => {
    if (!this.state.readOnly) {
      this.setState({ modal_visible: true });
    }
  }

  _hide_modal = () => {
    this.setState({ modal_visible: false });
  }

  _change_title = () => {
    let title = this._title_input.current.input.value;
    this.setState({ title, modal_visible: false });
  }

  _upload_file_button = async () => {
    this.setState({ uploadFileButtonLoading: true });
    if (!this.state.id) {
      await this._create_blog();
    }
    this.setState({ uploadFileButtonLoading: false });
    this._upload_form.current.show();
  }

  set_context(title, markdown, readOnly = this.props.useDefault) {
    this.setState({
      title, markdown, readOnly, owner: {},
    });
  }

  async load_data() {
    if (!this.state.id || this.props.useDefault) {
      this.set_context(
        this.props.title || "新檔案1.md",
        this.props.markdown || "",
      );
      return;
    }

    try {
      let result = await requests.get_blog(this.state.id);
      this._upload_form.current.set_file_list(result.file_list);
      this.setState({
        title: result.title,
        markdown: result.context,
        tag_list: result.tag_list.map(element => element.tag_info),
        owner: result.owner,
        file_list: result.file_list,
      });
    } catch (error) {
      if (error.message === "record not found") {
        this.setState({ error: MdPage.FileNotFoundError });
      } else {
        console.log(error);
        this.setState({ error: MdPage.UnknowError });
      }
    }
  }

  componentDidMount() {
    this.load_data();
  }

  _errors() {
    switch (this.state.error) {
      case MdPage.FileNotFoundError:
        return (
          <Alert
            message="檔案未找到"
            description="請確定您輸入的是正確的參數"
            type="error"
            closable
          />
        );
      case MdPage.UnknowError:
        return (
          <Alert
            message="未知的錯誤"
            description="請聯絡系統管理員"
            type="error"
            closable
          />
        );
    }
  }

  _file_list_button = (user_info) => {
    if (!this.state.file_list || this.state.file_list.length === 0) {
      return;
    }
    if (this.state.readOnly && user_info) {
      let menu = [];
      for (let file of (this.state.file_list || [])) {
        menu.push(
          <Menu.Item key={file.file_id}>
            <a
              href={requests.concat_url("/file/download?id=" + file.file_id)}
            >
              {file.file_name}
            </a>
          </Menu.Item>
        );
      }
      return (
        <Dropdown overlay={
          <Menu>
            {menu}
          </Menu>
        }>
          <PaperClipOutlined className="paper-clip" />
        </Dropdown>
      );
    }
  }

  _edit_button = (user_info) => {
    if (user_info &&
      (user_info.is_admin || user_info.user_id == this.state.owner.user_id)) {
      if (this.state.readOnly) {
        if (this.state.error !== MdPage.FileNotFoundError &&
          this.state.error !== MdPage.UnknowError) {
          return (
            <>
              <Button onClick={this.editMode}>
                編輯
              </Button>
            </>
          );
        }
      } else {
        return (
          <>
            <Button
              className="paper-clip"
              loading={this.state.uploadFileButtonLoading}
              onClick={this._upload_file_button}
            >
              <PaperClipOutlined />
            </Button>
            <Button
              onClick={this.cancel}
              type="primary"
              danger
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={this.submit}
            >
              儲存
            </Button>
          </>
        );
      }
    }
  }

  _show_tag() {
    if (!this.state.readOnly) {
      return (
        <TagSelect
          placeholder="新增標籤"
          className="select"
          searchedTagList={this.state.tag_list}
          ref={this._select} />
      );
    } else {
      let result = [];
      for (let tag_list of this.state.tag_list) {
        result.push(<Tag key={tag_list.id}>{tag_list.name}</Tag>);
      }
      return (
        <div className="select">
          {result}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="mdpage">
        {this._errors()}
        <Modal
          visible={this.state.modal_visible}
          title="修改檔案名稱"
          onOk={this._change_title}
          onCancel={this._hide_modal}
        >
          <Input ref={this._title_input} defaultValue={this.state.title} />
        </Modal>
        <FileUploadForm
          ref={this._upload_form}
          callback={this._set_file_list}
          blog_id={this.state.id}
        />
        <div className="header">
          <Button
            className="title"
            type="text"
            onClick={this._show_modal}
          >
            {this.state.title}
          </Button>
          <UserInfoContext.Consumer>
            {this._file_list_button}
          </UserInfoContext.Consumer>
          {this._show_tag()}
          <div>
            <UserInfoContext.Consumer>
              {this._edit_button}
            </UserInfoContext.Consumer>
          </div>
        </div>
        <MarkdownEditor
          ref={this._editor}
          markdown={this.state.markdown}
          readOnly={this.state.readOnly}
          className="editor" />
      </div>
    );
  }
}