import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";
import StatsCard from "components/StatsCard/StatsCard";
import {getExpenses} from "../services/expenseService"
import {getIncomes} from "../services/income"

class Friends extends Component {

  constructor(props) {
    super(props)
    this.loadUserExpenses = this.loadUserExpenses.bind(this)
    this.loadUserIncomes = this.loadUserIncomes.bind(this)
    this.createDataTable = this.createDataTable.bind(this)
    this.createTitleTable = this.createTitleTable.bind(this)
    this.state = {
      userExpenses:[],
      userIncomes:[]
    }
  }

  loadUserExpenses = async () => {
    const token = localStorage.getItem("token-contare")
    const expenses =  await getExpenses(token);
  
    this.setState({userExpenses: expenses})
  }

  loadUserIncomes = async () => {
    const incomes = await getIncomes()
    
    this.setState({userIncomes:incomes})
  }

  createDataTable = () => {

    const expenses = this.state.userExpenses
    const incomes = this.state.userIncomes
    const data = []
   expenses.map(expense => {
     //const expenseDate = new Date(expense.dueDate).toString()
      data.push([expense.title, expense.description, expense.dueDate, "-" + expense.totalValue])
   })

   console.log(incomes)
   incomes.map(income => {
    data.push([income.title, income.description, income.receivedOn, "+" + income.value])
   })

    data.sort(function(a, b) {
      a = new Date(a[2]);
      b = new Date(b[2]);
      return a>b ? -1 : a<b ? 1 : 0;
  })

  data.map(elem => {
    const newDate = new Date(elem[2]).toString()
    elem[2] = newDate
  })
    return data
  }

  createTitleTable = () => {
    const thArray = ["Título", "Descrição", "Data", "Valor"];

    return thArray
  } 
  componentWillMount() {
    this.loadUserExpenses()
    this.loadUserIncomes()
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
 <Col md={12}>
              <Card
                title="Relatório Detalhado"
                category="Confira sua relação de gastos e ganhos"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {this.createTitleTable().map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.createDataTable().map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>

          
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Friends;
