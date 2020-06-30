import React from "react";
import AppDataManager from 'components/AppDataManager';
// reactstrap components
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
} from "reactstrap";

import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import Offertum from 'components/Offertum';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { notikNotik } from 'store/notifications/actions';

class Offerta extends React.Component {
_isMounted = false;

  constructor(props) {
	 super(props);
    this.state = {
			isLoading: true,
			body: EditorState.createEmpty(),
		};
	}


	draftChange = (editorState) => {
		this.setState({body: editorState});
	}

	descToDraft = (desc) => {
		if (desc == null) {
			return null;
		}
		const contentBlock = convertFromRaw(JSON.parse(desc));
    if (contentBlock) {
      //const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentBlock);
      return editorState;

    } else {
			return EditorState.createEmpty();
		}
	}


	handleSubmit = async (e) => {
     if (e && typeof e.preventDefault === 'function') {
       e.preventDefault();
     }
     this.setState({ isLoading: true });
		 const body = convertToRaw(this.state.body.getCurrentContent());
     let json;
     try {
			 const urlM = `/admin/offerta`;

       json = await AppDataManager.api(urlM, { method: 'POST', parameters: { offerta: { body } }});


     } catch (e) {

       const { errors } = e.json;

       return;
     }


     this.setState({ isLoading: false});

		 const notikMessage = (
			 <div className="mb-2">
        <p> {`Офферта успешно обновлена`}</p>
			 </div>
      )
		 this.props.notikNotik(notikMessage);
   }


	fetchOfferta = async ()  => {
    this._isMounted && this.setState({isLoading: true})

    try {
			const {body}  = await AppDataManager.api(`/admin/offerta`);
			const updOfferta = this.descToDraft(body);
			this._isMounted && this.setState({body: updOfferta});

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

		this.fetchOfferta();
  }

	componentWillUnmount() {
		this._isMounted = false;
  }

  render() {
		  const isLoad = this.state.isLoading;
				if (isLoad) {
					return  (<div className="content"><Row><Col md="12"><Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="secondary" /></Col></Row></div>);
				}

      return(
			<div className="content">

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Офферта</CardTitle>
              </CardHeader>
              <CardBody>

								<Offertum editorState={this.state.body} draftChange={this.draftChange}/>
							</CardBody>
			      </Card>
					</Col>
					<Col md='12'>
						<Button onClick={(e) => this.handleSubmit(e)} color='danger'>Coхранить</Button>
					</Col>
				</Row>
			</div>
    );
  }
}

const mapDispatchToProps = {
	notikNotik,
};
export default withRouter(connect(null, mapDispatchToProps)(Offerta));
