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
import Dashboard from "views/Dashboard.jsx";
import Notifications from "views/Notifications.jsx";
import Icons from "views/Icons.jsx";
import Typography from "views/Typography.jsx";
import UserPage from "views/User.jsx";
import Offers from "views/Offers.jsx";
import TableOrders from "views/TableOrders.jsx";
import Offerta from "views/Offerta.jsx";
import Another from "views/Another.jsx";
import PasswordReset from "views/PasswordReset.jsx";
import MainLogin from "views/MainLogin.jsx";
// import UpgradeToPro from "views/Upgrade.jsx";

var routes = [
  {
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-bank",
    component: MainLogin,
    layout: "/main"
  },

  {
    path: "/dashboard",
    name: "Lave",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/main"
  },

	{
    path: "/offerta",
    name: "Offerta",
    icon: "nc-icon nc-paper",
    component: Offerta,
    layout: "/main"
  },

  {
    path: "/reset_password/:token",
    name: "Password Reset",
    icon: "nc-icon nc-paper",
    component: PasswordReset,
    layout: "/main"
  },

  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: Icons,
    layout: "/main"
  },

  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/main"
  },

  {
    path: "/profile",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage,
    layout: "/main"
  },


  {
    path: "/another",
    name: "Table List",
    icon: "nc-icon nc-tile-56",
    component: Another,
    layout: "/main"
  },


  {
    path: "/orders",
    name: "Cashback",
    icon: "nc-icon nc-bank",
    component: TableOrders,
    layout: "/main"
  },

  {
    path: "/offers",
    name: "Lave",
    icon: "nc-icon nc-bank",
    component: Offers,
    layout: "/main"
  },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "nc-icon nc-caps-small",
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   pro: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "nc-icon nc-spaceship",
  //   component: UpgradeToPro,
  //   layout: "/admin"
  // }
];
export default routes;
