import React from "react";
import MyTable from '../../components/customTables/Table';

class Tables extends React.Component {
  render() {
    return (
      <div className="content">
        <MyTable apiUrl='/admin/users'/>
      </div>
    );
  }
}

export default Tables;
