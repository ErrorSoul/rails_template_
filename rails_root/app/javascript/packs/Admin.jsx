import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import AdminMain from "../layouts/AdminMain.jsx";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../store/reducers";

import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { loadState, saveState } from "components/localStorage";
import "./application.scss";

const persistedState = loadState();

const store = createStore(
  rootReducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  saveState(store.getState());
});
const hist = createBrowserHistory();

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={hist}>
        <AdminMain />
      </Router>
    </Provider>,
    document.getElementById("root")
  );
});
