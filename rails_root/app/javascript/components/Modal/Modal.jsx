/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import RegPhoneForm from '../Forms/RegPhoneForm';
import RegEmailForm from '../Forms/RegEmailForm';
import CodeConfirmationForm from '../Forms/CodeConfirmationForm';
import LoginForm from '../Forms/LoginForm';
import PhoneForm from '../Forms/PhoneForm';
import ForgotEmailForm  from '../Forms/ForgotEmailForm';

const ModalExample = (props) => {
  const {
		history,
    className,
    modalIsOpen,
    modalClose,
    regState,
    changeState,
    isAuthed,
  } = props;

  const [modal, setModal] = useState(modalIsOpen);
  const titleHash = {
    reg_phone: 'Регистрация по телефону',
		reg_email: 'Регистрация по email',
    second: 'Введите код',
    login_email: 'Вход по почте',
    login_phone: 'Вход по телефону',
    forgot_email: 'Восстановление пароля'
  };

  const modalTitle = titleHash[regState];
  const toggle = () => { console.log('vvvvvvvvvvvvvvv'); openModal(), setModal(!modal); };
  const close = () => modalClose();
  const closeBtn = <button className="close close-button-click" onClick={close}>&times;</button>;
  const closeBtnA = (
    <button className="close close-button-click" onClick={close}>
      <img className="Bounds" src={require('assets/img/bounds.svg')} alt="..." />
    </button>
  );

  const closeBtnFinal = ((regState == 'reg_phone') || (regState == 'reg_email') || (regState == 'login_email') || (regState == 'login_phone') || (regState == 'forgot_email')) ? closeBtn : closeBtnA;
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

  return (
    <div>
      <Modal isOpen={modalIsOpen} toggle={toggle} className="registration-modal">
        <ModalHeader className="align-items-center modal-header-login" close={closeBtnFinal} toggle={toggle}>{modalTitle}</ModalHeader>


<ModalBody>
          <RState history={history} isAuthed={isAuthed} changeState={changeState} toggle={modalClose} regState={regState} />
        </ModalBody>
      </Modal>
    </div>
  );
};


export default ModalExample;
