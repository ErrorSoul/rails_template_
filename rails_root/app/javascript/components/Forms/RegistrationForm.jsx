import React from 'react';
import { Form } from 'reactstrap';

class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      errors: {
        email: [],
	 phone: [],
	 password: [],
      },

      validations: {
        email: {
          dirty: false,
          valid: false,
        },

	 phone: {
          dirty: false,
          valid: false,
        },

        password: {
          dirty: false,
          valid: false,
        },
      },

      formValid: false,
    };
  }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({ [name]: value },
      () => { this.validateField(name, value); });
  }


  validateField(fieldName, value) {
    const fieldValidationErrors = this.state.errors;
    let emailValid = this.state.validations.email.valid;
    let passwordValid = this.state.validations.password.valid;
    let phoneValid = this.state.validations.phone.valid;
    const validationFields = this.state.validations;

    switch (fieldName) {
      case 'email':
	  emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
	  fieldValidationErrors.email = emailValid ? '' : 'Неправильный формат email';
	  validationFields.email.valid = emailValid;
	  break;
      case 'phone':
	  phoneValid = value.length >= 6;
	  fieldValidationErrors.phone = phoneValid ? '' : ' is too short';
	  validationFields.phone.valid = phoneValid;
	  break;
      case 'password':
	  passwordValid = value.length >= 6;
	  fieldValidationErrors.password = passwordValid ? '' : ' is too short';
	  validationFields.password.valid = passwordValid;
	  break;
      default:
	  break;
    }
    this.setState(
      {
        errors: fieldValidationErrors,
        validations: validationFields,
      }, this.validateForm,
    );
  }

  validateForm() {
    this.setState({
	    formValid: this.state.validations.email.valid
		&& this.state.validations.phone.valid
                && this.state.validations.password.valid,
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange}
          />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange}
          />
        </label>
      </form>
    );
  }
}
