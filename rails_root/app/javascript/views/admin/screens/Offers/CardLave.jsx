import React, { useState } from "react";
import { Col, Card, CardBody, Row, CardTitle, CardFooter } from "reactstrap";
import ModalInfo from "components/Modal/ModalInfo.jsx";
import { connect } from "react-redux";
import { openModal, closeModal } from "store/modals/actions";
import { withRouter, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();
const CardLave = props => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

	const handleSubmit = async (e, link) => {
     if (e && typeof e.preventDefault === 'function') {
       e.preventDefault();
     }
    const hrefLink = link + '&sub1=' + props.userID;
    console.log('link', hrefLink);

    window.open(hrefLink, "_blank");
		//window.location.href = hrefLink;

   }

  const offerCurrency = (currency) => {
    switch (currency) {
    case 'rub':
      return <span className="card-lave-currency-text">rub</span>;
    case '$':
      return <span className="card-lave-currency-text">usd</span>;
    case 'euro':
      return <span className="card-lave-currency-text">eur</span>;
     default: <span>rub</span>;

    }
  }


  const offerCurrencyClassname = (currency) => {
    switch (currency) {
    case 'rub':
      return "сurrency-box сurrency-box__rub pull-right";
    case '$':
      return "сurrency-box сurrency-box__usd pull-right";
    case 'euro':
      return "сurrency-box сurrency-box__euro pull-right";
     default: "сurrency-box сurrency-box__rub pull-right";

    }
  }


  const typeToSign = (offer_type) => {
    return (offer_type == 'rub' ? '₽' : (offer_type == '$' ?  '$' : '%' ))
  }

  return (
      <Card className="card-stats">
        <CardBody>
          <Row>
            <Col md="9" xs="9">
              <div className="text-center icon-warning img-container-div-min">
                <img
                  alt="..."
                  className="img-no-padding img-responsive img-container-div"
                  src={props.logo}
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
                  modalTitle={props.title}
                  toggle={toggle}
									desc={props.desc}
                  isOpen={modal}
                  logo={props.logo}
                   categories={props.categories}
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
                {props.title}
              </p>

              <p className="card-lave-name-type text-truncate">{props.subtitle}</p>

              <p className="">
                <span className="card-lave-percent-number">
                  {props.cashback}{typeToSign(props.offer_type)}
                </span>
                <span className="p-2 card-lave-percent-text">{props.bonus_type}</span>
                <span className={offerCurrencyClassname(props.currency)}>{offerCurrency(props.currency)}</span>
              </p>
            </div>

            <div className="col-12">
              <button
								onClick={(e) => handleSubmit(e, props.link)}
                type="button"
                className="btn btn-primary btn-lg btn-block card-lave-button"
              >
                <span>Начать</span>
              </button>
            </div>
          </div>
        </CardFooter>
      </Card>
  );
};


export default CardLave;
