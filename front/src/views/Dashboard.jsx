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
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
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
import './Dashboard.css'
import {unfold} from '../utils/periodicity'

class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.getUserFromToken = this.getUserFromToken.bind(this)
    this.getExpensesFromToken = this.getExpensesFromToken.bind(this)
    this.calculateCurrentMonthExpenses = this.calculateCurrentMonthExpenses.bind(this)
    this.createDataBarPlot = this.createDataBarPlot.bind(this)
    this.calculateCurrentMonthIncomes = this.calculateCurrentMonthIncomes.bind(this)
    this.getIncomes = this.getIncomes.bind(this)
    this.state = {
      user: {},
      userExpenses: [],
      userIncomes:[],
      monthIncomes: 0,
      monthExpenses: 0,
      token: localStorage.getItem("token-contare"),
      yearTotal: 0,
      lastMonthsNumber: 3
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

  componentDidUpdate(_, prevState) {
    if (prevState.userIncomes != this.state.userIncomes)
      this.calculateCurrentMonthIncomes()
    if (prevState.userExpenses != this.state.userExpenses)
      this.calculateCurrentMonthExpenses()
  }

  updateDashboard() {
    this.getUserFromToken()
    this.getExpensesFromToken()
    this.getIncomes()
    this.render()

    //for testing
  }

  getIncomes = async () => {
    const incomes = await getIncomes()
    this.setState({userIncomes:incomes})
  }

  calculateMonthIncomes(incomes, date) {
    let total = 0
    let monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    let monthEnd = new Date(date.getFullYear(), date.getMonth()+1, 0)

    unfold(incomes, monthStart, monthEnd).map(income => {
      total += income.value
    })

    return total
  }

  calculateMonthExpenses(expenses, date) {
    let total = 0
    let monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    let monthEnd = new Date(date.getFullYear(), date.getMonth()+1, 0)

    if (this.state.user._id) {
      unfold(expenses, monthStart, monthEnd).map(expense => {
        total += expense.participants.find(p => p._id === this.state.user._id).payValue
      })   
    }
    return total
  }

  calculateCurrentMonthExpenses = async () => {
    const currentDate = new Date()
    let total = this.calculateMonthExpenses(this.state.userExpenses, currentDate)

    this.setState({monthExpenses: total})
  }

  createLegendBarPlot = () => {
    const legendBarPlot = {
      names: ["Linha de Ganhos", "Linha de Gastos"],
      types: ["info", "danger"]
    }


    return this.createLegend(legendBarPlot)


  }

  createDataBarPlot(N_MONTHS = this.state.lastMonthsNumber) {
    const incomes = this.state.userIncomes
    const expenses = this.state.userExpenses
    const months = dataBar.labels
    const currentDate = new Date()
    const incomeDataPoints = []
    const expenseDataPoints = []
    const monthDataPoints = []

    for (let i = N_MONTHS - 1; i >= 0; i--) {
      let date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i)
      incomeDataPoints.push(
        this.calculateMonthIncomes(incomes, date)
      )
      expenseDataPoints.push(
        this.calculateMonthExpenses(expenses, date)
      )
      monthDataPoints.push(months[date.getMonth()])
    }

    return {
      labels: monthDataPoints,
      series: [incomeDataPoints, expenseDataPoints]
    }
  }

  createDataPizzaPlot(N_MONTHS = this.state.lastMonthsNumber) {
    const expenses = this.state.userExpenses
    const currentDate = new Date()
    const categories = {}
    let dataPoints = {}

    for (let expense of expenses) {
      let category = expense.category.toLowerCase() || 'outros'

      if (!categories[category]) {
        categories[category] = []
        dataPoints[category] = 0
      }

      categories[category].push(expense)
    }

    for (let i = N_MONTHS - 1; i >= 0; i--) {
      let date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i)
      for (let category of Object.keys(categories)) {
        dataPoints[category] += this.calculateMonthExpenses(categories[category], date)
      }
    }

    for (let category of Object.keys(categories)) {
      if (dataPoints[category] == 0)
        delete dataPoints[category]
    }

    dataPoints = Object.fromEntries(Object.entries(dataPoints).sort())
    return {
      labels: Object.keys(dataPoints),
      series: Object.values(dataPoints)
    }
  }

  getUserFromToken = async () => {

    if(this.state.token == null || this.state.token == undefined) {
      window.location.href = "/login"
    } else {
      const user = await getUser(this.state.token)
      this.setState({user})

      }
  }

  getExpensesFromToken = async() => {
    const expenses =  await getExpenses(this.state.token);
  
    this.setState({userExpenses: expenses})
  }

  calculateCurrentMonthIncomes = async () => {
    const currentDate = new Date()
    let total = this.calculateMonthIncomes(this.state.userIncomes, currentDate)

    this.setState({monthIncomes: total})
  }

  setNLastMonths = (e) => {
    this.setState({lastMonthsNumber:e.target.value})
  }


  render() {
    return (
      <div className="content admin-flex-container-content">
        <ControlLabel>Resumo financeiro do mês</ControlLabel>
        <Grid fluid>
          <Row>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Ganhos"
                statsValue={this.state.monthIncomes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-danger" />}
                statsText="Gastos"
                statsValue={this.state.monthExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-cash text-success" />}
                statsText="Saldo"
                statsValue={(this.state.monthIncomes - this.state.monthExpenses).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />
            </Col>
          </Row>
          <Row>


          <FormGroup controlId="formControlsSelect">
      <ControlLabel>Selecione para visualizar</ControlLabel>
      <FormControl className="inputMonth" onChange={(e) => this.setNLastMonths(e)} componentClass="select" placeholder="select">        <option value="3">Últimos 3 meses</option>
        <option value="6">Últimos 6 meses</option>
        <option value="12">Último ano</option>
      </FormControl>
      </FormGroup>
        
            <Col md={6}>
      
              <Card
                id="chartActivity"
                title="Seus Ganhos x Suas Despesas"
                category="Quanto foi ganho e gasto em cada mês"
                legend={
                  <div className="legend">{this.createLegendBarPlot()}</div>
                }
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={this.createDataBarPlot()}
                      type="Line"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }

              />
            </Col>

            <Col md={6}>

            {/* <FormGroup controlId="formControlsSelect">
      <ControlLabel>Selecione para visualizar</ControlLabel>
      <FormControl  componentClass="select" placeholder="select">
        <option value="3">#TODO SELECT OP</option>
      </FormControl>
      </FormGroup> */}

              <Card
                title="Distribuição de Gastos"
                category="Seus gastos agrupados por categorias"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart"
                  >
                    <ChartistGraph options={{distributeSeries:true}} data={this.createDataPizzaPlot()} type="Bar"/>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
