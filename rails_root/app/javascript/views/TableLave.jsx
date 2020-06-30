import React from "react";
import { Table } from "reactstrap";
import dateFormatter from 'components/utils/statDateFormatter.jsx';

const TableLave = (props) => {

  const resourceParams = () => {
    const { reportList } = props;
    const currencyType = (currency) => {
      let money_hash = {
        '$': '$',
        'euro': '€',
        'rub': '₽'
      }
      return money_hash[currency];
    }

    return reportList.map((item, index) => {
      console.log('Item', item);
      return (
        <tr className='' key={index}>
          <td className="">{dateFormatter(item.date)}</td>
          <td className="">{item.offer_id}</td>
          <td className="Underline" ><div className="Underline text-truncate" style={{width: "90%"}}>{item.offer.title}</div></td>
          <td className="text-right">{item.payout}&nbsp;{currencyType(item.currency)}</td>
          <td className="text-right">{item.status == 1 ? item.payout : 0 }&nbsp;{currencyType(item.currency)}</td>
          <td className="text-right">{item.status == 2 ? item.payout : 0 }&nbsp;{currencyType(item.currency)}</td>
        </tr>
      );
    });
  };

  return (
    <Table responsive borderless hover>
      <thead className="withShadow">
        <tr className="">
          <th style={{width: "14%"}} className="table-TH">Дата</th>
          <th style={{width: "10%"}} className="table-TH">ID</th>
          <th style={{width: "30%"}} className="table-TH">Лот</th>
          <th style={{width: "16%"}} className="text-right table-TH">Все</th>
          <th style={{width: "16%"}} className="text-right table-TH">Принято</th>
          <th  className="text-right table-TH">В обработке</th>
        </tr>
      </thead>
      <tbody className="Offers">
        { resourceParams() }
      </tbody>

    </Table>
  );
};

export default TableLave;
