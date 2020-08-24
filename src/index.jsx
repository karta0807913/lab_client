import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LoginPage from "./LoginPage";
import MdPage from "./MdPage";
import FileList from "./FileList";
import Sidebar from "./Sidebar";
import FileBrowser from "./FileBrowser";
import BlogPage from "./BlogPage";
import * as serviceWorker from './serviceWorker';
import { Switch, Router, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

let history = createBrowserHistory();
window._history = history;

ReactDOM.render(<Router history={history}>
  <Switch>
    <Route exact path="/login">
      <LoginPage />
    </Route>
    <Route path="/file">
      <Sidebar>
        <FileList />
      </Sidebar>
    </Route>
    <Route path="/index">
      <Sidebar>
        <BlogPage />
      </Sidebar>
    </Route>
    <Route path="/">
      <Sidebar>
        <MdPage />
      </Sidebar>
    </Route>
  </Switch>
</Router >, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
