import React from "react";
import { Link } from "react-router-dom";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
import { connect } from "react-redux";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Button
} from "reactstrap";

import Cookies from "js-cookie";
import CardLave from "./CardLave.jsx";
import CardMainList from "./CardMainList.jsx";
import UserDashboard from "./UserDashboard.jsx";

const NumberList = (props) => {
  const numbers = [1, 2, 4, 5, 6, 7, 8, 1, 2, 4, 5, 6, 7];
  const listItems = numbers.map((number, index) => (
    <CardLave number={number} isLogin={props.isLogin} key={index} />
  ));
  return <div className="row">{listItems}</div>;
};

const Yellow = (
  <div className="col-12">
    <div className="Rectangle row no-gutters p-3 align-items-center justify-content-left">
      <div className="Oval col-3">
        <div className="triangle-right"></div>
      </div>
      <div className="col-8">
        <div className="p-2-left">
          <p className="your-know">
            Узнай как играть и легко получать за это деньги
          </p>
        </div>
      </div>
    </div>
  </div>
);

class Dashboard extends React.Component {
  render() {
    const auth = this.props.isAuth;
    const userID = this.props.userID;
    console.log("userID", userID);

    return (
      <div className="content">
        <Row>
          <Col sm="8">
            <div className="row">
              {!auth && Yellow}
              { auth &&
              <UserDashboard showLink={true} /> }

              <div className="col-12 mt-4">
                <div className="row no-gutters">
                  <div className="col-6 align-self-center">
                    <h5 className="popular-offers">Популярные офферы</h5>
                  </div>
                  <div className="col-6 align-self-center">
                    <Button className="pull-right popular-offers-button" size='sm' outline color="primary" to={"/main/offers"} tag={Link}>Все офферы</Button>
                  </div>
                </div>
              </div>
            </div>
            {auth && <CardMainList userID={userID} />}
            {!auth && <NumberList isLogin={auth} />}
          </Col>
        </Row>
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
export default connect(mapStateToProps)(Dashboard);
