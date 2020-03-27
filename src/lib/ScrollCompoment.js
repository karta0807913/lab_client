import React from 'react';

export default class ScrollCompoment extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            item_list: []
        };
        this._offset = 0;
        this.scroll = this.scroll.bind(this);
    }

    async load_more() {
        do {
            await this._lock;
        } while(this._lock);
        var reslove;
        this._lock = new Promise((r)=> reslove=r);
        try {
            const items = await this._load_more(this._offset);
            if(items.length === 0) { return; }
            this.setState({ item_list: this.state.item_list.concat(items) });
            this._offset += items.length;
        } finally {
            reslove();
            this._lock = undefined;
        }
    }

    async reload() {
        do {
            await this._lock;
        } while(this._lock);
        this._offset = 0;
        this.setState({ item_list: [] });
        this.load_more();
        this._add_coin_promise = undefined;
    }

    scroll(reference) {
        if(reference.current.scrollTop + reference.current.offsetHeight >= reference.current.scrollHeight) {
            this.load_more();
        }
    }
}