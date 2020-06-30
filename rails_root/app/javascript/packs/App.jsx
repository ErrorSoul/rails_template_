/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import rootReducer from '../store/reducers';
import { loadState, saveState } from 'components/localStorage';
import "./application.scss";



const initialState = {
		isAuth: false,
		isLoading: false,
};

const ACTION_LOG_IN  = 'ACTION_LOG_IN';

const actionIsLoggin = {
		type: ACTION_LOG_IN,
		payload: null
};

// const rootReducer = (state = initialState, action) => {
// 		return state;
// };

const persistedState = loadState();

const store = createStore(rootReducer, persistedState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.subscribe(() => {
	saveState(store.getState());
})

import AdminLayout from "../layouts/Admin.jsx";
const hist = createBrowserHistory();

const MainComponent = () => {
		return(
				<Router history={hist}>
						<Switch>
							<Route path="/main" render={props => <AdminLayout {...props} />} />
								<Redirect to="/main/dashboard" />
						</Switch>
					</Router>
		);
};

const WrappedMainComponent = MainComponent;


document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
				<Provider store={store}>
					<WrappedMainComponent></WrappedMainComponent>
				</Provider>,
				document.getElementById("root")
    );
})
