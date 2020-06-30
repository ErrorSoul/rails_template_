import React, { Component}  from "react";
import PropTypes from 'prop-types';
import { Form, Button, FormGroup } from "reactstrap";
import { connect } from 'react-redux';
import { createBrowserHistory } from "history";
import { Example, ExamplePhone } from "./FormGroup";
import Cookies from "js-cookie";
import SpinnerEx from "../Spinner";
import AppDataManager from "../AppDataManager";
import { logIn } from '../../store/auth/actions';
import { notikLogIn } from '../../store/notifications/actions';
import { useHistory } from "react-router-dom";
import { withRouter } from 'react-router-dom';
//import history from '../history.js';

class AdminLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      errors: {
        login: [],
        password: []
      },

      validations: {
        login: {
          dirty: false,
          valid: false
        },

        password: {
          dirty: false,
          valid: false
        }
      },

      formValid: false,
      isLoad: false
    };
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  handleSubmit = async e => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    this.setState({ isLoad: true });

    const { login, password } = this.state;

    let json;
    try {
      json = await AppDataManager.api("/login_norm", {
        method: "POST",
        parameters: { suser: { login, password } }
      });
    } catch (e) {
      let validations = this.state.validations;
      const { errors } = e.json;

      for (let [key, value] of Object.entries(errors)) {
        validations[key].valid = false;
      }
      this.setState({
        errors: errors,
        validations: validations,
        formValid: false,
				isLoad: false
      });
      console.warn(e);
      return;
    }

	//	const history = createBrowserHistory();



		this.setState({ errors: [] });
		this.props.logIn(json.user);
		this.setState({ isLoad: false});
		console.log('before SETTIMEOUT');
		this.props.history.push('/admin/dashboard');
		this.props.notikLogIn("Вы успешно вошли");
  };



  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.errors;
    let loginValid = this.state.validations.login.valid;
    let passwordValid = this.state.validations.password.valid;
    let validationFields = this.state.validations;

    validationFields[fieldName].dirty = true;
    switch (fieldName) {
      case "login":
        loginValid = value.length > 0;
        fieldValidationErrors.login = loginValid
          ? ""
          : "Неправильный формат login";
        validationFields[fieldName].valid = loginValid;
        break;

      case "password":
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid
          ? ""
          : "Пароль слишком короткий";
        validationFields[fieldName].valid = passwordValid;
        break;

      default:
        break;
    }
    this.setState(
      {
        errors: fieldValidationErrors,
        validations: validationFields
      },
      this.validateForm
    );
  }
  validateForm() {
    this.setState({
      formValid:
        this.state.validations.login.valid &&
        this.state.validations.password.valid
    });
  }

  render() {
    const isLoad = this.state.isLoad;
    if (isLoad) {
      return <SpinnerEx />;
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Example
          type={"text"}
          name={"login"}
          defaultValue={this.state.login}
          placeholder={"Login"}
          onChange={this.handleInputChange}
          errors={this.state.errors.login}
          isValid={this.state.validations.login.valid}
          isDirty={this.state.validations.login.dirty}
        />

        <Example
          type={"password"}
          name={"password"}
          placeholder={"Пароль"}
          defaultValue={this.state.password}
          onChange={this.handleInputChange}
          errors={this.state.errors.password}
          isValid={this.state.validations.password.valid}
          isDirty={this.state.validations.password.dirty}
        />
        <FormGroup>
          <Button
            disabled={!this.state.formValid}
            color="danger"
            className="col-12 registration-button-submit"
          >
            Войти
          </Button>
        </FormGroup>

        <FormGroup className="margin-top-login">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div
                className="col-12 text-center"
              >
                <p className="p-another-login"></p>
              </div>
            </div>
          </div>
        </FormGroup>

        <FormGroup className="margin-top-login">

        </FormGroup>

        <FormGroup>
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="col-12 text-center">

              </div>
            </div>
          </div>
        </FormGroup>
      </Form>
    );
  }
}


const mapDispatchToProps = {
  logIn,
	notikLogIn
};


// AdminLoginForm.propTypes = {
//   history: PropTypes.object.isRequired
// }

export default withRouter(connect(null, mapDispatchToProps)(AdminLoginForm));
