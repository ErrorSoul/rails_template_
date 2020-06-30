import React from "react";
import { Form, Button, FormGroup } from "reactstrap";
import Cookies from "js-cookie";
import { Example, ExamplePhone, ExampleText } from "./FormGroup";
import SpinnerEx from "../Spinner";
import AppDataManager from "../AppDataManager";

class AdminSmsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",

      errors: {
        phone: [],
        sms_text: []
      },

      validations: {
        phone: {
          dirty: false,
          valid: false
        },
        sms_text: {
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

    const { phone, sms_text } = this.state;

    let json;
    try {
      json = await AppDataManager.api("/admin/sms", {
        method: "POST",
        parameters: { sms: { phone, sms_text } }
      });
      console.log('json', json);
      this.props.updateMessage(json);
    } catch (e) {

      const { errors } = e.json;

      this.setState({
        errors: [],
        balanceError: true,
        formValid: false,
        isLoad: false
      });
      console.warn(e);
      return;
    }

    let validat = {
      phone: {
        dirty: false,
        valid: false
      },
      sms_text: {
        dirty: false,
        valid: false
      }
    }

    let err = {
      phone: [],
      sms_text: []
    }
    this.setState({ isLoad: false, validations: validat, phone: '', sms_text: '',  errors: err });
  };



  validateField(fieldName, value) {
    const fieldValidationErrors = this.state.errors;
    let phoneValid = this.state.validations.phone.valid;
    let smsTextValid = this.state.validations.sms_text.valid;
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
    case 'sms_text':
      smsTextValid = value && value.length <= 60;
      fieldValidationErrors.sms_text = smsTextValid ? '' : 'Слишком длинное смс';
      validationFields[fieldName].valid = smsTextValid;
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
      formValid: this.state.validations.phone.valid && this.state.validations.sms_text.valid
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

        <ExampleText
          name="sms_text"
          defaultValue={this.state.sms_text}
          placeholder="Текст"
          onChange={this.handleInputChange}
          errors={this.state.errors.sms_text}
          isValid={this.state.validations.sms_text.valid}
          isDirty={this.state.validations.sms_text.dirty}
        />
        <FormGroup>
          <Button
            disabled={!this.state.formValid}
            color="danger"
            className="col-12 registration-button-submit"
          >
            Отправить смс
          </Button>
        </FormGroup>

      </Form>
    );
  }
}

export default AdminSmsForm;
