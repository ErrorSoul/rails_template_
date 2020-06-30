import React from 'react';
import { Table } from 'reactstrap';

const CurrencyTable = (props) => {
  return (
    <Table className='table-currency' borderless>
      <thead>
        <tr>
          <th className="table-TH">Валюта</th>
          <th className="table-TH text-right">Начислено</th>
          <th className="table-TH text-right">В ожидании</th>
          <th className="table-TH text-right">Выплата</th>
        </tr>
      </thead>
      <tbody>
        <tr className="rub-color currency-tr">
          <td>RUB</td>
          <td className="table-TH text-right">{props.win_money['rub'] || 0} ₽</td>
          <td className="table-TH text-right">{props.progress_money['rub'] || 0} ₽</td>
          <td className="table-TH text-right">{props.paid_money['rub'] || 0} ₽</td>
        </tr>
        <tr className="usd-color currency-tr">
          <td>USD</td>
          <td className="table-TH text-right">{props.win_money['$'] || 0} $</td>
          <td className="table-TH text-right">{props.progress_money['$'] || 0} $</td>
          <td className="table-TH text-right">{props.paid_money['$'] || 0} $</td>
        </tr>
        <tr className="eur-color currency-tr">
          <td>EUR</td>
          <td className="text-right">{props.win_money['euro'] || 0} €</td>
          <td className="text-right">{props.progress_money['euro'] || 0} €</td>
          <td className="text-right">{props.paid_money['euro'] || 0} €</td>
        </tr>
      </tbody>
    </Table>
  );
}


const MainCurrencyBlock = (props) => {
   return (

	    <div className='col-12'>
	      <div className='row no-gutters justify-content-left'>
	        <div className='col-12 mb-2'>
	          <p className='stats-p-30-days'>История </p>
	        </div>

	        <CurrencyTable {...props} />
	      </div>
	    </div>
    )
}

export default MainCurrencyBlock;
