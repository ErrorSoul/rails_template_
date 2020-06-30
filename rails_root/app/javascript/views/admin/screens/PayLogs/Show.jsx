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
} from "reactstrap";

import Item from "components/utils/Item";

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
        `/admin/pay_logs/${Id}`
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




    const resourceParams = () => {
      const { item } = this.state;

      return Object.keys(item).map((key, index) => {
        if (key != "params") {
          return (
            <tr key={index}>
              <th scope="row">{key}</th>
              <Item ikey={key} item={item}/>
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
                        <b>params</b>
                        <pre>
                          {JSON.stringify(this.state.item.params, null, 2)}
                        </pre>
                      </ListGroupItem>
                    </ListGroup>
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

export default withRouter(Show);
