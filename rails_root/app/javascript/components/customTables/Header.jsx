import React from 'react';

const mapTo = (arr) =>
  arr.map((head, ind) =>
	  (<th key={ind}>{head}</th>)
	)




const Header = ({headers}) => {

	return (

		<thead className='text-info'>
			<tr>
				{mapTo(headers)}
				<th className="text-center">Actions</th>
			</tr>
		</thead>
	)
}


export default Header;
