import React from "react";
import MyTable from 'components/customTables/Table';
import  User  from '../../User.jsx';
import AppDataManager from 'components/AppDataManager';
import  CardLave  from './CardLave.jsx';
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


class Edit extends React.Component {
	_isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
			isLoading: false,
			offer: {}
    };
	}

	async fetchOffer() {
    this._isMounted && this.setState({isLoading: true})

    try {
		 const Id = this.props.match.params.id
     const {offer}  = await AppDataManager.api(`/admin/offers/${Id}`)
		 console.log('Offer', offer);
			this._isMounted && this.setState({offer});
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
		this.fetchOffer();
		console.log(this.props.history, ':HISTORY');
		console.log(this.props.match, 'ISTORY');
  }

	componentWillUnmount() {
		this._isMounted = false;
  }

  render() {

		const LeftCart = ({offer}) => {
			return (
				<Row>
					<CardLave
						 title={offer.title}
						 logo={offer.logo}
				  />
				</Row>
				)
		}

    const categoryBadges = () => {
      const {categories} = this.state.offer

      return(
        categories.map((category, num) => {
          return(<span><Badge color='info'>{category}</Badge></span>)
        })
      )
    }


		const RightCraft = (props) => {
			return (
				 <Col md="8">
           <Card className="card-user">
             <CardHeader>
               <CardTitle tag="h5">
                 <span className="float-left">Edit Profile</span>
                 {categoryBadges}

               </CardTitle>
             </CardHeader>
             <CardBody>
						 </CardBody>
				   </Card>
				</Col>
			)
		}




    return (

			<div>
				<h4 className="title">Offer # {this.state.offer.id}</h4>
				<LeftCart offer={this.state.offer} />
				<Row><RightCraft/></Row>
				<User/>
			</div>
		)
	}
}





export default Edit;
