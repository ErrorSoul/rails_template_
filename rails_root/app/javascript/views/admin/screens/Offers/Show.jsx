import React from "react";
import MyTable from 'components/customTables/Table';
import	User	from '../../User.jsx';
import AppDataManager from 'components/AppDataManager';
import	CardLave	from './CardLave.jsx';
import EditForm from 'components/Forms/OfferEditForm';
import { updateCashback, } from "store/offers/actions";
import { notikNotik } from 'store/notifications/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import InfoArea from './InfoArea';
import InfoPayment from './InfoPayments';

// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	CardTitle,
	FormGroup,
	Form,
	Input,
	Row,
	Col,
	Badge
} from "reactstrap";

class Show extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			offer: {}
		};
	}

	fetchOffer = async ()	 => {
		this._isMounted && this.setState({isLoading: true})

		try {
		 const Id = this.props.match.params.id
		 const {offer}	= await AppDataManager.api(`/admin/offers/${Id}`)
			console.log('O', offer)
			//this._isMounted && this.props.updateTitle(offer.title);
			this._isMounted && this.setState({offer: offer, offerLoad: true});
			console.log("offer", this.state.offer)

		} catch (e) {
			console.warn(e)
			return
		} finally {
			this._isMounted && this.setState({isLoading: false})
		}
		if (!this._isMounted) {return}
	}

	updateOffer = (offer) => {
		this.setState({offer});
	}

  updateOfferType = (offer_type) => {
    const  {offer} = this.state;
    this.setState({offer: { ...this.state.offer, offer_type: offer_type}});
  }

  updateBonusType = (bonus_type) => {
    const  {offer} = this.state;
    this.setState({offer: { ...this.state.offer, bonus_type: bonus_type}});
  }

  updateCurrency = (currency) => {
    const  {offer} = this.state;
    this.setState({offer: { ...this.state.offer, currency: currency}});
  }

  updateCashback = (cashback) => {
    const  {offer} = this.state;
    this.setState({offer: { ...this.state.offer, cashback: cashback}});
  }

  updateTitle = (title) => {
    const  {offer} = this.state;
    this.setState({offer: { ...this.state.offer, title: title}});
  }

  updateSubTitle = (subtitle) => {
    const  {offer} = this.state;
    this.setState({offer: { ...this.state.offer, subtitle: subtitle}});
  }

  updatePayout = (payout) => {
    const  {offer} = this.state;
    this.setState({offer: { ...this.state.offer, payout: payout}});
  }

  updateAffiseRevenue = (affise_revenue) => {
    const  {offer} = this.state;
    this.setState({offer: { ...this.state.offer, affise_revenue: affise_revenue}});
  }

  updateOfferLink = (link) => {
    const  {offer} = this.state;
    this.setState({offer: { ...this.state.offer, link: link}});
  }

	onChange = (e) =>
		this.props.updateTitle(e.target.value)

	componentDidMount() {
		this._isMounted = true;
		this.fetchOffer();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}


	render() {

		const LeftCart = ({offer, title, cashback}) => {
			return (
				<CardLave
					 title={title}
					 logo={offer.logo}
           offer_type={offer.offer_type}
					 cashback={cashback}
					 desc={offer.description}
           subtitle={offer.subtitle}
           bonus_type={offer.bonus_type}
           currency={offer.currency}
           categories={offer.categories}
					 />
			)
		}

		const categoryBadges = () => {
			const {categories} = this.state.offer
			if (categories) {
				return(
					categories.map((category, num) => {
						return(<span key={num} className='pull-right'><Badge color='info'>{category}</Badge></span>)
					})
				)
			} else {<span></span>}
		}


		return (

			<div>
				<h4 className="title">Offer # {this.state.offer.id}</h4>
				<Row>
					<Col className="card-max-width" lg="4" md="6" sm="6">
						<LeftCart offer={this.state.offer}
											cashback={this.state.offer.cashback}
											title={this.state.offer.title} />
 						<InfoArea state={this.state.offer.state}
											id={this.state.offer.id}
											updateOfferState={this.updateOffer}
											notikNotik={this.props.notikNotik} />

            <InfoPayment payments={this.state.offer.payments}/>
					</Col>

					<Col md="8">
						<Card className="">
							<CardHeader>
								<CardTitle tag="h5">
									<span className=''>Edit Offer</span>
									{ categoryBadges() }
								</CardTitle>
							</CardHeader>
							<CardBody>

								<EditForm title={this.state.offer.title}
													updateOffer={this.updateOffer}
                          updateCashback={this.updateCashback}
                          updateTitle={this.updateTitle}
                          updateSubTitle={this.updateSubTitle}
                          updateOfferLink={this.updateOfferLink}
                          updateOfferType={this.updateOfferType}
                          updatePayout={this.updatePayout}
                          updateBonusType={this.updateBonusType}
                          updateCurrency={this.updateCurrency}
                          updateAffiseRevenue={this.updateAffiseRevenue}
                          payout={this.state.offer.payout}
													id={this.state.offer.id}
													cashback={this.state.offer.cashback}
													link={this.state.offer.link}
													affise_id={this.state.offer.affise_id}
                          affise_revenue={this.state.offer.affise_revenue}
                          subtitle={this.state.offer.subtitle}
													description={this.state.offer.description}
                          offer_type={this.state.offer.offer_type}
                          currency={this.state.offer.currency}
                          bonus_type={this.state.offer.bonus_type}
                          offerLoad={this.state.offerLoad}
													affise_title={this.state.offer.affise_title}/>

							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		)
	}
}


const mapDispatchToProps = {
	notikNotik
};
export default withRouter(connect(null, mapDispatchToProps)(Show));
