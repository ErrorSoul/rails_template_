import React from "react";
import { Switch, Route } from 'react-router-dom';
import Show from 'views/admin/screens/PayLogs/Show';
import Index from 'views/admin/screens/PayLogs/Index';


class  PayLogs extends React.Component {
  render() {
    return (
        <div className="content">
					<Switch>
            <Route exact path='/admin/pay_logs' render={props => <Index {...props} />} />
            <Route exact path='/admin/pay_logs/:id' render={props => <Show {...props} />} />
					</Switch>
        </div>
    );
  }
}

export default PayLogs;
