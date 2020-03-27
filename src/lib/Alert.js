import React from "react";
import ReactDom from "react-dom";
import $ from "jquery";
import style from "./Alert.module.scss";

export function alert(children) {
  if (typeof children !== "string") {
    children = children.toString();
  }
  let container = document.getElementById("alert_container");
  if(!container) {
    container = document.createElement("div");
    container.setAttribute("id", "alert_container");
    container.className = style.alert_div;
    document.body.appendChild(container);
  }
  let div = document.createElement("div");
  container.appendChild(div);
  ReactDom.render(
    <Alert onClose={()=>{
      container.removeChild(div);
    }}>
      { children }
    </Alert>,
    div
  );
}

class Alert extends React.Component {
  constructor(...args) {
    super(...args);
    this._alert_ref = React.createRef();
  }
  render() {
    return <div
                 className={`alert alert-warning alert-dismissible ${style.alert} fade show`}
                 role="alert"
                 ref={ this._alert_ref }
             >
               { this.props.children }
               <button type="button"
                       className={`close ${style.close}`}
                       aria-label="Close" onClick={()=> {
                         $(this._alert_ref.current).alert("close");
                         this.props.onClose && this.props.onClose();
                       }}>
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>;
  }
}