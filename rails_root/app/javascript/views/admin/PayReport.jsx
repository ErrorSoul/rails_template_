import React from "react";
import { Switch, Route } from 'react-router-dom';
import Show from 'views/admin/screens/PayReports/Show';
import Index from 'views/admin/screens/PayReports/Index';


class PayReports extends React.Component {
  render() {
    return (
        <div className="content">
					<Switch>
            <Route exact path='/admin/pay_reports' render={props => <Index {...props} />} />
					  <Route exact path='/admin/pay_reports/:id' render={props => <Show {...props} />} />

					</Switch>
        </div>
    );
  }
}

export default PayReports;
