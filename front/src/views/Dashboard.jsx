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
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";
import {getUser} from '../services/userService'
import {getExpenses} from '../services/expenseService'
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {getIncomes} from '../services/income'
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";
import { initializeConnection } from 'services/ConnectionService'

class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.getUserFromToken = this.getUserFromToken.bind(this)
    this.getExpensesFromToken = this.getExpensesFromToken.bind(this)
    this.calculateYearExpenses = this.calculateYearExpenses.bind(this)
    this.calculateMonthExpenses = this.calculateMonthExpenses.bind(this)
    this.createDataBarPlot = this.createDataBarPlot.bind(this)
    this.calculateUserRent = this.calculateUserRent.bind(this)
    this.state = {
      user: {},
      userExpenses: [],
      userCurrentRent: 0,
      token: localStorage.getItem("token-contare"),
      yearTotal: 0
    }
    this.socket = initializeConnection();
  }

  componentDidMount() {
    this.socket.on("updateincome", function (user) {
      this.updateDashboard();
    }.bind(this));
    this.socket.on("updateexpense", function (user) {
      this.updateDashboard();
    }.bind(this));
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  componentWillMount() {
    this.updateDashboard()
  }

  updateDashboard() {
    this.getUserFromToken()
    this.getExpensesFromToken()
    this.calculateUserRent()
    this.render()
  }

  calculateYearExpenses = () => {
    let total = 0
    let expenses = this.state.userExpenses
    const currentDate = new Date()


    expenses.map(expense => {
      const expenseDueDate = new Date(expense.dueDate)

      if(expenseDueDate.getFullYear() === currentDate.getFullYear()) {
        total += expense.totalValue
      }
      
    })

    return total
  }

  calculateMonthExpenses = () => {
    let total = 0
    let expenses = this.state.userExpenses
    const currentDate = new Date()


    expenses.map(expense => {
      const expenseDueDate = new Date(expense.dueDate)

      if((expenseDueDate.getFullYear() === currentDate.getFullYear()) && expenseDueDate.getMonth() == currentDate.getMonth()) {
        total += expense.totalValue
      }
      
    })

    return total
  }

  createDataBarPlot = () => {
    let expenses = this.state.userExpenses
    const months = dataBar.labels
    const series = new Array(12).fill(0);
    const currentDate = new Date()
    expenses.map(expense => {
      const expenseDueDate = new Date(expense.dueDate)
      if(expenseDueDate.getFullYear() === currentDate.getFullYear()) {
        series[expenseDueDate.getMonth()] += expense.totalValue
      }
    })

    const data = {
      labels: months,
      series:[series]
    }
    return data
  
  }

  createDataPointPlot = () => {
    let expenses = this.state.userExpenses
    const months = dataBar.labels
    const series = new Array(12).fill(0);
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    let N_MONTHS = 6
    expenses.map(expense => {
      const expenseDueDate = new Date(expense.dueDate)
      if(expenseDueDate.getFullYear() === currentDate.getFullYear()) {
        series[expenseDueDate.getMonth()] += expense.totalValue
      }
    })

    let newMonths = []
    let newSeries = []

    for(let i = currentMonth  ; i >= 0; i--){
      if(N_MONTHS === 0){
        break;
      }
      newMonths.push(months[i])
      newSeries.push(series[i])
      N_MONTHS--;
    }


    const data = {
      labels: newMonths.reverse(),
      series: [newSeries.reverse()]
    }
    return data
  }

  getUserFromToken = async () => {

    if(this.state.token == null || this.state.token == undefined) {
      window.location.href = "/register"
    } else {
      const user = await getUser(this.state.token)
      this.setState({user})

      }
  }

  getExpensesFromToken = async() => {
    const expenses =  await getExpenses(this.state.token);

    this.setState({userExpenses: expenses})
  }

  calculateUserRent = async () => {
    const incomes = await getIncomes()
    const currentDate = new Date()
    let totalIncome = 0

    incomes.map(income => {
      if(income.periodicity === "MONTHLY") {
        const incomeDueDate = new Date(income.receivedOn)
        if(incomeDueDate > currentDate) {
          totalIncome += income.value
        }
      }
    })
  
    this.setState({userCurrentRent: totalIncome})

  }


  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Renda Mensal"
                statsValue={"R$ " + this.state.userCurrentRent}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Atualizado há pouco"
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Gastos deste mês"
                statsValue={"R$ " + this.calculateMonthExpenses()}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Atualizado ontem"
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Gastos deste ano"
                statsValue={"R$ " + this.calculateYearExpenses()}
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="Atualizado ontem"
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText="Amigos"
                statsValue="#TODO"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Atualizado há 13 dias"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Histórico de Gastos"
                category="Últimos 6 meses"
                stats="Atualizado ontem"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={this.createDataPointPlot()}
                      type="Line"
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
              />
            </Col>
            {/* <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Distribuição de Gastos"
                category="Setembro de 2019"
                stats="Atualizado ontem"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={dataPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendPie)}</div>
                }
              />
            </Col> */}

            <Col md={6}>
              <Card
                id="chartActivity"
                title="Total de gastos por mês do último ano"
                category={new Date().getFullYear()}
                stats="Atualizado ontem"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={this.createDataBarPlot()}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }

              />
            </Col>

            {/* <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col> */}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
