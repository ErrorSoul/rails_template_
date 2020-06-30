import React from "react";
import CardLave from "./CardLave.jsx";
import CardMainList from "./CardMainList.jsx";
import { connect } from "react-redux";

class Offers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const auth = this.props.isAuth;
    const userID = this.props.userID;

    return (
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 p-5 marginTOP">
              <div className="row">
                <h1 className="stats-p-30-days">Офферы</h1>
              </div>
            </div>
            <div className="col-12">
              {auth && <CardMainList userID={userID} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuth,
    userID: state.auth.userID,
  };
};
export default connect(mapStateToProps)(Offers);
