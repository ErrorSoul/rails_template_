/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
} from "reactstrap";
import AppDataManager from "../AppDataManager";
import { deepCamelCase, camelCase } from "../../utils/deepUtils";
import routes from "routes.js";
import ModalExample from "../../components/Modal/Modal";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { openModal, closeModal } from "../../store/modals/actions";
import { logIn, logOut } from "../../store/auth/actions";
import { notikLogOut } from "../../store/notifications/actions";
import LaveLogo  from "components/LaveLogo";

class Header extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      isOpenModal: false,
      regState: "login_phone",
      color: "transparent",
      result: "xxx",
    };
    this.sidebarToggle = React.createRef();
  }
  toggle() {
    if (this.state.isOpen) {
      this.setState({
        color: "transparent",
      });
    } else {
      this.setState({
        color: "dark",
      });
    }
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  modalF = (e) => {
    this.props.openModal();
    // this.setState({
    // isOpenModal: !this.state.isOpenModal
    //   }, () => {setTimeout(() => {window.innerWidth < 993 && this.setState({isOpen: !this.state.isOpen}); this.updateColor();}, 1200 ) } )
  };

  modalToggle = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  };

  goToClick = (url) => {
    window.innerWidth < 993 &&
      this.setState({ isOpen: !this.state.isOpen }, () => {
        this.updateColor();
      });
    this.props.history.push(url);
  };

  modalClose = () => {
    this.props.closeModal();
  };

  dropdownToggle(e) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  getBrand() {
    let brandName = "Default Brand";
    routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  }
  openSidebar() {
    document.documentElement.classList.toggle("nav-open");
    this.sidebarToggle.current.classList.toggle("toggled");
  }
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.isOpen) {
      console.log("to+dark");
      this.setState({
        color: "dark",
      });
    } else {
      this.setState({
        color: "transparent",
      });
      this.setState({
        color: "transparent",
      });
    }
  };
  componentDidMount() {
    this._isMounted = true;
    //window.addEventListener("resize", bind(this));

    this.fetchAuth();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      this.sidebarToggle.current.classList.toggle("toggled");
    }
  }

  async fetchAuth() {
    this._isMounted && this.setState({ isLoading: true });

    try {
      const { isAuth, user } = await AppDataManager.api(`/auth`);
      console.log("isAuth", isAuth);
      console.log("user", user);
      console.log("user", user.id);

      this.props.logIn(user);
    } catch (e) {
      console.warn(e);
      this.props.logOut();
      return;
    } finally {
      this._isMounted && this.setState({ isLoading: false });
    }
    if (!this._isMounted) {
      return;
    }

    this.setState({ isDraftLoaded: true });
  }

  httpLogout = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    this.setState({ isLoading: true });

    try {
      const { message } = await AppDataManager.api(`/auth/1`, {
        method: "DELETE",
      });
      console.log("logout message", message);
      this.logout();
    } catch (e) {
      console.warn(e);
      this.props.logOut();
      return;
    } finally {
      this._isMounted && this.setState({ isLoading: false });
    }
    if (!this._isMounted) {
      return;
    }
  };

  logout = () => {
    console.log("LOG OUT");
    this.props.logOut();
    this.props.notikLogOut("Вы успешно вышли. До свидания!");
  };

  changeState = (newState) => {
    let currentState = this.state.regState;
    this.setState({ regState: newState });
  };

  render() {
    const auth = this.props.isAuth;

    return (
      // add or remove classes depending if we are on full-screen-maps page or not
      <Navbar
        color={
          this.props.location.pathname.indexOf("full-screen-maps") !== -1
            ? "dark"
            : this.state.color
        }
        expand='lg'
        className={
          this.props.location.pathname.indexOf("full-screen-maps") !== -1
            ? "navbar-absolute fixed-top navbar-without-padding "
            : "navbar-absolute fixed-top navbar-without-padding " +
              (this.state.color === "transparent" ? "navbar-transparent " : "")
        }
      >
        <Container fluid className='navbar-container-padding'>
          <ModalExample
            history={this.props.history}
            modalIsOpen={this.props.modalIsOpen}
            modalClose={this.props.closeModal}
            changeState={this.changeState}
            regState={this.state.regState}
            isAuthed={this.props.isAuthed}
          />
          <div className='navbar-wrapper'>
            <NavbarBrand className='navbar-lave-logo' href='/'>
              <LaveLogo/>
            </NavbarBrand>
          </div>
          <NavbarToggler onClick={() => this.toggle()}>
            <span className='navbar-toggler-bar navbar-kebab' />
            <span className='navbar-toggler-bar navbar-kebab' />
            <span className='navbar-toggler-bar navbar-kebab' />
          </NavbarToggler>
          <Collapse
            isOpen={this.state.isOpen}
            navbar
            className='justify-content-between'
          >
            {auth && (<Nav navbar>
           <NavItem>
                <a
                  onClick={() => this.goToClick("/main/dashboard")}
                  className='nav-link btn-magnify'
                >
                  <i className='nc-icon nc-chart-bar-32 d-lg-none d-md-block' />
                  <p>
                    <span className='d-md-block navbar-link-name'>Главная</span>
                  </p>
                </a>
              </NavItem>
              <NavItem>
                <a
                  onClick={() => this.goToClick("/main/offers")}
                  className='nav-link btn-magnify'
                >
                  <i className='nc-icon nc-credit-card d-lg-none d-md-block' />
                  <p>
                    <span className='d-md-block navbar-link-name'>Офферы</span>
                  </p>
                </a>
              </NavItem>

                <NavItem>
                  <a
                    onClick={() => this.goToClick("/main/orders")}
                    className='nav-link btn-magnify'
                  >
                    <i className='nc-icon nc-bullet-list-67 d-lg-none d-md-block' />
                    <p>
                      <span className='d-md-block navbar-link-name'>
                        История сделок
                      </span>
                    </p>
                  </a>
                </NavItem>

            </Nav>  )}

            <Nav navbar>


              {auth && (
                <Nav>
                  <Dropdown
                    nav
                    isOpen={this.state.dropdownOpen}
                    toggle={(e) => this.dropdownToggle(e)}
                  >
                    <DropdownToggle caret nav>
                      <i className='nc-icon nc-circle-10' />
                      <p>
                        <span className='d-lg-block d-md-block'>
                          id#{this.props.userID}
                        </span>
                      </p>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem to={"/main/profile"} tag={Link}>
                        Профиль
                      </DropdownItem>
                      <DropdownItem onClick={() => this.httpLogout()} tag='a'>
                        <span className='d-lg-block d-md-block'>
                          Выйти <i className='nc-icon nc-user-run' />
                        </span>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Nav>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

//export default Header;
const d = (state) => {
  return {
    modalIsOpen: state.modal.modalIsOpen,
    isAuth: state.auth.isAuth,
    userID: (state.auth.login || "").id,
  };
};

const mapDispatchToProps = {
  openModal: openModal,
  closeModal: closeModal,
  logIn: logIn,
  logOut: logOut,
  notikLogOut: notikLogOut,
};

export default connect(d, mapDispatchToProps)(Header);
