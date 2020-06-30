// import React from 'react';
// import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

// const PaginationTable = (props) => {
// 	const pages = Array(props.total_pages || 0).fill().map((_, i) => i + 1);
//   return (
//     <Pagination size="lg" aria-label="Page navigation example">

// 			{pages.map((num, ind) =>
// 								( <PaginationItem key={ind} onClick={(e) => props.changePage(e, num)}>
// 									<PaginationLink   href='#'>
// 												 {num}
// 										</PaginationLink>
// 									 </PaginationItem>))}
//     </Pagination>
//   );
// }

// export default PaginationTable;


import React from 'react';
import ReactDOM from 'react-dom';
import Pagination from 'rc-pagination';


class PaginationTable extends React.Component {
  // state = {
  //   current: this.props.current_page,
  // };
  onChange = (page) => {
    console.log(page);

    // this.setState({
    //   current: page,
    // });
		this.props.changePage(page);
  }
  render() {
    return <Pagination onChange={this.onChange} defaultPageSize={25} current={this.props.current_page} total={this.props.total} />;
  }
}


export default PaginationTable;
