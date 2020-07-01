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
import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, Redirect } from "react-router-dom";

import DemoNavbar from "../admin/components/Navbars/DemoNavbar.jsx";
import Footer from "../admin/components/Footer/Footer.jsx";
import Sidebar from "../admin/components/Sidebar/Sidebar.jsx";
import AdminLogin from "../views/admin/AdminLogin.jsx";
import routes from "admin_routes.js";
import AppDataManager from "../components/AppDataManager";
import { logIn, logOut } from "../store/auth/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Notification from "components/Notification.jsx";
var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info",
    };
    this.mainPanel = React.createRef();
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  };
  handleBgClick = (color) => {
    this.setState({ backgroundColor: color });
  };

  render() {
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={routes}
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
        />
        <div className="main-panel-admin" ref={this.mainPanel}>
          <DemoNavbar {...this.props} />
          <Notification {...this.props}></Notification>
          <Switch>
            <Route
              path="/admin/login"
              render={(props) => <AdminLogin {...props} />}
            />
            {this.props.isAuth ? (
              routes.map((prop, key) => {
                return (
                  <Route
                    path={prop.layout + prop.path}
                    render={(props) => <prop.component {...props} />}
                    key={key}
                  />
                );
              })
            ) : (
              <Redirect to="/admin/login" />
            )}
          </Switch>
          <Footer fluid />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuth,
  };
};

const mapDispatchToProps = {
  logIn,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
