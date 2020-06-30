import React from "react";
import AppDataManager from "components/AppDataManager";
import { withRouter } from "react-router-dom";
import UserFioForm from "components/Forms/UserFioForm";
import UserCredentialsForm from "components/Forms/UserCredentialsForm";
import PaymentProfile from 'views/PaymentProfile';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Spinner
} from "reactstrap";

class User extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      phone: '',
      email: '',
      userID: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      yandex: '',
      qiwi: '',
      webmoney: '',
    };
  }


  updateName = (name, value) => {
    console.log(name, value);
    this.setState({[name]: value});
  }

  fetchResource = async () => {
    this._isMounted && this.setState({ isLoading: true });

    try {
      const Id = this.props.match.params.id;
      const { phone, email, userID, first_name, last_name, middle_name, qiwi, yandex, webmoney } = await AppDataManager.api(
        `/main/profile`
      );

      this._isMounted && this.setState({ phone, email, userID, first_name, last_name, middle_name, qiwi, yandex, webmoney });
    } catch (e) {
      console.warn(e);
      return;
    } finally {
      this._isMounted && this.setState({ isLoading: false });
    }
    if (!this._isMounted) {
      return;
    }
  };

  componentDidMount() {
    this._isMounted = true;
    console.log("start");
    this.fetchResource();
  }

  componentWillUnmount() {
    this._isMounted = false;
    console.log("finish");
  }

  render() {
    const isLoad = this.state.isLoading;
    if (isLoad) {
      return (
        <Spinner
          style={{ width: "3.3rem", height: "3.3rem" }}
          color="secondary"
        />
      );
    }

    const { email, userID, phone, first_name, middle_name, last_name, qiwi, yandex, webmoney } = this.state;

    const profileName = () => {
      let first_name_str = (first_name == null || first_name == '')  ? '' : first_name;
      let last_name_str = (last_name == null || last_name == '') ? '' : last_name;
      return (first_name == null || first_name == '') && (last_name == null || last_name == '') ? 'Ваш Профиль' : `${first_name_str} ${last_name_str}`;
    }

    return (
        <div className="content">
          <Row>
            <Col md="4">
              <Card className="card-user">
                <div className="image">
                  <img
                    alt="..."
                    src={require("assets/img/damir-bosnjak.jpg")}
                  />
                </div>
                <CardBody>
                  <div className="author">
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar border-gray"
                        src={require("assets/img/default-avatar.png")}
                      />
                      <h5 className="title">{profileName()}</h5>
                    </a>
                    <p className="description">ID: {userID}</p>
                  </div>
                  <p className="description text-center"></p>

                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="button-container">

                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col md="8">

              <UserCredentialsForm phone={phone} email={email}/>
              <UserFioForm first_name={first_name}
                           last_name={last_name}
                           userID={userID}
                           updateName={this.updateName}
                           middle_name={middle_name}/>

              <PaymentProfile qiwi={qiwi} yandex={yandex} webmoney={webmoney} {...this.props}/>

            </Col>


          </Row>
        </div>
    );
  }
}

export default withRouter(User);
