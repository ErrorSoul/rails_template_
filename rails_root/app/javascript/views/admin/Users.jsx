import React from "react";
import { Switch, Route } from 'react-router-dom';
import Show from 'views/admin/screens/Users/Show';
import Index from 'views/admin/screens/Users/Index';


class Users extends React.Component {
  render() {
    return (
        <div className="content">
					<Switch>
             <Route exact path='/admin/users' render={props => <Index {...props} />} />

             <Route exact path='/admin/users/:id' render={props => <Show {...props} />} />

					</Switch>
        </div>
    );
  }
}

export default Users;
