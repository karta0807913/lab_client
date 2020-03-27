import $ from "jquery";
import React from 'react';

import * as feather from "feather-icons";

import FormInput from "./FormInput";
import styles from "./Editable.module.scss";

import "jquery-datetimepicker/build/jquery.datetimepicker.min.css";
import "jquery-datetimepicker/build/jquery.datetimepicker.full.min.js";

const language = require(`../language/${process.env.REACT_APP_LANGUAGE}.json`);

export default class Editable extends React.Component {

    constructor(props, ...args) {
        super(props, ...args);
        this._text = React.createRef();
        this._onSubmit = props.onSubmit || function(){};
        this._onGenerate = props.onGenerate || function(){};
        this._value = this.props.value || this.props.children;
        this._type = this.props.type;
        this._not_null = this.props.NN === undefined || this.props.NN;
        this._null = this.props.empty || language.none;
        if(this._type === "date") {
            this._type = "text";
        }
        this.state = {
            focus: false
        };
    }

    componentDidUpdate() {
        this._onGenerate(this._text.current);
    }

    render() {
        if(this.state.focus) {
            this.props.onShow && this.props.onShow();
            return <div className={this.props.className}>
                     <FormInput
                       inputRef={ this._text }
                       defaultValue={ this._value }
                       type={ this._type || "text" }
                       maxLength={this.props.maxLength}
                       minLength={this.props.minLength}
                       max={this.props.max}
                       min={this.props.min}
                       require={this.props.require}
                       placeholder={this.props.placeholder}
                       className={ styles.form_input }
                     >
                       <button className={`btn btn-primary ${ styles.submit_button }`}
                               dangerouslySetInnerHTML={{__html:feather.icons.check.toSvg()}} onClick={async ()=>{
                                   try {
                                       var current = $(this._text.current);
                                       var val = current.val();
                                       if(val === this._value || (this._not_null && !val)) {
                                           return this.setState({ focus: false });
                                       }
                                       if(this.props.type === "number") {
                                           val = parseInt(val);
                                       }
                                       if(this.props.type === "datetime") {
                                           val = val.replace(/ /g, "");
                                       }
                                       await this._onSubmit(val);
                                       this._value = val;
                                       this.setState({ focus: false });
                                   } catch(error) {
                                   }
                               }}/>
                       <button className="btn btn-danger"
                               dangerouslySetInnerHTML={{__html:feather.icons.x.toSvg()}} onClick={()=>{
                                   this.setState({ focus: false });
                               }}/>
                     </FormInput>
                   </div>;
        } else {
            this.props.onClose && this.props.onClose();
            return <div onClick={()=>{ this.setState({ focus: true }); }} className={this.props.className}>
                     <p className={ styles.editable_text }>{ this._value || this._null }</p>
                   </div>;
        }

    }
}