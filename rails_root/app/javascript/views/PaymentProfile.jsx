import React from 'react';

import {
  Row,
  Form,
  CardHeader,
  Col,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardSubtitle,
  CardText,
  CardLink,
  Button,
  Spinner
} from 'reactstrap';
import AppDataManager from 'components/AppDataManager';
import { ExampleProfile, ExampleSelectProfile } from 'components/Forms/FormGroup';
import PaymentProfileCart from 'views/PaymentProfileCart';
import { connect } from 'react-redux';
import { notikNotik } from 'store/notifications/actions';

class PaymentProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      yandex: this.props.yandex,
      qiwi: this.props.qiwi,
      webmoney: this.props.webmoney,
      payment_type: '' || 'yandex',
      paymentArray: ['yandex', 'qiwi', 'webmoney'],
      currentValue: 'yandex',
      filledHash: {
        yandex: !!this.props.yandex,
        qiwi: !!this.props.qiwi,
        webmoney: !!this.props.webmoney
      },
      currentOptions: [],
      errors: {
        qiwi: [],
        yandex: [],
        webmoney: [],
        payment_type: []
      },

      validations: {
        qiwi: {
          dirty: false,
          valid: false,
        },

        yandex: {
          dirty: false,
          valid: false,
        },

        webmoney: {
          dirty: false,
          valid: false,
        },

        payment_type: {
          dirty: false,
          valid: false,
        },
      },

      formValid: false,
      isLoad: false,
    };
  }

  componentDidMount = () => {
    this.updatePayments();
  };

  updatePayments = () => {
    const {qiwi, yandex, webmoney, payment_type, paymentArray} = this.state;

    const currentArray = paymentArray.filter((p) => {
return this.state[p] == null || !this.state[p] });
    const currentValue = paymentArray.length > 0 ? currentArray[0] : null;
    let currentOptions = {};

    currentArray.forEach((name) => {
      currentOptions[name] = name;
    })

    this.setState({currentOptions: currentOptions, currentValue: currentValue, payment_type: currentValue});

  }

  renderPaymentCarts = () => {
    const {qiwi, yandex, webmoney, paymentArray} = this.state;
    const currentArray = paymentArray.filter((p) => { return this.state.filledHash[p]; } );
    return( currentArray.map((p, ind) => {
      return(<PaymentProfileCart deleteSubmit={this.deleteSubmit} key={ind} numbers={this.state[p]} image={p}/>);
    }));
  }

  validateField(fieldName, value) {
    const fieldValidationErrors = this.state.errors;
    let qiwiValid = this.state.validations.qiwi.valid;
    let yandexValid = this.state.validations.yandex.valid;
    let  webmoneyValid  = this.state.validations.webmoney.valid;
    const validationFields = this.state.validations;

    validationFields[fieldName].dirty = true;
    switch (fieldName) {
      case 'qiwi':
        qiwiValid = value.length && value.length > 10 && value.length <= 15;
        fieldValidationErrors.qiwi = qiwiValid
          ? ''
          : 'Неправильная длина счета';
        validationFields[fieldName].valid = qiwiValid;
        break;
      case 'yandex':
        yandexValid = value.length && value.length > 10 && value.length <= 15;
        fieldValidationErrors.yandex = yandexValid
          ? ''
          : 'Неправильная длина cчета';
        validationFields[fieldName].valid =  yandexValid;
        break;
       case 'webmoney':
        webmoneyValid = value.length && value.length > 10 && value.length <= 15;
        fieldValidationErrors.webmoney = webmoneyValid
          ? ''
          : 'Неправильная длина счета';
        validationFields[fieldName].valid = webmoneyValid ;

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
     const {payment_type} = this.state;

    formValid = this.state.validations[payment_type].valid;

    this.setState({
      formValid: formValid
    });
  }

  handleInputSelect = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({ [name]: value });
  }

  handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    const reValue = value.replace(/[\D]/gi, '');
    console.log('rVaule', reValue);

    this.setState({ [name]: reValue }, () => {
      this.validateField(name, reValue);
    });
  }


  handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.setState({ isLoad: true });

    const {payment_type} = this.state;
    let json;
    try {
      json = await AppDataManager.api('/main/profile/update_payments', {
        method: 'PUT',
        parameters: { payment_info: {[payment_type]: this.state[payment_type] } }
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
    this.updatePayments();
    const {filledHash} = this.state;
    this.setState({ errors: [], isLoad: false, filledHash: {...this.state.filledHash, [payment_type]: true}});
    this.props.notikNotik(`${payment_type} успешно добавлена`);
  }

  deleteSubmit = async (e, payment_type) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.setState({ isLoad: true });


    let json;
    try {
      json = await AppDataManager.api('/main/profile/update_payments', {
        method: 'PUT',
        parameters: { payment_info: {[payment_type]: null } }
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
    const {filledHash} = this.state;
    this.setState({[payment_type]: null, filledHash: {...this.state.filledHash, [payment_type]: false}});
    this.updatePayments();

    this.setState({ errors: [], isLoad: false});
    this.props.notikNotik(`${payment_type} успешно удалено`);
  }

  PaymentForm = (props) => {
     const isLoad = this.state.isLoading;
     if (isLoad) {
       return (
         <Spinner
            style={{ width: "3.3rem", height: "3.3rem" }}
            color="secondary"
            />
       );
     }

    const {payment_type} = this.state;

    return(

       <Form onSubmit={this.handleSubmit}>
         <Row>
           <Col className="p-2" md="4">
             <label>Выберите cлужбу</label>
             <ExampleSelectProfile
                name="payment_type"
                value={payment_type}
                placeholder="Yandex Money"
                onChange={this.handleInputSelect}
                options={this.state.currentOptions}
                errors={this.state.errors.payment_type}
                isValid={this.state.validations.qiwi.payment_type}
                isDirty={this.state.validations.qiwi.payment_type}
                formGroupClassNameName="margin-bottom-m"
                />

           </Col>

           <Col className="p-2" md="8">
             <label>{payment_type}</label>
             <ExampleProfile
               name={payment_type}
               value={this.state[payment_type]}
               placeholder={payment_type}
               onChange={this.handleInputChange}
               errors={this.state.errors[payment_type]}
               isValid={this.state.validations[payment_type].valid}
               isDirty={this.state.validations[payment_type].dirty}
               minlength="10"
               maxlength="15"
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
               Добавить
             </Button>
           </div>
         </Row>
       </Form>

     );
   }

 render() {
   return(
     <div>
       <Card className="card-user profile-card">
         <CardHeader>
           <CardTitle tag="h5">Платежные данные</CardTitle>
         </CardHeader>
         <CardBody>
           {this.state.currentValue && this.PaymentForm()}
         </CardBody>
       </Card>
       <Row>
         {this.renderPaymentCarts()}
       </Row>
     </div>
    );
  }
}

const mapDispatchToProps = {
  notikNotik
};

export default  connect(null, mapDispatchToProps)(PaymentProfile);
