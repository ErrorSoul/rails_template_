import React from "react";
import AppDataManager from 'components/AppDataManager';
import {Row, Col, Spinner} from 'reactstrap';
import CardLave from 'views/admin/screens/Offers/CardLave';

class CardMainList extends React.Component {
	_isMounted = false
  constructor(props) {
    super(props);
    this.state = {
			isLoading: true,
			offers: [],
    };
	}


	fetchOffers = async ()  => {
    this._isMounted && this.setState({isLoading: true})

    try {
     const { offers }  = await AppDataManager.api(`/main/offers`)
			this._isMounted && this.setState({offers: offers});
			console.log("offers", offers);

    } catch (e) {
      console.warn(e)
      return
    } finally {

      this._isMounted && this.setState({isLoading: false})
    }
    if (!this._isMounted) {return}
  }

	componentDidMount() {
		this._isMounted = true;
		this.fetchOffers();
   }

   componentWillUnmount() {
		this._isMounted = false;
  }

	componentUnMount() {
		this._isMounted = true;
		this.fetchOffers();
  }

  render() {
		const isLoad = this.state.isLoading;
		console.log('Card Main Props ', this.props);
		if (isLoad) {
			return  (<div className="content"><Row><Col md="12"><Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="secondary" /></Col></Row></div>);
		}
		const { offers } =  this.state;
    const { userID } = this.props;

		const listItems = offers.map((offer, index) =>
		 <Col className="card-max-width" key={index} lg="4" md="6" sm="6">
     <CardLave
				{...this.props}
				title={offer.title}
				logo={offer.logo}
				cashback={offer.cashback}
				desc={offer.description}
				link={offer.link}
        subtitle={offer.subtitle}
        offer_type={offer.offer_type}
        bonus_type={offer.bonus_type}
        currency={offer.currency}
        categories={offer.categories}
        userID={userID}
				/>
			</Col>
		);
    return (
			<div className='row'>{listItems}</div>
		)
	}
}





export default CardMainList;
