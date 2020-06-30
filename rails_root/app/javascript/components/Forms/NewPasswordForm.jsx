import React from 'react';
import { Form, Button, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Example, ExamplePhone } from './FormGroup';
import SpinnerEx from '../Spinner';
import AppDataManager from '../AppDataManager';
import { logIn } from '../../store/auth/actions';
import { notikLogIn } from '../../store/notifications/actions';
import OffertaFormGroup from './OffertaFormGroup';

class NewPasswordForm  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.token,
      password: '',
      password_confirmation: '',
      errors: {
				password: [],
				password_confirmation: [],
      },

      validations: {


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

     const { token,  password } = this.state;

     let json;
     try {
       json = await AppDataManager.api('/password/reset', { method: 'POST', parameters: { password, reset_token: token }  });
       let {message} = json;
       if (message == 'ok') {
         this.props.updateForm();
       }
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

     this.setState({ errors: [] });
   }

   validateField(fieldName, value) {
     const fieldValidationErrors = this.state.errors;

     let passwordValid = this.state.validations.password.valid;
     let passwordConfirmValid = this.state.validations.password_confirmation.valid;

     const validationFields = this.state.validations;

     validationFields[fieldName].dirty = true;
     switch (fieldName) {

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
	    formValid: this.state.validations.password.valid
				 && this.state.validations.password_confirmation.valid,
     });
   }

   render() {
     console.log("INEER TOKEN" , this.state.token);
     const { isLoad } = this.state;
     if (isLoad) {
       return <SpinnerEx />;
     }
     return (
       <div className='col-lg-7 col-12'>
       <Form onSubmit={this.handleSubmit}>

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
     Обновить пароль
           </Button>
         </FormGroup>





         <FormGroup className="margin-top-login">
           <div className="container h-100">
             <div className="row h-100 justify-content-center align-items-center">
               <div onClick={() => this.props.history.push('/main/dashboard')} className="col-12 text-center">
                 <p className="p-another-login">На главную</p>
               </div>
             </div>
           </div>
         </FormGroup>

				 <OffertaFormGroup {...this.props}/>
       </Form>
       </div>
     );
   }
}


const mapDispatchToProps = {
  logIn,
	notikLogIn
};
export default connect(null, mapDispatchToProps)(NewPasswordForm);
