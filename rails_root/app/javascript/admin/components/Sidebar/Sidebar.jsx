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
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { connect } from 'react-redux';
//import logo from "logo.svg";
import AppNameLogo  from "components/AppNameLogo";

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
    this.sidebar = React.createRef();
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  componentDidMount() {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps = new PerfectScrollbar(this.sidebar.current, {
    //     suppressScrollX: true,
    //     suppressScrollY: false
    //   });
    // }
  }
  componentWillUnmount() {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps.destroy();
    // }
  }
  render() {
		const isAuth = this.props.isAuth;

    return (
      <div
        className="sidebar"
        data-color={this.props.bgColor}
        data-active-color={this.props.activeColor}
      >
        <div className="logo">
          <a
            href="/main/dashboard"
            className="simple-text logo-mini"
            style={{width: "auto"}}
          >
            <div>
             <AppNameLogo/>
            </div>
          </a>
          <a
            href="/main/dashboard"
            className="simple-text logo-normal"
          >
            Admin
          </a>
        </div>
        {isAuth && <div className="sidebar-wrapper" ref={this.sidebar}>
          <Nav>
            {this.props.routes.map((prop, key) => {
              return (
                <li
                  className={
                    this.activeRoute(prop.path) +
                    (prop.pro ? " active-pro" : "")
                  }
                  key={key}
                >
                  <NavLink
                    to={{ pathname: prop.layout + prop.path, search: '' }}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            })}
          </Nav>
        </div> }
      </div>
    );
  }
}


const mapStateToProps = (state) => {
		return {
			isAuth: state.auth.isAuth
		};
};
export default connect(mapStateToProps)(Sidebar);
