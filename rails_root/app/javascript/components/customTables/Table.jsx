import React from "react";
import AppDataManager from '../AppDataManager';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
	Spinner,
	Button,
	ButtonGroup
} from "reactstrap";

import {
  withRouter, Link
} from "react-router-dom";

import THead  from "./Header";
import TBody  from "./Body";
import Pagination from "./Pagination";
import history from  "../history";
import queryString from 'query-string';

class MyTable extends React.Component {
	_isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
			isLoading: false,
			headers: [],
			data: [],
			apiUrl: this.props.apiUrl,
			data_count: 0,
			resource_name: ''
    };

  }

	useQuery= () => {
		useParams();
	}


	fetchResources = async (num=undefined) => {
		// if (e && typeof e.preventDefault === "function") {
    //   e.preventDefault();
    // }
		//const { match: { params } } = this.props;
		console.log('PROPS', this.props);
		console.log('WIN', window.location);
		console.log("HISTORY ", history);
		let newNum;
		const values = queryString.parse(history.location.search);

		if (!num) {


			newNum = values.page;
		} else { newNum = num; }

		let { apiUrl } = this.state;

		if (this._isMounted) {
			this.setState({isLoading: true});
		}


    try {
			const {headers, data, data_count, resource_name, total_pages, current_page} = await AppDataManager.api(apiUrl, {parameters: {page: num}});
			this._isMounted && this.setState({data, headers, data_count, resource_name, total_pages, current_page});
			if (!!newNum) {
				//history.replace({pathname: `/admin/${resourse_name}`, search: `page=${newNum}` });
			}
    } catch (e) {
      console.warn(e);
      return;
    } finally {

      if (this._isMounted) {
			this.setState({isLoading: false});
		}
    }
  }

	componentDidMount() {
		this._isMounted = true;
    console.log("start");
		this.fetchResources();
  }

	componentWillUnmount() {
		this._isMounted = false;
    console.log("start");
  }

  render() {
		const isLoad = this.state.isLoading;
    if (isLoad) {
      return  <Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="secondary" />;
    }

		const TableBodyBlock = (props) =>
						<td className='text-right'>
						<ButtonGroup size="sm">
						<Button
               tag={Link} to={`/admin/${props.resource_name}/${props.id}`}
		           //onClick={ () => this.props.history.push(`/admin/${props.resource_name}/${props.id}`) }
		           color='success' outline>
						   Show
						</Button>
						</ButtonGroup>
			</td>

    return(
			<div className="content">

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">{this.state.resource_name}<span>({this.state.data_count})</span></CardTitle>
              </CardHeader>
              <CardBody>

                <Table responsive bordered>
                  <THead headers={this.state.headers} />
									<TBody
										 headers={this.state.headers}
										 data={this.state.data}
										 resource_name={this.state.resource_name}
										 buttonBlock={TableBodyBlock}
									/>
                </Table>
									<div className=''>
										<Pagination

											 current_page={this.state.current_page}
											 total={this.state.data_count}
											 changePage={this.fetchResources}
											 >
										</Pagination>
									</div>
							</CardBody>
			      </Card>
					</Col>
				</Row>
			</div>
    );
  }
}



export default withRouter(MyTable);
