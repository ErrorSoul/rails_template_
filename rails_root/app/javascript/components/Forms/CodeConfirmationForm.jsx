import React from 'react';
import { Form, Button, FormGroup } from 'reactstrap';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import { Example, ExamplePhone, ExampleCheck } from './FormGroup';
import SpinnerEx from '../Spinner';
import CountDownTimer from '../CountDownTimer';
import AppDataManager from '../AppDataManager';
import { logIn } from '../../store/auth/actions';
import { notikLogIn } from '../../store/notifications/actions';

class CodeConfirmationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      condition: false,

      errors: {
        code: [],
        condition: [],
      },

      validations: {
        code: {
          dirty: false,
          valid: false,
        },

        condition: {
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

    const { code } = this.state;
    let json;
    try {
      json = await AppDataManager.api('/code_co', {
        method: 'POST',
        parameters: { code },
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

    this.setState({ errors: [] });
  }

  getNewCode = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.setState({ isLoad: true });

    let json;
    try {
      json = await AppDataManager.api('/get_new_code', {
        method: 'POST',
        parameters: {},
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
    console.log('code new confirmation json', json);

    this.setState({ errors: [] });
    this.props.changeState('second');
  }

  checkingCode = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.setState({ isLoad: true });

    const { code } = this.state;
    let json;
    try {
      json = await AppDataManager.api('/checking_code', {
        method: 'POST',
        parameters: { code },
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
    console.log('code checking confirmation json', json);
    this.setState({ errors: [] });
    this.props.logIn(json.user);
		this.props.notikLogIn("Вы успешно вошли");
    this.props.toggle();
    this.props.isAuthed();
		this.props.changeState("login_phone");
  }


  phone_number() {
    return atob(Cookies.get('user_phone'));
  }


  validateField(fieldName, value) {
    const fieldValidationErrors = this.state.errors;
    let codeValid = this.state.validations.code.valid;
    let conditionValid = this.state.validations.condition.valid;
    const validationFields = this.state.validations;

    validationFields[fieldName].dirty = true;
    switch (fieldName) {
      case 'condition':
        console.log('valud', value);
        conditionValid = value;
        fieldValidationErrors.email = conditionValid
          ? ''
          : 'Подтвердите согласие на обработку данных';
        validationFields[fieldName].valid = conditionValid;
        break;
      case 'code':
        codeValid = value.length == 4;
        fieldValidationErrors.phone = codeValid
          ? ''
          : 'Неправильный код подтверждения';
        validationFields[fieldName].valid = codeValid;
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
    this.setState({
      formValid:
        this.state.validations.code.valid
        && this.state.validations.condition.valid,
    });
  }

  render() {
    const { isLoad } = this.state;
    const phone = this.phone_number();
    console.log('Cookies user phone', Cookies.get('user_phone'));
    if (isLoad) {
      return <SpinnerEx />;
    }
    return (
      <Form onSubmit={this.checkingCode}>
        <p className="code-sending-p">
          {' '}
          Код отправлен на
          <b>&nbsp;{phone}</b>
          {' '}
        </p>
        <Example
          name="code"
          defaultValue={this.state.code}
          placeholder="code"
          onChange={this.handleInputChange}
          errors={this.state.errors.code}
          isValid={this.state.validations.code.valid}
          isDirty={this.state.validations.code.dirty}
          minlength="4"
          maxlength="4"
          className="code-input-verification"
          formGroupClassName="margin-bottom-m"
        />

        <CountDownTimer getNewCode={this.getNewCode} />
        <ExampleCheck
          name="condition"
          defaultValue={this.state.condition}
          onChange={this.handleInputChange}
          errors={this.state.errors.condition}
          isValid={this.state.validations.condition.valid}
          isDirty={this.state.validations.condition.dirty}
          type="checkbox"
        />
        <FormGroup>
          <Button
            disabled={!this.state.formValid}
            color="danger"
            className="col-12 registration-button-submit margin-bottom-m"
          >
            Войти
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

const mapDispatchToProps = {
  logIn,
	notikLogIn

};

export default connect(null, mapDispatchToProps)(CodeConfirmationForm);
