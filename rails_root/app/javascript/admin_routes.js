/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/admin/Dashboard.jsx";
import Icons from "views/admin/Icons.jsx";
import Users from "views/admin/Users.jsx"
import Offers from "views/admin/Offers.jsx";
import UserPage from "views/admin/User.jsx";
import Offerta from "views/admin/Offerta.jsx";
import PayReport from 'views/admin/PayReport.jsx';
import PayLog from 'views/admin/PayLog.jsx';
import SMS from 'views/admin/SMS.jsx';



var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: Icons,
    layout: "/admin"
  },

  {
    path: "/pay_reports",
    name: "Pay reports",
    icon: "nc-icon nc-money-coins",
    component: PayReport,
    layout: "/admin"
  },

  {
    path: "/pay_logs",
    name: "Pay Logs",
    icon: "nc-icon nc-sound-wave",
    component: PayLog,
    layout: "/admin"
  },

  {
    path: "/users",
    name: "Users",
    icon: "nc-icon nc-single-02",
    component: Users,
    layout: "/admin"
  },
  {
    path: "/offers",
    name: "Offers",
    icon: "nc-icon nc-tile-56",
    component: Offers,
    layout: "/admin"
  },

	 {
    path: "/profile",
    name: "Profile",
    icon: "nc-icon nc-badge",
    component: UserPage,
    layout: "/admin"
  },


	{
    path: "/offerta",
    name: "Offerta",
    icon: "nc-icon nc-paper",
    component: Offerta,
    layout: "/admin"
  },

  {
    path: "/sms",
    name: "SMS",
    icon: "nc-icon nc-chat-33",
    component: SMS,
    layout: "/admin"
  },

];
export default routes;
