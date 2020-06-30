import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "../layouts/RealAdmin.jsx";
import { createStore } from 'redux';
import rootReducer from '../store/reducers';
import { withRouter } from 'react-router-dom';
import AppDataManager from '../components/AppDataManager';
import { adminLogIn, logOut } from "../store/auth/actions";
import { Spinner } from "reactstrap";

class AdminMain extends React.Component {
	_isMounted: false

	constructor(props) {
    super(props);
    this.state = {
			isLoading: false,
    };

	}

	componentDidMount() {
		this._isMounted = true;
		this.fetchAuthAdmin();
  }

	componentWillUnMount() {
		this._isMounted = true;
		this.fetchAuthAdmin();
  }

	async fetchAuthAdmin() {
    this._isMounted && this.setState({isLoading: true});

    try {
     const {isAuth, login}  = await AppDataManager.api(`/auth_auth`);

		 this.props.adminLogIn(login);

    } catch (e) {
			this.props.logOut()
      console.warn(e)
      return
    } finally {
      this.setState({isLoading: false});
    }
    if (!this._isMounted) {return}

  }

	render() {
		const isLoad = this.state.isLoading;
    if (isLoad) {
      return  <Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="secondary" />;
    }
		return(
			<Switch>
				<Route path="/admin" render={props => <AdminLayout {...props} />} />
				<Redirect to="/admin/dashboard" />
			</Switch>
		);
	}

}

const mapDispatchToProps = {
  adminLogIn,
	logOut
};



export default withRouter(connect(null, mapDispatchToProps)(AdminMain));
