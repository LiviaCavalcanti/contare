/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.jsx";
import UserProfile from "views/UserProfile.jsx";
import TableList from "views/TableList.jsx";
// import Typography from "views/Typography.jsx";
import Icons from "views/Icons.jsx";
// import Maps from "views/Maps.jsx";
import Notifications from "views/Notifications.jsx";
import Upgrade from "views/Upgrade.jsx";

// New imports
import Friends from "views/Friends"
import Income from "views/Income"

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Perfil",
    icon: "pe-7s-user",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/friends",
    name: "Amigos",
    icon: "pe-7s-users",
    component: Friends,
    layout: "/admin"
  },
  {
    path: "/income",
    name: "Renda",
    icon: "pe-7s-cash",
    component: Income,
    layout: "/admin"
  },
  {
    path: "/expenses",
    name: "Gastos",
    icon: "pe-7s-wallet",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Relatório",
    icon: "pe-7s-note2",
    component: TableList,
    layout: "/admin"
  },
  // {
  //   path: "/typography",
  //   name: "Tipografia (Dev)",
  //   icon: "pe-7s-news-paper",
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   path: "/icons",
  //   name: "Ícones (Dev)",
  //   icon: "pe-7s-science",
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Mapas (Dev)",
  //   icon: "pe-7s-map-marker",
  //   component: Maps,
  //   layout: "/admin"
  // },
  {
    path: "/notifications",
    name: "Notificações",
    icon: "pe-7s-bell",
    component: Notifications,
    layout: "/admin"
  },
  {
    upgrade: true,
    path: "/upgrade",
    name: "Comprar Premium!",
    icon: "pe-7s-rocket",
    component: Upgrade,
    layout: "/admin"
  }
];

export default dashboardRoutes;
