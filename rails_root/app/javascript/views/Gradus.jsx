import React from 'react';
import { Row} from 'reactstrap';

const Gradus = (props) => {
  const CurrencyGradus = (props) => {
    return(
      <div className='col-12 mb-2'>
	      <Row className=''>
		      <div className='col-12 col-md-5 lou-padding'>
		        <div className='row p-1 left-gradusnik no-gutters align-items-center justify-content-between'>
		          <div className='col-6'>
		            <p className='p-gradusnik-text'><span className='pull-left badge badge-pill badge-primary'><i className={props.currencyClassName}/></span>Начислено</p>
		          </div>
		          <div className='col-6 pull-right'>
		            <div className='text-right'>
			            <p className='p-gradusnik-number'>{props.win_money[props.currency] || 0}</p>
		            </div>
		          </div>
		        </div>
		      </div>

		      <div className='col-12 col-md-4 nou-padding'>
		        <div className='row p-1 center-gradusnik no-gutters align-items-center justify-content-between'>
		          <div className='col-6'>
		            <p className='p-gradusnik-text'>В ожидании</p>
		          </div>
		          <div className='col-6 pull-right'>
		            <div className='text-right'>
			            <p className='p-gradusnik-number'>{props.progress_money[props.currency] || 0}</p>
		            </div>
		          </div>
		        </div>
		      </div>

		      <div className='col-12 col-md-3 rou-padding'>
		        <div className='row p-1 no-gutters right-gradusnik  align-items-center justify-content-between'>
		          <div className='col-6'>
		            <p className='p-gradusnik-text'>Выплата</p>
		          </div>
		          <div className='col-6 pull-right'>
		            <div className='text-right'>
			            <p className='p-gradusnik-number'>{props.paid_money[props.currency] || 0}</p>
		            </div>
		          </div>
		        </div>
		      </div>

	      </Row>
	    </div>
    )
  }

  return (

	    <div className='col-12'>
	      <div className='row no-gutters justify-content-left'>
	        <div className='col-12 mb-2'>
	          <p className='stats-p-30-days'>История </p>
	        </div>

	        <CurrencyGradus currency={'rub'} currencyClassName="fas fa-ruble-sign fa" {...props}/>
          <CurrencyGradus currency={'$'} currencyClassName="fas fa-dollar-sign fa" {...props}/>
	      </div>
	    </div>
    )
};

export default Gradus;
//<div className='col-1'><i className={props.currencyClassName}/></div>
