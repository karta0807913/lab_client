import React from 'react';
import styles from "./EditImage.module.scss";

const language = require(`../language/${process.env.REACT_APP_LANGUAGE}.json`);

export default class EditImage extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = {
            src: this.props.src
        };
        this._onChange = this.props.onChange || function(){};
        this._fileinput = document.createElement("input");
        this._fileinput.type = "file";
        this._fileinput.onchange = this.onChange.bind(this);
    }

    async changeImage() {
        this._fileinput.click();
    }

    async onChange() {
        if(!this._fileinput.files[0]) {
            return;
        }
        try {
            let reader = new window.FileReader();
            reader.onload = (target) => {
                let image = new window.Image();
                image.onload = () => {
                    let canvas = document.createElement('canvas');
                    let proportion = image.width / image.height;
                    let width = image.width;
                    let height = image.height;
                    if(this.props.maxWidth && width > this.props.maxWidth) {
                        width = this.props.maxWidth;
                        height = width / proportion;
                    }
                    if(this.props.maxHeight && height > this.props.maxHeight) {
                        height = this.props.maxHeight;
                        width = height * proportion;
                    }
                    canvas.width = width;
                    canvas.height= height;
                    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(async (blob) => {
                        let file = new window.File([blob], "resized.jpg", {
                            type: "image/png"
                        });
                        try {
                            await this._onChange(null, file);
                            let dataurl = canvas.toDataURL();
                            this.setState({ src: dataurl });
                        } catch(error) {
                        }
                    });
                };
                image.src = target.target.result;
            };
            reader.readAsDataURL(this._fileinput.files[0]);
        } catch(error) {
            this._fileinput.click();
            this._onChange(error);
        }
    }

    render() {
        return <div className={`${styles.div} ${this.props.className}`}>
                 <img
                   src={this.state.src}
                   onClick={this.changeImage.bind(this)}
                   alt={this.props.alt || language.change_image}
                   className={ styles.img }
                   style={ this.props.style }
                 />
               </div>;
    }
}