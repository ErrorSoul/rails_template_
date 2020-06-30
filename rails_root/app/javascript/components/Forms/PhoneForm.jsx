import React from "react";
import { Form, Button, FormGroup } from "reactstrap";
import Cookies from "js-cookie";
import { Example, ExamplePhone } from "./FormGroup";
import SpinnerEx from "../Spinner";
import AppDataManager from "../AppDataManager";
import OffertaFormGroup from './OffertaFormGroup';

class PhoneForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",

      errors: {
        phone: []
      },

      validations: {
        phone: {
          dirty: false,
          valid: false
        }
      },

      formValid: false,
      isLoad: false
    };
  }

  handleInputChange = event => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  handleSubmit = async e => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    this.setState({ isLoad: true });

    const { phone } = this.state;
    this.logout(phone);
    let json;
    try {
      json = await AppDataManager.api("/login_phone", {
        method: "POST",
        parameters: { user: { phone } }
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
        isLoad: false
      });
      console.warn(e);
      return;
    }

    this.login(phone);
    this.setState({ errors: [] });
    this.props.changeState("second");
  };

  login(phone) {
    Cookies.set("user_phone", btoa(phone), { expires: 20 });
  }

  logout(phone) {
    Cookies.remove("user_phone");
  }

  validateField(fieldName, value) {
    const fieldValidationErrors = this.state.errors;
    let phoneValid = this.state.validations.phone.valid;
    const validationFields = this.state.validations;

    validationFields[fieldName].dirty = true;
    switch (fieldName) {
      case "phone":
        console.log("phone", value);
        console.log("phone LENGTH", value.length);
        console.log("phone LENGTH SPLIT", value.split(" ").join(""));
        console.log("phone LENGTH SPLIT", value.split(" ").join("").length);

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
        validations: validationFields
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.validations.phone.valid
    });
  }

  render() {
    const { isLoad } = this.state;
    if (isLoad) {
      return <SpinnerEx />;
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <ExamplePhone
          name="phone"
          defaultValue={this.state.phone}
          placeholder="Телефон"
          onChange={this.handleInputChange}
          errors={this.state.errors.phone}
          isValid={this.state.validations.phone.valid}
          isDirty={this.state.validations.phone.dirty}
        />
        <FormGroup>
          <Button
            disabled={!this.state.formValid}
            color="danger"
            className="col-12 registration-button-submit"
          >
            Получить код
          </Button>
        </FormGroup>

        <FormGroup className="margin-top-login">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div
                onClick={() => this.props.changeState("login_email")}
                className="col-12 text-center"
              >
                <p className="p-another-login">Войти по почте</p>
              </div>
            </div>
          </div>
        </FormGroup>

        <FormGroup className="block-login-red">
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
				<OffertaFormGroup {...this.props}/>
      </Form>
    );
  }
}

export default PhoneForm;
