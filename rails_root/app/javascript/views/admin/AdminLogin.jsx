import React from "react";
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import LoginForm from "components/Forms/AdminLoginForm";

import { withRouter } from 'react-router-dom';

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);

  }

	componentDidMount() {
    if (this.props.isAuth) {
			return this.props.history.push('/admin/dashboard');
		}
  }

  render() {
    return (
			 <div className="content">
          <Row className='justify-content-center'>
            <Col md="8" lg="8" sm="10">
              <Card>
                <CardHeader>
                  <h5 className="title"></h5>
                  <p className="category">
                  </p>
                </CardHeader>
                <CardBody>
                 <div className='row mt-5 justify-content-md-center'>
									 <div className='col-lg-5 col-sm-10 col-md-8'>
										 <h2 className='mb-2'>Вход</h2>
										 <LoginForm/>
									 </div>
								 </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

    );
  }
}

const mapStateToProps = (state) => {
		return {
			isAuth: state.auth.isAuth
		};
};
export default withRouter(connect(mapStateToProps)(AdminLogin));
