import React from "react";
import { Switch, Route } from 'react-router-dom';
import Index from 'views/admin/screens/Offers/Index';
import Show from 'views/admin/screens/Offers/Show';
import Edit from 'views/admin/screens/Offers/Edit';



class  Offers extends React.Component {
  render() {
    return (
        <div className="content">
					<Switch>
						<Route exact path='/admin/offers' render={props => <Index {...props} />} />
							<Route exact path='/admin/offers/:id' render={props => <Show {...props} />} />
						<Route exact path='/admin/offers/:id/edit' render={props => <Edit {...props} />} />
					</Switch>
        </div>
    );
  }
}

export default Offers;
