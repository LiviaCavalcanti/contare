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
import { getUser } from "services/userService";


class Friends extends Component {

  constructor(props) {
    super(props)
    this.loadUserExpenses = this.loadUserExpenses.bind(this)
    this.loadUserIncomes = this.loadUserIncomes.bind(this)
    this.createDataTable = this.createDataTable.bind(this)
    this.createTitleTable = this.createTitleTable.bind(this)
    this.formatData = this.formatData.bind(this)
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
      const day = newDate.getUTCDate() - 1
      const month = newDate.getMonth() + 1
      const year = newDate.getFullYear()
      const toStringDate = (day < 10 ? "0" : "") + day + "/" + month + "/" + year
      elem[1] = toStringDate
    })

    return data
  }

  getUserFromToken= async () =>{
    const user = await getUser(localStorage.getItem("token-contare"))
    this.setState({user})
  }

  createDataTable = () => {
    this.getUserFromToken();
    const expenses = this.state.userExpenses
    const incomes = this.state.userIncomes
    let data = []
   expenses.map(expense => {
      data.push([expense.title, expense.dueDate, "Gasto", "-" + expense.participants.find(p=>p._id===this.state.user._id).payValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })])
   })

   incomes.map(income => {
    data.push([income.title,  income.receivedOn, "Renda", "+" + income.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })])
   })

    data.sort(function(a, b) {
      a = new Date(a[1]);
      b = new Date(b[1]);
      return a>b ? -1 : a<b ? 1 : 0;
  })

    data = this.formatData(data)

    return data.reverse()
  }


  createTitleTable = () => {
    const thArray = ["Título", "Data", "Tipo", "Valor"];

    return thArray
  } 
  componentWillMount() {
    this.loadUserExpenses()
    this.loadUserIncomes()
  }

  printDocument() {
    const input = document.getElementById('divtoprint');
    console.log("aaa")
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG',0, 0, 220, 160);
        pdf.save("extrato.pdf");
      })
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
                      })}
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
