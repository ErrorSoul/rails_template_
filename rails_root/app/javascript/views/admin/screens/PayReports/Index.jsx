import React from "react";
import MyTable from 'components/customTables/Table';

class Tables extends React.Component {
  render() {
    return (
      <div className="content">
        <MyTable apiUrl='/admin/pay_reports'/>
      </div>
    );
  }
}

export default Tables;
