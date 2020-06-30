import React from 'react';

import { Col, Card, CardBody, CardImg, CardTitle, CardSubtitle, CardText, CardLink } from 'reactstrap';

class PaymentProfileCart extends React.Component {

  render () {
    const textName = (name) => {
      return {
        yandex: 'Yandex Деньги',
        webmoney: "WebMoney",
        qiwi: 'Qiwi'
      }[name];
    }
    return(
      <Col md='6'>
        <Card className='card-payment'>
          <CardBody>
            <Col md='6'className='pull-right'>
            <CardImg

                    alt="..."
                    src={require(`assets/img/${this.props.image}.png`)}
                  >
                </CardImg>
            </Col>
            <CardSubtitle className="mb-2 text-muted text">{textName(this.props.image)}</CardSubtitle>
            <CardText className='payment-card-text'>{this.props.numbers.slice(0,10)}******</CardText>
            <CardLink href='#' onClick={(e)=> this.props.deleteSubmit(e, this.props.image)}> <i className="fa fa-trash fa-2x" /> <span>Удалить</span></CardLink>

          </CardBody>
        </Card>
      </Col>
    )
  }
}


export default  PaymentProfileCart;
