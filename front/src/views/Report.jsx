import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";
import StatsCard from "components/StatsCard/StatsCard";
import {getExpenses} from "../services/expenseService"
import {getIncomes} from "../services/income"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pdfImg from '../images/pdf.png'
import './Report.css'
import 'jspdf-autotable'
import { unfold } from '../utils/periodicity'

import { getUser } from "services/userService";


class Friends extends Component {

  constructor(props) {
    super(props)
    this.loadUserExpenses = this.loadUserExpenses.bind(this)
    this.loadUserIncomes = this.loadUserIncomes.bind(this)
    this.createDataTable = this.createDataTable.bind(this)
    this.createTitleTable = this.createTitleTable.bind(this)
    this.formatData = this.formatData.bind(this)
    this.printDocument = this.printDocument.bind(this)
    this.getUserFromToken = this.getUserFromToken.bind(this)
    this.state = {
      userExpenses:[],
      userIncomes:[],
      user:{}
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

  formatData = (data) => {
    data.map(elem => {
      const newDate = new Date(elem[1])
      const day = newDate.getUTCDate()
      const month = newDate.getMonth() + 1
      const year = newDate.getFullYear()
      const toStringDate = (day < 10 ? "0" : "") + day + "/" + month + "/" + year
      elem[1] = toStringDate
    })

    return data
  }

  getUserFromToken = async () =>{
    const user = await getUser(localStorage.getItem("token-contare"))
    this.setState({user})
  }


  createDataTable = () => {
    const expenses = unfold(this.state.userExpenses)
    const incomes = unfold(this.state.userIncomes)
    let currentExpensePaid = {}
    let data = []

    expenses.forEach(expense => {
      if (expense.participants) {
        currentExpensePaid = expense.participants.filter(p=>p._id===this.state.user._id)[0].payValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      } else {
        currentExpensePaid = expense.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      }
      data.push([expense.seq ? expense.title + " #" + expense.seq : expense.title, expense.dueDateAdjusted, "Gasto", "-" + currentExpensePaid ])
    })

    incomes.map(income => {
      data.push([income.seq ? income.title + " #" + income.seq : income.title,  income.receivedOnAdjusted, "Renda", "+" + income.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })])
    })
    
    data = this.formatData(data)

    return data.reverse()
  }


  createTitleTable = () => {
    const thArray = ["Título", "Data", "Tipo", "Valor"];

    return thArray
  } 
  componentWillMount() {
    this.getUserFromToken();
    this.loadUserExpenses()
    this.loadUserIncomes()
  }

  printDocument() {
    const table = document.getElementById('report-table');
    let doc = new jsPDF('1', 'pt', 'letter', true)
    doc.text("Relatório detalhado Contare", doc.internal.pageSize.getWidth()/2, 30, { align: "center" })
    doc.setFontSize(10)
    doc.autoTable({ html: '#report-table', theme: 'grid' })
    doc.save('extrato.pdf')
  }

  render() {
    return (

      <div className="content admin-flex-container-content">
        <Grid fluid>
          <Row>
            <Col id="divtoprint"  md={12}>
              <Card
                title={"Relatório Detalhado"}
                category="Confira sua relação de gastos e ganhos"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover id="report-table">
                    <thead>
                      <tr>
                        {this.createTitleTable().map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(this.state.user).length > 0 ? this.createDataTable().map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              if(prop[0] === "+"){
                                return <td style={{color:"green"}} key={key}>{prop}</td>;
                              } else if(prop[0] === "-") {
                                return <td style={{color:"red"}} key={key}>{prop}</td>;
                              } else {
                                return <td  key={key}>{prop}</td>;
                              }
                            })}
                          </tr>
                        );
                      }) : ""}
                    </tbody>
                  </Table>
                  
                }
                
              />
              
            </Col>

          
          </Row>

          <img className="pdfImage" src={pdfImg}></img>
          <a style={{color:"black"}}>Deseja exportar seu extrato como pdf?</a> <b id="clickDownload" onClick={this.printDocument}>Clique aqui</b>

        </Grid>
      </div>
    );
  }
}

export default Friends;
