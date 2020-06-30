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

class ForgotEmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      text_notik: false,
      errors: {
        email: []
      },

      validations: {
        email: {
          dirty: false,
          valid: false
        }
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

     const { email } = this.state;

     let json;
     try {
       json = await AppDataManager.api('/password/forgot', { method: 'POST', parameters: { email }  });
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

     this.setState({ errors: [], text_notik: true, isLoad: false });
		 this.props.notikLogIn("Мы отправили письмо со сбросом пароля");
   }

   validateField(fieldName, value) {
     const fieldValidationErrors = this.state.errors;
     let emailValid = this.state.validations.email.valid;
     const validationFields = this.state.validations;

     validationFields[fieldName].dirty = true;
     switch (fieldName) {
       case 'email':
         emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
         fieldValidationErrors.email = emailValid ? '' : 'Неправильный формат email';
         validationFields[fieldName].valid = emailValid;
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
     });
   }

   render() {
     const { isLoad } = this.state;
     if (isLoad) {
       return <SpinnerEx />;
     }

     if (this.state.text_notik) {
       return(
         <FormGroup className="margin-top-login">
           <div className="container h-100">
             <div className="row h-100 justify-content-center align-items-center">
               <div className="col-12 text-center">
                 <p className="">Мы отправили инструкцию по смене пароля на <span className="p-another-login">{this.state.email}</span></p>
                 <p className="">Проверьте почту (письмо может попасть в папку "спам")</p>
               </div>
             </div>
           </div>
         </FormGroup>
       )
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


         <FormGroup>
           <Button
             disabled={!this.state.formValid}
             color="danger"
             className="col-12 registration-button-submit"
           >
           Cбросить пароль
           </Button>
         </FormGroup>


				 <FormGroup className="margin-top-login">
           <div className="container h-100">
             <div className="row h-100 justify-content-center align-items-center">
               <div onClick={() => this.props.changeState('reg_email')} className="col-12 text-center">
                 <p className="p-another-login">Регистрация по почте</p>
               </div>
             </div>
           </div>
         </FormGroup>

         <FormGroup className="block-login-red">
           <div className="container h-100">
             <div className="row h-100 justify-content-center align-items-center">
               <div onClick={() => this.props.changeState('login_email')} className="col-12 text-center">
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


export default connect(null, mapDispatchToProps)(ForgotEmailForm);
