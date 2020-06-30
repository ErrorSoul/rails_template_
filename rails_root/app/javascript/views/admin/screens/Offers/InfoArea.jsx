import React from "react";
import {Button, Badge, Row, Col, Spinner, Label, FormGroup, CustomInput} from 'reactstrap';
import AppDataManager from 'components/AppDataManager';

class InfoArea extends React.Component {
	_isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
			isLoading: false
    };
	}

	handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    //this.setState({ isLoading: true });

    let json;
		const {id, state} = this.props;
    console.log('vvvvvvvvvvvvvvvvvvvv', this.props.payments)


    try {
			const urlM = `/admin/offers/update_state`;

      json = await AppDataManager.api(urlM, { method: 'POST', parameters: { offer: { id, state } }});


    } catch (e) {

      const { errors } = e.json;

      return;
    }

		this.props.updateOfferState(json.offer);
    this.setState({ isLoading: false});

		const notikMessage = (
			<div>
        <p> {`Статус офферты обновлен`}</p>
			</div>
    )
		this.props.notikNotik(notikMessage);
  }

  render() {

		const isLoad = this.state.isLoading;
		if (isLoad) {
			return  (<div className="content"><Row><Col md="12"><Spinner style={{ width: '3.3rem', height: '3.3rem' }} color="secondary" /></Col></Row></div>);
		}

		const color = this.props.state == 'draft' ? 'warning' : 'success';
    const switchChecked = this.props.state == 'active'
    const switchLabel = this.props.state == 'active' ? 'Cкрыть оффер' : 'Опубликовать'
    return (
      <div style={{'backgroundColor': 'white'}} className="mb-2 p-2 info">
				<div className='col-12 mb-2'>
					<h6 className="info-title">Публикация оффера</h6>

          <div className="row">
            <div className="col">
              <FormGroup>
                <Label for="exampleCheckbox">Переключить</Label>
                <div>
                  <CustomInput type="checkbox" checked={switchChecked} onChange={(e) => this.handleSubmit(e)} type="switch" id="exampleCustomSwitch" name="customSwitch" label={switchLabel} />

                </div>
              </FormGroup>
            </div>
          </div>
					<div className="row">
						<div className="col">
							<Button onClick={(e) => this.handleSubmit(e)} color={color}>{this.props.state}</Button>
						</div>
					</div>
					<p>
						Только активные офферы отображаются на сайте. Для публикации необходимо перевести их в режим &nbsp;
						<span className='badge badge-success'> active </span>
					</p>
				</div>
      </div>
    );
  }
}

export default InfoArea;
