import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SpinnerEx from 'components/Spinner';
import AppDataManager from 'components/AppDataManager';
import RegPhoneForm from 'components/Forms/RegPhoneForm';
import RegEmailForm from 'components/Forms/RegEmailForm';
import CodeConfirmationForm from 'components/Forms/CodeConfirmationForm';
import LoginForm from 'components/Forms/LoginForm';
import PhoneForm from 'components/Forms/PhoneForm';
import ForgotEmailForm  from 'components/Forms/ForgotEmailForm';
import AppNameLogo  from "components/AppNameLogo";


class MainLogin extends React.Component {


	_isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
			isLoading: true,
      regState: 'login_phone',
    };

  }



	fetchToken = async ()  => {
    this._isMounted && this.setState({isLoading: true})
    try {
    } catch (e) {
      console.warn(e)
      this._isMounted && this.setState({isLoading: false});
      return
    } finally {
      this._isMounted && this.setState({isLoading: false});
    }
    if (!this._isMounted) {return}
  }

	componentDidMount() {
		this._isMounted = true;
    if (this.props.isAuth) {
      return this.props.history.push("/main/dashboard");
    }
  }


  updateForm = () => {
    this.setState({completeFlag: true});
  }

	componentWillUnmount() {
		this._isMounted = false;
  }

  changeState = (newState) => {
    let currentState = this.state.regState;
    this.setState({regState: newState});
  }

  toggle = () => {
    console.log("toggle simulation")
  }

  render() {
    const { isLoading, tokenError, completeFlag } = this.state;
     const titleHash = {
       reg_phone: 'Регистрация по телефону',
		   reg_email: 'Регистрация по email',
       second: 'Введите код',
       login_email: 'Вход по почте',
       login_phone: 'Вход по телефону',
       forgot_email: 'Восстановление пароля'
     };

    const { regState  } = this.state;
    const modalTitle = titleHash[regState];
    //const toggle = () => { console.log('vvvvvvvvvvvvvvv'); openModal(), setModal(!modal); };
    //const close = () => modalClose();
    //const closeBtn = <button className="close close-button-click" onClick={close}>&times;</button>;
    // const closeBtnA = (
    //   <button className="close close-button-click" onClick={close}>
    //     <img className="Bounds" src={require('assets/img/bounds.svg')} alt="..." />
    //   </button>
    // );


    const RState = (props) => {
      switch (props.regState) {
      case 'reg_phone':
        return <RegPhoneForm history={props.history} changeState={props.changeState} toggle={props.toggle}/>;
			case 'reg_email':
        return <RegEmailForm history={props.history} changeState={props.changeState} toggle={props.toggle}/>;
      case 'second':
        return <CodeConfirmationForm history={props.history} isAuthed={props.isAuthed} changeState={props.changeState} toggle={props.toggle} />;
      case 'login_email':
        return <LoginForm history={props.history} isAuthed={props.isAuthed} changeState={props.changeState} toggle={props.toggle} />;
      case 'login_phone':
        return <PhoneForm history={props.history} isAuthed={props.isAuthed} changeState={props.changeState} toggle={props.toggle} />;

      case 'forgot_email':
        return <ForgotEmailForm history={props.history} isAuthed={props.isAuthed} changeState={props.changeState} toggle={props.toggle} />;
      default:
        return null;
      }
    };




    const token = this.props.match.params.token;
    const {history, isAuthed}  = this.props;
    return (
			<div className='row mt-5 mb-5'>
				<div className='col-12 mt-5 mb-5'>
					<div className='row mb-5'>
						<div className='col-12 p-5 marginTOP mb-5'>
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className='col-lg-5 col-12 main-login-border'>
                    <div className="row h-100 justify-content-center align-items-center">
                      <div className='col-xs-12 mb-3 mt-3'>
						            <AppNameLogo width="150px" height="75px" nameClass='lave-brand'/>
                      </div>
                    </div>
                    <RState history={history} isAuthed={isAuthed} changeState={this.changeState} regState={regState} toggle={this.toggle}/>
					        </div>

                </div>
              </div>
						</div>
					</div>
				</div>
			</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuth
  };
};

export default withRouter(connect(mapStateToProps, null)(MainLogin));
