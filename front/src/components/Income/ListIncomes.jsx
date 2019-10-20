import {StatsCard} from 'components/StatsCard/StatsCard.jsx'
import {Grid, Col} from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import {getIncomes} from '../../services/income'
import Income from './Income'
import {daysDiff, weeksDiff, monthsDiff, yearsDiff} from '../../utils/date'
import '../../assets/css/custom.css'

import { initializeConnection } from 'services/ConnectionService';

export default function ListIncomes(props) {
    const [incomes, setIncomes] = useState([])
    const [incomeModals, setIncomeModals] = useState([])

    var socket = initializeConnection();

    socket.on("updateincome", function () {
        props.setUpdate(true);
    }.bind(this))

    useEffect(() => {
        if (props.update) {
            props.setUpdate(false)
            let totalIncome = 0

            getIncomes().then(resp => {
                setIncomes(resp)

                setIncomeModals(resp.map(income => {
                    let receivedDate = new Date(income.receivedOn)
                    let tillDate = new Date()
                    if (income.canceledOn && income.periodicity != 'NONE') {
                        let canceledDate = new Date(income.canceledOn)
                        if (canceledDate < tillDate) tillDate = canceledDate
                    }

                    if (income.value > 0 && receivedDate <= tillDate) {
                        totalIncome += income.value
                        if (income.periodicity == 'DAILY') totalIncome += income.value * daysDiff(receivedDate, tillDate)
                        else if (income.periodicity == 'WEEKLY') totalIncome += income.value * weeksDiff(receivedDate, tillDate)
                        else if (income.periodicity == 'MONTHLY') totalIncome += income.value * monthsDiff(receivedDate, tillDate)
                        else if (income.periodicity == 'ANNUALLY') totalIncome += income.value * yearsDiff(receivedDate, tillDate)
                    }

                    return false
                }))

                props.setTotalIncome(totalIncome)
            })
        }
    })

    function showModal(i) {
        let incModals = incomeModals.slice()
        incModals[i] = true
        setIncomeModals(incModals)
    }

    return (
        <Grid fluid>
            {incomes.map((income, i) =>
                <Col lg={4} sm={6} key={income._id}>
                    <StatsCard bigIcon={<i className="pe-7s-server text-warning" />}
                        statsText={income.title}
                        statsValue={"R$ " + income.value}
                        statsIcon={<i className="fa fa-edit clickable" onClick={() => showModal(i)} />}
                        statsIconText={<span className="clickable" onClick={() => showModal(i)}>Editar renda</span>}
                    />
                    <Income income={income} i={i} incomeModals={incomeModals} setIncomeModals={setIncomeModals} setUpdate={props.setUpdate} />
                </Col>
            )}
        </Grid>
    )
}
