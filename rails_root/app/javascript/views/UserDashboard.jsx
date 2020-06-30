import React from "react";
import AppDataManager from "components/AppDataManager";
import { Link } from "react-router-dom";
import { Row, Col, Spinner, Button } from "reactstrap";

import TableLave from "./TableLave.jsx";
import CurrencyTable from "./CurrencyTable.jsx";

class UserDashboard extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      win_money: 0,
      progress_money: 0,
      paid_money: 0,
      payReportList: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchMoneys();
  }

  componentWillUnmount() {
		this._isMounted = false;
  }

  fetchMoneys = async ()  => {
    this._isMounted && this.setState({isLoading: true})

    try {
     const { win_money, progress_money, paid_money, payReportList }  = await AppDataManager.api(`/main/user_statistics`)
			this._isMounted && this.setState({win_money, progress_money, paid_money, payReportList});

    } catch (e) {
      console.warn(e)
      return
    } finally {

      this._isMounted && this.setState({isLoading: false})
    }
    if (!this._isMounted) {return}
  }

  render() {
    const isLoad = this.state.isLoading;
    if (isLoad) {
      return (
        <div className="content">
          <Row>
            <Col md="12">
              <Spinner
                style={{ width: "3.3rem", height: "3.3rem" }}
                color="secondary"
              />
            </Col>
          </Row>
        </div>
      );
    }

    const { win_money, progress_money, paid_money, payReportList } = this.state;
    return (

       <Col md='12' className="no-gutters">
         <CurrencyTable win_money={win_money} progress_money={progress_money} paid_money={paid_money}/>

          <div className="col-12 mt-4">
            <div className="row no-gutters align-items-center justify-content-between">
              <div className="col-6">
                <h5 className="popular-offers">Последние сделки</h5>
              </div>
              <div className="col-6 pull-right">
                <div className="text-right">
                  { this.props.showLink &&
                  <Button className="popular-offers-button" size='sm' outline color="primary" tag={Link} to={"/main/orders"}>Все сделки</Button> }

                </div>
              </div>
            </div>
          </div>

          <div className="col-12 mt-4">
            <TableLave reportList={payReportList}/>
          </div>
        </Col>
    );
  }
}

export default UserDashboard;
