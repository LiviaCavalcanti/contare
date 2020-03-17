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
import Notifications from "views/Notifications.jsx";

// New imports
import Friends from "views/Friends";
import Income from "views/Income";
import Expenses from "views/Expenses";
import Report from "views/Report";
import LoginScreen from "components/loginComponent/loginComponent";
import RegisterScreen from "components/registerComponent/registerComponent";
import Homepage from "components/Homepage/Homepage";

//Imports contare antigo
import dashboardComponent from "views/dasboardComponent/dashboardComponent";

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
    component: Expenses,
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
    path: "/table",
    name: "Relatório",
    icon: "pe-7s-note2",
    component: Report,
    layout: "/admin"
  }
];

const loginRoute = [{
  path: "/login",
  name: "Login",
  icon: "pe-7s-user",
  component: LoginScreen,
  layout: ""
}];

const registerRoute = [{
  path: "/register",
  name: "Register",
  icon: "pe-7s-user",
  component: RegisterScreen,
  layout: ""
}];

const homepageRoute = [{
  path: "/",
  name: "Homepage",
  icon: "pe-7s-user",
  component: Homepage,
  layout: ""
}];

export {
  dashboardRoutes,
  loginRoute,
  registerRoute,
  homepageRoute
};


