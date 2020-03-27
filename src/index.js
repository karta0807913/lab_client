import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LoginPage from "./LoginPage.js";
import FileList from "./FileList.js";
import FileBrowser from "./FileBrowser.js";
import * as serviceWorker from './serviceWorker';
import { Switch, Router, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

let history = createBrowserHistory();
window._history = history;

ReactDOM.render(<Router history={ history }>
                  <Switch>
                    <Route exact path="/">
                      <LoginPage />
                    </Route>
                    <Route path="/index">
                      <FileList />
                    </Route>
                    <Route path="/view">
                      <FileBrowser />
                    </Route>
                  </Switch>
                </Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
