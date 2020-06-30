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
/*eslint-disable*/
import React from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import { connect } from 'react-redux';

// reactstrap components
import {
  UncontrolledAlert,
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

class Notification extends React.Component {
  state = {
    visible: true
  };
  notificationAlert = React.createRef();


  notify(place) {
    var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {this.props.message}
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 3
    };
    this.notificationAlert.current.notificationAlert(options);
  }


	componentDidUpdate(prevProps) {
		// Популярный пример (не забудьте сравнить пропсы):
		if (this.props.showNotik !== prevProps.showNotik) {
			this.notify('tr');
		}
	}

  render() {
    return (
        <div className="notik">
          <NotificationAlert ref={this.notificationAlert} />
        </div>
    );
  }
}


const mapStateToProps = (state) => {
	return {
		showNotik: state.notik.showNotik,
		message: state.notik.message
	};
};

export default connect(mapStateToProps)(Notification);
