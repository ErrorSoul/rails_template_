/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

*/
import React from 'react';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';
import { Route, Switch, Redirect } from 'react-router-dom';

import DemoNavbar from 'components/Navbars/DemoNavbar.jsx';
import Footer from 'components/Footer/Footer.jsx';
import Sidebar from 'components/Sidebar/Sidebar.jsx';
import FixedPlugin from 'components/FixedPlugin/FixedPlugin.jsx';
import Notification from 'components/Notification.jsx';
import { connect } from 'react-redux';


import routes from 'routes.js';

let ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: 'black',
      activeColor: 'info',
      checkT: false,
    };
    this.mainPanel = React.createRef();
  }

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current);
      document.body.classList.toggle('perfect-scrollbar-on');
    }
  }

  componentDidUpdate(e) {
    if (e.history.action === 'PUSH') {
      this.mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps.destroy();
      document.body.classList.toggle('perfect-scrollbar-on');
    }
  }

  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  };

  handleBgClick = (color) => {
    this.setState({ backgroundColor: color });
  };

  checkTrue = () => {
    console.log('i m work, im work');
    this.setState({ checkT: !this.state.checkT });
  }


  render() {
    const { isAuth } = this.props;
		  const authRoutes =								(
  <Switch>
    {routes.map((prop, key) => (
      <Route
        path={prop.layout + prop.path}
        render={(props) => <prop.component {...prop} />}
        key={key}
      />
    ))}
  </Switch>
    );


    const AllRoutes = (props) => {
			// первый идет логин
			// и офферы 7 по счету, надо исправить
      const myRoutes = [routes[0], routes[2], routes[3]];
      return (
        <Switch>
          {myRoutes.map((prop, key) => (
            <Route
              path={prop.layout + prop.path}
              render={(props) => <prop.component {...props} />}
              key={key}
            />
          ))}
          <Redirect to="/main/login" />
        </Switch>
      );
    };

    return (
      <div className="main-panel main-panel-padding" ref={this.mainPanel}>
        <DemoNavbar {...this.props} isAuthed={this.checkTrue} />
				<Notification {...this.props} ></Notification>
        { isAuth ? authRoutes : <AllRoutes {...this.props}/> }
        <Footer fluid />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
});
export default connect(mapStateToProps)(Dashboard);
