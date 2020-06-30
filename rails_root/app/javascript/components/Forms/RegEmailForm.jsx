import React from 'react';
import { Form, Button, FormGroup } from 'reactstrap';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import { Example } from './FormGroup';
import SpinnerEx from '../Spinner';
import AppDataManager from '../AppDataManager';
import { logIn } from '../../store/auth/actions';
import { notikLogIn } from '../../store/notifications/actions';
import OffertaFormGroup from './OffertaFormGroup';

class RegEmailForm extends React.Component {
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
	 password_confirmation: [],
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
        password_confirmation: {
          dirty: false,
          valid: false,
        },
      },

      formValid: false,
      isLoad: false,
    };
  }

  handleInputChange = (event) => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({ [name]: value },
      () => { this.validateField(name, value); });
  }


   handleSubmit = async (e) => {
     if (e && typeof e.preventDefault === 'function') {
       e.preventDefault();
     }
     this.setState({ isLoad: true });

     const { email, phone, password } = this.state;

     let json;
     try {
       json = await AppDataManager.api('/registration_email', { method: 'POST', parameters: { user: { email, password } } });
     } catch (e) {
       const { validations } = this.state;
       const { errors } = e.json;

       for (const [key, value] of Object.entries(errors)) {
         validations[key].valid = false;
       }
       this.setState({
         errors, validations, formValid: false, isLoad: false,
       });
       console.warn(e);
       return;
     }

     const { doctor } = json;
	  console.log('json', json);

     this.setState({ errors: [] });
     this.props.logIn(json.user);
		 this.props.notikLogIn("Вы успешно зарегистрировались");
     this.props.toggle();
     this.props.isAuthed();
   }

   validateField(fieldName, value) {
     const fieldValidationErrors = this.state.errors;
     let emailValid = this.state.validations.email.valid;
     let passwordValid = this.state.validations.password.valid;
     let passwordConfirmValid = this.state.validations.password_confirmation.valid;
     //let phoneValid = this.state.validations.phone.valid;
     const validationFields = this.state.validations;

     validationFields[fieldName].dirty = true;
     switch (fieldName) {
       case 'email':
         emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
         fieldValidationErrors.email = emailValid ? '' : 'Неправильный формат email';
         validationFields[fieldName].valid = emailValid;
         break;
       // case 'phone':
       //   phoneValid = (value.split(' ').join('').length == 12) && (!!value.match(/^[+]7*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.0-9]*$/));
       //   fieldValidationErrors.phone = phoneValid ? '' : 'Неправильный формат телефона';
       //   validationFields[fieldName].valid = phoneValid;
       //   break;
       case 'password':
         passwordValid = value.length >= 6;
         fieldValidationErrors.password = passwordValid ? '' : 'Пароль слишком короткий';
         validationFields[fieldName].valid = passwordValid;
         validationFields.password_confirmation.valid = passwordValid && value == this.state.password_confirmation;
         break;

       case 'password_confirmation':
         passwordConfirmValid = passwordValid && value == this.state.password;
         fieldValidationErrors.password_confirmation = passwordConfirmValid ? '' : 'Пароли не совпадают';
         validationFields[fieldName].valid = passwordConfirmValid;
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
         && this.state.validations.password.valid
				 && this.state.validations.password_confirmation.valid
     });
   }

   render() {
     const { isLoad } = this.state;
     if (isLoad) {
       return <SpinnerEx />;
     }
     return (

       <Form onSubmit={this.handleSubmit}>

         <Example
           type="email"
           name="email"
           defaultValue={this.state.email}
           placeholder="email"
           onChange={(e) => this.handleInputChange(e)}
           errors={this.state.errors.email}
           isValid={this.state.validations.email.valid}
           isDirty={this.state.validations.email.dirty}
         />

         <Example
           type="password"
           name="password"
           placeholder="пароль"
           defaultValue={this.state.password}
           onChange={(e) => this.handleInputChange(e)}
           errors={this.state.errors.password}
           isValid={this.state.validations.password.valid}
           isDirty={this.state.validations.password.dirty}
         />
         <Example
           type="password"
           name="password_confirmation"
           placeholder="пароль (еще раз)"
           defaultValue={this.state.password_confirmation}
           onChange={(e) => this.handleInputChange(e)}
           errors={this.state.errors.password_confirmation}
           isValid={this.state.validations.password_confirmation.valid}
           isDirty={this.state.validations.password_confirmation.dirty}
         />
         <FormGroup>
           <Button
             disabled={!this.state.formValid}
             color="danger"
             className="col-12 registration-button-submit"
           >
     Регистрация
           </Button>
         </FormGroup>


				 <FormGroup className="margin-top-login">
           <div className="container h-100">
             <div className="row h-100 justify-content-center align-items-center">
               <div onClick={() => this.props.changeState('reg_phone')} className="col-12 text-center">
                 <p className="p-another-login">Регистрация по телефону</p>
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
             <div className="row h-100 justify-content-center align-items-center">
               <div onClick={() => this.props.changeState('login_phone')} className="col-12 text-center">
                 <p className="p-another-login">Войти</p>
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


export default connect(null, mapDispatchToProps)(RegEmailForm);
