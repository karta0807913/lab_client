import React from 'react';

export default class DataSelect extends React.Component {

    constructor(...props) {
        super(...props);
        this.state = {
            dataset: []
        };
        this._select_props = {
            ...this.props
        };
        delete this._select_props.selectRef;
        delete this._select_props.title;
        delete this._select_props.className;
        delete this._select_props.getdata;
        this._selectRef = this.props.selectRef || React.createRef();
    }

    async componentDidMount() {
        try {
            const dataset = await this.props.getdata();
            this.setState({ dataset });
        } catch(error) {
            console.log(error);
        }
    }

    selected_item() {
        return this._selectRef.current.value;
    }

    render() {
        let options = [];
        for(let i = 0; i < this.state.dataset.length; ++i) {
            let data = this.state.dataset[i];
            options.push(<option value={data.value} key={data.key}>{ data.text }</option>);
        }

        return <div className={`input-group flex-nowrap ${this.props.className}`}>
                 { this.props.title ?
                   <div key={this._divKey} className="input-group-prepend">
                     <span className="input-group-text">{ this.props.title }</span>
                   </div>
                   : ""}
                 <select
                   { ...this._select_props }
                   ref={this._selectRef}
                   className="form-control"
                 >
                   { options }
                 </select>
                 { this.props.children ?
                   <div className="input-group-append">
                     { this.props.children }
                   </div>
                   : "" }
               </div>;
    }
}