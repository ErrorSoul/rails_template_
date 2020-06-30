import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, CardTitle, Form, Button, FormGroup } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { ExampleProfile } from './FormGroup';
import SpinnerEx from '../Spinner';
import AppDataManager from '../AppDataManager';
import { notikNotik } from 'store/notifications/actions';


class UserFioForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: props.first_name || '',
      last_name: props.last_name || '',
      middle_name: props.middle_name || '',
      userID: props.userID || '',
      errors: {
        first_name: [],
        last_name: [],
        middle_name: []
      },

      validations: {
        first_name: {
          dirty: false,
          valid: false,
        },

        last_name: {
          dirty: false,
          valid: false,
        },

        middle_name: {
          dirty: false,
          valid: false,
        }
      },

      formValid: false,
      isLoad: false,
    };
  }

  handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.props.updateName(name, value);
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.setState({ isLoad: true });

    const { userID, first_name, last_name, middle_name } = this.state;
    let json;
    try {
      json = await AppDataManager.api(`/main/profile/${userID}`, {
        method: 'PUT',
        parameters: { user: {first_name, last_name, middle_name} }
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
        first_name: {
          dirty: false,
          valid: false,
        },

        last_name: {
          dirty: false,
          valid: false,
        },

        middle_name: {
          dirty: false,
          valid: false,
        }
      }
    this.props.notikNotik("ФИО успешно обновлено");
    this.setState({ errors: [], isLoad: false, validations: validations });
  }



  validateField(fieldName, value) {
    const fieldValidationErrors = this.state.errors;
    let firstNameValid = this.state.validations.first_name.valid;
    let lastNameValid = this.state.validations.last_name.valid;
    let middleNameValid = this.state.validations.middle_name.valid;
    const validationFields = this.state.validations;

    validationFields[fieldName].dirty = true;
    switch (fieldName) {
      case 'first_name':
        firstNameValid = value.length && value.length > 1 && value.length <= 144;
        console.log("first name" , firstNameValid)
        fieldValidationErrors.first_name = firstNameValid
          ? ''
          : 'Неправильная длина имени';
        validationFields[fieldName].valid = firstNameValid;
        break;
      case 'last_name':
        lastNameValid = value.length && value.length > 1 && value.length <= 144;
        console.log("last name" , lastNameValid)
        fieldValidationErrors.last_name = lastNameValid
          ? ''
          : 'Неправильная длина фамилии';
        validationFields[fieldName].valid =  lastNameValid;
        break;
       case 'middle_name':
        middleNameValid = value.length ? (value.length > 1 && value.length <= 144) : true;
        fieldValidationErrors.middle_name = middleNameValid
          ? ''
          : 'Неправильная длина отчества';
        validationFields[fieldName].valid =  middleNameValid;

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

    if (this.state.validations.first_name.dirty && !this.state.validations.last_name.dirty) {
      formValid = this.state.validations.first_name.valid;
    } else if (!this.state.validations.first_name.dirty && this.state.validations.last_name.dirty) {
      formValid = this.state.validations.last_name.valid;
    } else if (!this.state.validations.first_name.dirty && !this.state.validations.last_name.dirty && this.state.validations.middle_name.dirty) {
      formValid = this.state.validations.middle_name.valid;
    } else { formValid = this.state.validations.first_name.valid && this.state.validations.last_name.valid; }

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
          <CardTitle tag="h5">ФИО</CardTitle>
        </CardHeader>
        <CardBody>
           <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col className="p-2" md="4">
                  <label>Имя</label>
                  <ExampleProfile
                     name="first_name"
                     defaultValue={this.state.first_name}
                     placeholder="Имя"
                     onChange={this.handleInputChange}
                     errors={this.state.errors.first_name}
                     isValid={this.state.validations.first_name.valid}
                     isDirty={this.state.validations.first_name.dirty}
                     minlength="1"
                     maxlength="144"
                     formGroupClassNameName="margin-bottom-m"
                     />

                </Col>

                 <Col className="p-2" md="4">
                  <label>Фамилия</label>
                  <ExampleProfile
                     name="last_name"
                     defaultValue={this.state.last_name}
                     placeholder="Фамилия"
                     onChange={this.handleInputChange}
                     errors={this.state.errors.last_name}
                     isValid={this.state.validations.last_name.valid}
                     isDirty={this.state.validations.last_name.dirty}
                     minlength="1"
                     maxlength="144"
                     formGroupClassNameName="margin-bottom-m"
                     />

                </Col>

                 <Col className="p-2" md="4">
                  <label>Отчество</label>
                  <ExampleProfile
                     name="middle_name"
                     defaultValue={this.state.middle_name}
                     placeholder="Отчество (если есть)"
                     onChange={this.handleInputChange}
                     errors={this.state.errors.middle_name}
                     isValid={this.state.validations.middle_name.valid}
                     isDirty={this.state.validations.middle_name.dirty}
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

export default connect(null, mapDispatchToProps)(UserFioForm);
