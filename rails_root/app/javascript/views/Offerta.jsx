import React from "react";
import AppDataManager from 'components/AppDataManager';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Offerta extends React.Component {


	_isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
			isLoading: true,
			body: null
    };

  }

	RenderHTML = (props) => (<div className="col-12"  dangerouslySetInnerHTML={{__html:props.HTML}}></div>);


	fetchOfferta = async ()  => {
    this._isMounted && this.setState({isLoading: true})

    try {
			const {body}  = await AppDataManager.api(`/offerta`);
			this._isMounted && this.setState({body: body});

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
		const {body} = this.state;
    return (
			<div className='row'>
				<div className='col-12'>
					<div className='row'>
						<div className='col-12 p-5 marginTOP'>
							<div className='row'>
								<h1 className='stats-p-30-days'>Офферта</h1>
							</div>
								{ body && <this.RenderHTML HTML={draftToHtml(JSON.parse(body))} /> }
						</div>
					</div>
				</div>
			</div>
    );
  }
}

export default Offerta;
