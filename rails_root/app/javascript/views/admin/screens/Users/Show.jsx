import React from "react";
import AppDataManager from "components/AppDataManager";
import { withRouter } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Spinner,
  ListGroup,
  ListGroupItem,
  Button
} from "reactstrap";

import Item from "components/utils/Item";
import MyTable from 'components/customTables/Table';

class Show extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      item: {},
    };
  }

  fetchResource = async () => {
    this._isMounted && this.setState({ isLoading: true });

    try {
      const Id = this.props.match.params.id;
      const { item, resource_name } = await AppDataManager.api(
        `/admin/users/${Id}`
      );

      this._isMounted && this.setState({ item, resource_name });
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


  pretendUser = async () => {
    try {
      const Id = this.props.match.params.id;
      const {result} = await AppDataManager.api(
        `/admin/users/${Id}/pretend`
      );

      window.open("/", "_blank");

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

    const apiUrl = `/admin/pay_reports/search?user_id=${this.props.match.params.id}`;

    const resourceParams = () => {
      const { item } = this.state;

      return Object.keys(item).map((key, index) => {
        if (key != "params" && key != "payment_info") {
          return (
            <tr key={index}>
              <th scope="row">{key}</th>
              <Item ikey={key} item={item}/>
            </tr>
          );
        }
      });
    };

    const resourcePayments= () => {
      const { item } = this.state;
      const { payment_info } = item;
      console.log('payment_info', payment_info);
      return Object.keys(payment_info).map((key, index) => {
        if (key == "qiwi" || key == 'yandex' || key == 'webmoney') {
          return (
            <tr key={index}>
              <th scope="row">{key}</th>
              <Item ikey={key} item={payment_info}/>
            </tr>
          );
        }
      });
    };

    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  {this.state.resource_name}
                  <span>&nbsp;#{this.state.item.id}</span>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <Table bordered hover>
                      <tbody>{resourceParams()}</tbody>
                    </Table>
                  </Col>
                  <Col md="6">
                    <ListGroup>
                      <ListGroupItem>
                        {" "}
                        <Button onClick={() => this.pretendUser()} type="button" color="info">
                          Pretend
                        </Button>
                      </ListGroupItem>
                    </ListGroup>


                      <Table bordered hover>
                        <tbody>{resourcePayments()}</tbody>
                      </Table>


                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md='12'>
            <MyTable apiUrl={apiUrl}/>

          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(Show);
