import React, {Component} from 'react'
import {Container, Col, Row, Alert} from 'react-bootstrap'
import './alertExpensesComponent.css'
import TiCalendarOutline from 'react-icons/lib/ti/calendar-outline'
import MdAccountBalanceWallet from 'react-icons/lib/md/account-balance-wallet'


class AlertExpenses extends Component {
    constructor(props) {
        super(props)

        this.getTimeDifference = this.getTimeDifference.bind(this)
        this.checkisPayed = this.checkisPayed.bind(this)
    }

    getTimeDifference = (expenseDate) => {
        let date1 = new Date(expenseDate)
        let date2 = new Date()
        const diffTime = date1.getTime() - date2.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return (diffDays )
    }

    checkisPayed = (participants) => {
        console.log(participants)
        let isPayed = false
        participants.map(participant => {
            if(participant._id == this.props.user._id && participant.status == true){
                isPayed = true
            }
        })

        return isPayed
    }

    render() {
        return (
            <div >
    <h3 id="weekTitle"> Vencem essa semana</h3>

<Container style={{height:'37vh', overflow:'auto'}} className="rightContainer">
  <Row >
    <Col>
    {this.props.list.map(expense =>(
        expense.title && // verificando se nao eh o token de add despesa na lista
        !this.checkisPayed(expense.participants) &&
        this.getTimeDifference(expense.dueDate) >= 0 && this.getTimeDifference(expense.dueDate) <= 7  &&
            <Alert variant='warning'>
            <MdAccountBalanceWallet/> Despesa: {expense.title} <br/>

                {this.getTimeDifference(expense.dueDate) == 0 ?
                    <div><TiCalendarOutline/> Vence <b>Hoje!</b></div>
                    :
                    <div><TiCalendarOutline/> Vence em <b>{this.getTimeDifference(expense.dueDate)}</b> dias</div>
            
            }

          </Alert>
    ))}

    </Col>

  </Row>
</Container>
<h3 style={{marginTop:'10%'}} id="weekTitle">Vencidas</h3>

<Container style={{height:'37vh', overflow:'auto'}} className="rightContainer">
  <Row>
    <Col>
    {this.props.list.map(expense =>(
    
    
        expense.title && // verificando se nao eh o token de add despesa na lista
         !this.checkisPayed(expense.participants) &&
        this.getTimeDifference(expense.dueDate) < 0 &&
            <Alert variant='danger'>
            <MdAccountBalanceWallet/> Despesa: {expense.title} <br/>
               <TiCalendarOutline/> Vencida a {Math.abs(this.getTimeDifference(expense.dueDate))} dias
          </Alert>
    ))}
    </Col>

  </Row>
</Container>


            </div>
        )
    }
}

export default AlertExpenses