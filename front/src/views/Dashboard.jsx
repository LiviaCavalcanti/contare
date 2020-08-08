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

class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.getUserFromToken = this.getUserFromToken.bind(this)
    this.getExpensesFromToken = this.getExpensesFromToken.bind(this)
    this.calculateYearExpenses = this.calculateYearExpenses.bind(this)
    this.calculateMonthExpenses = this.calculateMonthExpenses.bind(this)
    this.createDataBarPlot = this.createDataBarPlot.bind(this)
    this.calculateUserRent = this.calculateUserRent.bind(this)
    this.getIncomes = this.getIncomes.bind(this)
    this.state = {
      user: {},
      userExpenses: [],
      userIncomes:[],
      userCurrentRent: 0,
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

  updateDashboard() {
    this.getUserFromToken()
    this.getExpensesFromToken()
    this.getIncomes()
    this.calculateUserRent()
    this.render()

    //for testing
  }

  getIncomes = async () => {
    const incomes = await getIncomes()
    this.setState({userIncomes:incomes})
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

  createLegendBarPlot = () => {
    const legendBarPlot = {
      names: ["Linha de Ganhos", "Linha de Gastos"],
      types: ["danger", "info"]
    }


    return this.createLegend(legendBarPlot)


  }


  createDataBarPlot = (N_MONTHS = this.state.lastMonthsNumber) => {
    let expenses = this.state.userExpenses
    const incomes = this.state.userIncomes
    const months = dataBar.labels
    const series = new Array(12).fill(0);
    const seriesIncome = new Array(12).fill(0);
    const currentDate = new Date()
    expenses.map(expense => {
      const expenseDueDate = new Date(expense.dueDate)
      if(expenseDueDate.getFullYear() === currentDate.getFullYear()) {
        series[expenseDueDate.getMonth()] += expense.totalValue
      }
    })

    incomes.map(income =>{
      const incomeReciveDate = new Date(income.receivedOn)
      if(incomeReciveDate.getFullYear() === currentDate.getFullYear()) {
        seriesIncome[incomeReciveDate.getMonth()] += income.value
      }
    })

    let newMonths = []
    let newSeries = []
    let newSeriesIncomes = []
    const currentMonth = currentDate.getMonth()
    
    for(let i = currentMonth  ; i >= 0; i--){
      if(N_MONTHS === 0){
        break;
      }
      newMonths.push(months[i])
      newSeries.push(series[i])
      newSeriesIncomes.push(seriesIncome[i])
      N_MONTHS--;
    }

    const data = {
      labels: newMonths.reverse(),
      series:[newSeries.reverse(), newSeriesIncomes.reverse()]
    }
    return data
  
  }

  createDataPizzaPlot = () => {
    let expenses = this.state.userExpenses
    let dataObj = {}

    expenses.map(expense => {
      const category = expense.category.toLowerCase()
      if(dataObj[category] == undefined){
        dataObj[category] = 0
        dataObj[category] += expense.totalValue
      } else {
        dataObj[category] += expense.totalValue
      }
    })


    const data = {
      labels:Object.keys(dataObj),
      series: Object.values(dataObj)
    }

    return data
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

  calculateUserRent = async () => {
    const incomes = await getIncomes()
    const currentDate = new Date()
    let totalIncome = 0

    incomes.map(income => {
      let currentIncomeDate = new Date(income.receivedOn)

      if(income.periodicity === "MONTHLY" || currentIncomeDate.getMonth() == currentDate.getMonth()) {
        let canceledDate = new Date(income.canceledOn ? new Date(income.canceledOn) : currentDate)
        
        if(currentDate.getFullYear() < canceledDate.getFullYear() ||
          (currentDate.getFullYear() === canceledDate.getFullYear() && currentDate.getMonth() < canceledDate.getMonth()) ||
          (currentDate.getFullYear() === canceledDate.getFullYear() && currentDate.getMonth() === canceledDate.getMonth() &&
            currentDate.getDate() <= canceledDate.getDate())) {
          totalIncome += income.value
        }    
      }
    })
  
    this.setState({userCurrentRent: totalIncome})

  }

  setNLastMonths = (e) => {
    this.setState({lastMonthsNumber:e.target.value})
  }


  render() {
    return (
      <div className="content admin-flex-container-content">
        <Grid fluid>
          <Row>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Renda Mensal"
                statsValue={"R$ " + this.state.userCurrentRent.toFixed(2)}
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-danger" />}
                statsText="Gastos deste mês"
                statsValue={"R$ " + this.calculateMonthExpenses().toFixed(2)}
              />
            </Col>
            <Col lg={4} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-primary" />}
                statsText="Gastos deste ano"
                statsValue={"R$ " + this.calculateYearExpenses().toFixed(2)}
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
                category={new Date().getFullYear()}
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
                category="Seus gastos agrupados por categoria"
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
