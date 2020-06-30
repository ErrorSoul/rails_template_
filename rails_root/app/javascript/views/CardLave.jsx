import React, { useState } from "react";
import { Col, Card, CardBody, Row, CardTitle, CardFooter } from "reactstrap";
import ModalInfo from "../components/Modal/ModalInfo.jsx";
import { connect } from "react-redux";
import { openModal, closeModal } from "store/modals/actions";
import { withRouter, Link } from "react-router-dom";

const CardLave = props => {
  const h = {
    1: "МАРАФОНБЕТ",
    2: "BingoBoom",
    3: "1XBET",
    4: "Another Long Name",
    5: "LEON",
    6: "Too Long Too Long Naaame",
    7: "$$$STARRRR",
    8: "King Bank"
  };

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <Col className="card-max-width" lg="4" md="6" sm="6">
      <Card className="card-stats">
        <CardBody>
          <Row>
            <Col md="9" xs="9">
              <div className="text-center icon-warning img-container-div-min">
                <img
                  alt="..."
                  className="img-no-padding img-responsive img-container-div"
                  src={require(`assets/img/logos/${props.number}.png`)}
                />
              </div>
            </Col>
            <Col md="3" xs="3">
              <div className="pull-right">
                <div
                  onClick={toggle}
                  className="text-center icon-warning cursor-pointer-card-lave"
                >
                  <img
                    src={require("assets/img/circle.svg")}
                    className="Bounds"
                  />
                </div>
                <ModalInfo
                  modalTitle={h[props.number]}
                  toggle={toggle}
                  isOpen={modal}
                />

                <p />
              </div>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <hr />
          <div className="row">
            <div className="col-12 text-nowrap bd-highlight">
              <p className="card-lave-name-title text-truncate">
                {h[props.number]}
              </p>

              <p className="card-lave-name-type">Букмекерская контора</p>

              <p className="">
                <span className="card-lave-percent-number">
                  {props.number % 2 == 0 ? 15 : 20}%
                </span>
                <span className="p-2 card-lave-percent-text">кэшбек</span>
              </p>
            </div>

            <div className="col-12">
              <button
                onClick={() => {
                  !props.isAuth && props.openModal();
                }}
                type="button"
                className="btn btn-primary btn-lg btn-block card-lave-button"
              >
                <span>Начать</span>
              </button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Col>
  );
};

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth
  };
};

const mapDispatchToProps = {
  openModal: openModal,
  closeModal: closeModal
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CardLave)
);
