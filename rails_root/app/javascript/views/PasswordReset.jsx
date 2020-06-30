import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SpinnerEx from 'components/Spinner';
import AppDataManager from 'components/AppDataManager';
import NewPasswordForm from 'components/Forms/NewPasswordForm';
import { closeModal } from "store/modals/actions";

class PasswordReset extends React.Component {


	_isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
			isLoading: true,
      tokenError: false,
      completeFlag: false,
      errorMessage: ""
    };

  }



	fetchToken = async ()  => {
    this._isMounted && this.setState({isLoading: true})

    try {
      const token = this.props.match.params.token;
			const {body}  = await AppDataManager.api("/password/check", {
        method: 'GET',
        parameters: {reset_token: token} });

			//this._isMounted && this.setState({body: body});

    } catch (e) {
      console.warn(e)
      let { token } = e.json.errors;
      this._isMounted && this.setState({isLoading: false, tokenError: true, errorMessage: token});
      return
    } finally {
      this._isMounted && this.setState({isLoading: false});
    }
    if (!this._isMounted) {return}
  }

	componentDidMount() {
		this._isMounted = true;
    this._isMounted && this.props.closeModal();
    if (this.props.isAuth) {
      return this.props.history.push("/main/dashboard");
    }
		this.fetchToken();
  }


  updateForm = () => {
    this.setState({completeFlag: true});
  }

	componentWillUnmount() {
		this._isMounted = false;
  }


  render() {
    const { isLoading, tokenError, completeFlag } = this.state;
    const Text = (props) => {
      return (
        <div className="col-lg-7 col-12">
          <p className="lead">
            {this.state.errorMessage}
          </p>
        </div>
      )
    }
    const TextComplete = () => {
      return (
        <div className="col-lg-7 col-12">
          <p className="lead">
            Вы успешно сменили пароль
          </p>
        </div>

      )}

    const MainContent = (props) => {
      if (isLoading) {
        return <SpinnerEx />;
     } else if(tokenError){
       return <Text/>;
     } else if(completeFlag){
       return <TextComplete/>;
     } else {
       return <NewPasswordForm {...props}/>;
     }

    }

    const token = this.props.match.params.token;
    return (
			<div className='row mt-5 mb-5'>
				<div className='col-12 mt-5 mb-5'>
					<div className='row mb-5'>
						<div className='col-12 p-5 marginTOP mb-5'>
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className='col-lg-7 col-12'>
						        <h1 className='stats-p-30-days'>Восстановление пароля</h1>
					        </div>
                  <MainContent token={token} updateForm={this.updateForm} {...this.props}/>
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
const mapDispatchToProps = {
  closeModal
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordReset));
