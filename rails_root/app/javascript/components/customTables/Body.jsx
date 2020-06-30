import React from 'react';
import { Badge, Button, ButtonGroup } from "reactstrap";
import { Link } from "react-router-dom";
import fuFormatter from 'components/utils/dateFormatter';

const x = (arr) =>
	arr.map(list => (
          <div key={list.id}>
            <pre>{
              JSON.stringify(list, null, 2)
            }</pre>
          </div>
        ));

const Items = ({item, headers}) =>
	headers.map((head, ind) => {
		if (head == 'payments') {

			return (<td key={ind}>{x(item[head])}</td>);

		} else if(head == 'offer_id') {
			return (
        <td key={ind}>
          <Link to={`/admin/offers/${item[head]}`}>{item[head]}</Link>
      </td>
    );

		} else if(head == 'pay_report_id') {
			return (
        <td key={ind}>
          <Link to={`/admin/pay_reports/${item[head]}`}>{item[head]}</Link>
      </td>
    );

		} else if(head == 'user_id') {
			return (
        <td key={ind}>
          <Link to={`/admin/users/${item[head]}`}>{item[head]}</Link>
      </td>
    );

		} else if (head == 'logo') {
			return(
				<td key={ind}>
				<div className="table-photo-img">

				<img

					 alt="..."
					 className="custom-img img-responsive"
					 src={item[head]}
					 />
				</div>
				</td>
			)} else if(head == 'categories'){
				return (
					<td key={ind}>
						<Badge color="info">{item[head]}</Badge>
					</td>
				)
			} else if(head == 'created_at' || head == 'date'){
        const formatDate = fuFormatter(item[head]);
				return (
					<td key={ind}>
					  { formatDate }
					</td>
				)
			} else if(head == 'state'){
				const color = item[head] == 'draft' ? 'warning' : 'success';
				return (
					<td key={ind}>
						<Badge color={color}>{item[head]}</Badge>
					</td>
				)
			} else if(head == 'status_text'){
        const colorHash = { '1': 'success', '2': 'info', '3': 'warning', '5': 'primary' };
				const color = colorHash[item['status']];
				return (
					<td key={ind}>
						<Badge color={color}>{item[head]}</Badge>
					</td>
				)
			} else if(head == 'log_type'){
        const colorHash = { 'create': 'success', 'update': 'info', 'duplicate': 'danger' };
				const color = colorHash[item[head]];
				return (
					<td key={ind}>
						<Badge color={color}>{item[head]}</Badge>
					</td>
				)
			}
		else {return (<td key={ind}>{item[head] }</td>)}
		})




const BodyBlock = ({item, headers, resource_name, buttonBlock}) => {
	const  TableBodyBlock = buttonBlock;
  return (
		<tr>
			<Items item={item} headers={headers}/>
			<TableBodyBlock id={item.id} resource_name={resource_name}/>
		</tr>
	)
}



const Body = ({data, headers, resource_name, buttonBlock}) => {
	//const BodyBlock = x;
	const mapTo = (data, headers) =>
	data.map((item, ind) =>
	  (<BodyBlock key={ind} item={item} headers={headers} resource_name={resource_name} buttonBlock={buttonBlock}></BodyBlock>)
	)

	console.log('body data', mapTo(data));

	return (
		<tbody className='text'>
			{mapTo(data, headers)}
		</tbody>
	)
}


export default Body;
