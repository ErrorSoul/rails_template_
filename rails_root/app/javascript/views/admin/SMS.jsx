import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Spinner from 'components/Spinner';
import AdminSmsForm from 'components/Forms/AdminSmsForm';
import AppDataManager from 'components/AppDataManager';
import { notikLogIn } from  'store/notifications/actions';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";

class SMS extends React.Component {


	_isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
			isLoading: true,
      balance: 0,
      balanceError: false

    };

  }



	fetchBalance = async ()  => {
    this._isMounted && this.setState({isLoading: true})
    try {
      const { result }  = await AppDataManager.api(`/admin/sms`);
      console.log('res', result);
      this._isMounted && this.setState({balance: parseFloat(result.data).toFixed(2), isLoading: true});
    } catch (e) {
      console.warn(e)
      this._isMounted && this.setState({balanceError: true, isLoading: false});
      return
    } finally {
      this._isMounted && this.setState({isLoading: false});
    }
    if (!this._isMounted) {return}
  }

	componentDidMount() {
		this._isMounted = true;
    this.fetchBalance();
  }



	componentWillUnmount() {
		this._isMounted = false;
  }

  updateMessage = (json) => {
    this.props.notikLogIn("SMS отправлено");
    if (json.balance_result != 'error') {
      this.setState({balance: json.balance_result.data})
    } else {
      this.setState({balanceError: true});
    }

  }

  render() {
    const isLoad = this.state.isLoading;
				if (isLoad) {
					return  (<div className="content"><Row><Col md="12"><Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="secondary" /></Col></Row></div>);
				}

    const {balance} = this.state;

    const BalanceAnwser = (props) => {
      return ( this.state.balanceError ?
       <CardTitle tag="p">Ошибка запроса</CardTitle> :  <CardTitle tag="p">{balance}Р</CardTitle>);
    }

    return (


			<div className="content">
        <Row className="row h-100 justify-content-center align-items-center">
          <Col md='7'>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Остаток</p>
                      <BalanceAnwser/>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats cursor-pointer-card-lave" onClick={this.fetchBalance}>
                  <i className="fas fa-sync-alt" /> Update Now
                </div>
              </CardFooter>
            </Card>
          </Col>

          <Col md='7'>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col>
                    <AdminSmsForm updateMessage={this.updateMessage}/>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>


    );
  }
}

const mapDispatchToProps = {
	notikLogIn
};

export default withRouter(connect(null, mapDispatchToProps)(SMS));
