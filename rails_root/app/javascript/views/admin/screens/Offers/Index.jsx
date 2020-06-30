import React from "react";

import MyTable from 'components/customTables/Table';

class Index extends React.Component {
  render() {
    return (
			<MyTable {...this.props}  apiUrl='/admin/offers'/>
		)
	}
}

export default Index;
