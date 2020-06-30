import React from "react";
import { Form, Button, FormGroup } from "reactstrap";
import { connect } from 'react-redux';

import { Example, ExamplePhone } from "./FormGroup";
import Cookies from "js-cookie";
import SpinnerEx from "../Spinner";
import AppDataManager from "../AppDataManager";
import { logIn } from '../../store/auth/actions';
import { notikLogIn } from '../../store/notifications/actions';
import OffertaFormGroup from './OffertaFormGroup';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {
        email: [],
        password: []
      },

      validations: {
        email: {
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

    const { email, password } = this.state;
    this.logout();
    let json;
    try {
      json = await AppDataManager.api("/login_email", {
        method: "POST",
        parameters: { user: { email, password } }
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

    this.setState({ errors: [] });
		this.props.logIn(json.user);
		this.props.notikLogIn("Вы успешно вошли");
    this.props.toggle();
    this.props.isAuthed();
    this.props.history.push('/main/dashboard');
  };

  login(phone) {
    Cookies.set("userID", phone, { expires: 20 });
  }

  auth(phone) {
    Cookies.set("xxx_login", phone, { expires: 20 });
  }

  auth_logout(phone) {
    Cookies.remove("xxx_login");
  }

  logout(phone) {
    Cookies.remove("userID");
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.errors;
    let emailValid = this.state.validations.email.valid;
    let passwordValid = this.state.validations.password.valid;
    let validationFields = this.state.validations;

    validationFields[fieldName].dirty = true;
    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid
          ? ""
          : "Неправильный формат email";
        validationFields[fieldName].valid = emailValid;
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
        this.state.validations.email.valid &&
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
          type={"email"}
          name={"email"}
          defaultValue={this.state.email}
          placeholder={"Email"}
          onChange={this.handleInputChange}
          errors={this.state.errors.email}
          isValid={this.state.validations.email.valid}
          isDirty={this.state.validations.email.dirty}
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
                onClick={() => this.props.changeState("reg_phone")}
                className="col-12 text-center"
              >
                <p className="p-another-login">Регистрация</p>
              </div>
            </div>
          </div>
        </FormGroup>

        <FormGroup className="block-login-red">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div
                onClick={() => this.props.changeState("forgot_email")}
                className="col-12 text-center"
              >
                <p className="p-another-login">Забыли пароль</p>
              </div>
            </div>
          </div>
        </FormGroup>

        <FormGroup className="block-login-red">
          <div className="container h-100">
            {" "}
            <div className="row h-100 justify-content-center align-items-center">
              <div
                onClick={() => this.props.changeState("login_phone")}
                className="col-12 text-center"
              >
                <p className="p-another-login">Войти по телефону</p>
              </div>
            </div>
          </div>
        </FormGroup>

        <OffertaFormGroup {...this.props}/>
      </Form>
    );
  }
}


const mapDispatchToProps = {
  logIn,
	notikLogIn
};

export default connect(null, mapDispatchToProps)(LoginForm);
