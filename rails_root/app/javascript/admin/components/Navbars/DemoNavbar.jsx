
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
  Input
} from "reactstrap";

import { connect } from 'react-redux';
import routes from "admin_routes.js";
import AppDataManager from 'components/AppDataManager';
import { openModal, closeModal } from "store/modals/actions";
import { logIn, logOut } from "store/auth/actions";
import { notikLogOut } from "store/notifications/actions";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      color: "transparent"
    };
    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.sidebarToggle = React.createRef();
  }
  toggle() {
    if (this.state.isOpen) {
      this.setState({
        color: "transparent"
      });
    } else {
      this.setState({
        color: "dark"
      });
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  dropdownToggle(e) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  getBrand() {
    let brandName = "AppName Admin";
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
  updateColor() {
    if (window.innerWidth < 993 && this.state.isOpen) {
      this.setState({
        color: "dark"
      });
    } else {
      this.setState({
        color: "transparent"
      });
    }
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor.bind(this));
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


	httpLogout = async(e) => {
		if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    this.setState({isLoading: true});

    try {
     const {message}  = await AppDataManager.api(`/auth_s`, {method: 'DELETE'});
		 this.logout();

    } catch (e) {
      console.warn(e)
      return
    } finally {
      this._isMounted && this.setState({isLoading: false});
    }
    if (!this._isMounted) {return}


  }

	logout = () => {
		console.log('LOG OUT');
		this.props.logOut();
		this.props.notikLogOut('Вы успешно вышли. До свидания!');
	}


  render() {
		const isAuth = this.props.isAuth;
    return (
      // add or remove classes depending if we are on full-screen-maps page or not
      <Navbar
        color={
          this.props.location.pathname.indexOf("full-screen-maps") !== -1
            ? "dark"
            : this.state.color
        }
        expand="lg"
        className={
          this.props.location.pathname.indexOf("full-screen-maps") !== -1
            ? "navbar-absolute fixed-top"
            : "navbar-absolute fixed-top " +
              (this.state.color === "transparent" ? "navbar-transparent " : "")
        }
      >
      {isAuth &&  <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-toggle">
              <button
                type="button"
                ref={this.sidebarToggle}
                className="navbar-toggler"
                onClick={() => this.openSidebar()}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand href="/">{this.getBrand()}</NavbarBrand>
          </div>
          <NavbarToggler onClick={this.toggle}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse
            isOpen={this.state.isOpen}
            navbar
            className="justify-content-end"
          >
            <form>
              <InputGroup className="no-border">
                <Input placeholder="Search..." />
                <InputGroupAddon addonType="append">
                  <InputGroupText>
                    <i className="nc-icon nc-zoom-split" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </form>
            <Nav navbar>
              <NavItem onClick={() => this.openSidebar()}>
                <Link to="#" className="nav-link btn-magnify">
                  <i className="nc-icon nc-layout-11" />
                  <p>
                    <span className="d-lg-none d-md-block">Stats</span>
                  </p>
                </Link>
              </NavItem>
              <Dropdown
                nav
                isOpen={this.state.dropdownOpen}
                toggle={e => this.dropdownToggle(e)}
              >
                <DropdownToggle caret nav>
                  <i className="nc-icon nc-circle-10" />
                  <p>
                    <span className="d-lg-block d-md-block">{this.props.login}</span>
                  </p>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag="a">Профиль</DropdownItem>
                  <DropdownItem onClick={ () => this.httpLogout() } tag="a">Выход</DropdownItem>
                </DropdownMenu>
              </Dropdown>

            </Nav>
          </Collapse>
        </Container> }
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
		return {
			isAuth: state.auth.isAuth,
			login: state.auth.adminLogin
		};
};

const mapDispatchToProps = {
		openModal: openModal,
		closeModal: closeModal,
		logIn: logIn,
		logOut: logOut,
	  notikLogOut: notikLogOut
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
