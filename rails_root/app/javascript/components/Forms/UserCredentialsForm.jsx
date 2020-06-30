import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, CardTitle, Form, Button, FormGroup } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { ExampleProfilePhone, ExampleProfile } from './FormGroup';
import SpinnerEx from '../Spinner';
import AppDataManager from '../AppDataManager';
import { notikNotik } from 'store/notifications/actions';


class UserCredentialsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: props.phone || '',
      email: props.email || '',

      errors: {
        phone: [],
        email: [],
      },

      validations: {
        phone: {
          dirty: false,
          valid: false,
        },

        email: {
          dirty: false,
          valid: false,
        },
      },

      formValid: false,
      isLoad: false,
    };
  }

  handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.setState({ isLoad: true });

    const {phone, email} = this.state;
    let json;
    try {
      json = await AppDataManager.api(`/main/profile/update_credentials`, {
        method: 'POST',
        parameters: { user: {phone, email} }
      });
    } catch (e) {
      const { validations } = this.state;
      const { errors } = e.json;

      for (const [key, value] of Object.entries(errors)) {
        validations[key].valid = false;
      }
      this.setState({
        errors,
        validations,
        formValid: false,
        isLoad: false,
      });
      console.warn(e);
      return;
    }
    const { doctor } = json;

    const validations =  {
        phone: {
          dirty: false,
          valid: false,
        },

        email: {
          dirty: false,
          valid: false,
        }
      }
    this.props.notikNotik("Email/Телефон успешно обновлены");
    this.setState({ errors: [], isLoad: false, validations: validations });
  }



  validateField(fieldName, value) {
    const fieldValidationErrors = this.state.errors;
    let emailValid = this.state.validations.email.valid;
    let phoneValid = this.state.validations.phone.valid;
    const validationFields = this.state.validations;

    validationFields[fieldName].dirty = true;
    switch (fieldName) {
      case 'email':
      emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      fieldValidationErrors.email = emailValid ? '' : 'Неправильный формат email';
      validationFields[fieldName].valid = emailValid;
      break;

      case "phone":
        phoneValid =
          value.split(" ").join("").length == 12 &&
          !!value.match(/^[+]7*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/);
        console.log("phoneValid", phoneValid);
        fieldValidationErrors.phone = phoneValid
          ? ""
          : "Неправильный формат телефона";
        validationFields[fieldName].valid = phoneValid;
        break;
      default:
        break;
    }

    this.setState(
      {
        errors: fieldValidationErrors,
        validations: validationFields,
      },
      this.validateForm,
    );
  }

  validateForm() {
    let formValid;

    if (this.state.validations.phone.dirty && !this.state.validations.email.dirty) {
      formValid = this.state.validations.phone.valid;
    } else if (!this.state.validations.phone.dirty && this.state.validations.email.dirty) {
      formValid = this.state.validations.email.valid;
    } else { formValid = this.state.validations.phone.valid && this.state.validations.email.valid; }

    this.setState({
      formValid: formValid
    });
  }

  render() {
    const { isLoad } = this.state;

    if (isLoad) {
      return <SpinnerEx />;
    }
    return (

      <Card className="card-user profile-card">
        <CardHeader>
          <CardTitle tag="h5">Редактирование</CardTitle>
        </CardHeader>
        <CardBody>
           <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col className="p-2" md="6">
                  <label>Телефон</label>
                  <ExampleProfilePhone
                     name="phone"
                     defaultValue={this.state.phone}
                     placeholder="Телефон"
                     onChange={this.handleInputChange}
                     errors={this.state.errors.phone}
                     isValid={this.state.validations.phone.valid}
                     isDirty={this.state.validations.phone.dirty}
                     minlength="1"
                     maxlength="144"
                     formGroupClassNameName="margin-bottom-m"
                     />

                </Col>

                 <Col className="p-2" md="6">
                  <label>Email</label>
                  <ExampleProfile
                     type="email"
                     name="email"
                     defaultValue={this.state.email}
                     placeholder="Email"
                     onChange={this.handleInputChange}
                     errors={this.state.errors.email}
                     isValid={this.state.validations.email.valid}
                     isDirty={this.state.validations.email.dirty}
                     minlength="1"
                     maxlength="144"
                     formGroupClassNameName="margin-bottom-m"
                     />

                </Col>

              </Row>

              <Row>
                <div className="update ml-auto mr-auto">
                  <Button
                     className="btn-round"
                     color="primary"
                     type="submit"
                     disabled={!this.state.formValid}
                     >
                    Обновить
                  </Button>
                </div>
              </Row>


           </Form>

        </CardBody>
      </Card>

    );
  }
}

const mapDispatchToProps = {
	notikNotik
};

export default connect(null, mapDispatchToProps)(UserCredentialsForm);
