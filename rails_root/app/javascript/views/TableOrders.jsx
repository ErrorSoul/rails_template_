import React from "react";

// reactstrap components

import Gradus from "./Gradus.jsx";
import { connect } from "react-redux";
import UserDashboard from "./UserDashboard.jsx";

class TableOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const auth = this.props.isAuth;
    return (
      <div style={{marginTop: '5rem'}} className="col-12">
        <div className='col-12'>


         { auth &&
              <UserDashboard/> }
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
export default connect(mapStateToProps)(TableOrders);
