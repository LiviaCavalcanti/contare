import {StatsCard} from 'components/StatsCard/StatsCard.jsx'
import {Grid, Col, FormGroup, FormControl, ControlLabel, Row} from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import {getExpenses} from '../../services/expenseService'
import Expense from './Expense'
import '../../assets/css/custom.css'

export default function ListExpenses(props) {
    const [Expenses, setExpenses] = useState([])
    const [ExpenseModals, setExpenseModals] = useState([])
    const [cachedExpenses, setCachedExpenses] = useState([])
    const [sorting, setSorting] = useState('Data de Criação')

    useEffect(() => {
        if (props.update) {
            props.setUpdate(false)

            getExpenses(localStorage.getItem("token-contare")).then(resp => {
                setCachedExpenses(resp)
                console.log("RESP: ", resp)
            })
        }
    })

    useEffect(() => {
        sortExpenses()
    }, [cachedExpenses, sorting])

    function sortExpenses() {
        console.log(cachedExpenses)
        if (cachedExpenses) {
            if (sorting == 'Data de Criação') setExpenses(cachedExpenses.slice())
            else if (sorting == 'Título') setExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.title.toLowerCase() < inc2.title.toLowerCase()) return -1
                return 1
            }))
            else if (sorting == 'Valor') setExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.value > inc2.value) return -1
                return 1
            }))
            else if (sorting == 'Data de Recebimento') setExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (new Date(inc1.dueDate) > new Date(inc2.dueDate)) return -1
                return 1
            }))
            else if (sorting == 'Tipo de Recorrencia') setExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.periodicity > inc2.periodicity) return -1
                return 1
            }))
        }
    }

    function showModal(i) {
        let expModals = ExpenseModals.slice()
        expModals[i] = true
        setExpenseModals(expModals)
    }

    return (
        <Grid fluid>
            <Row>
                <Col lg={3} sm={4} xs={6}>
                    <FormGroup>
                        <ControlLabel>Ordenar as rendas por</ControlLabel>
                        <FormControl componentClass="select" value={sorting} onChange={val => setSorting(val.target.value)}>
                            <option>Data de Criação</option>
                            <option>Título</option>
                            <option>Categoria</option>
                            <option>Descrição</option>
                            <option>Valor</option>
                            <option>Data de Gasto</option>
                            <option>Tipo de Recorrencia</option>
                        </FormControl>
                    </FormGroup>
                </Col>
            </Row>
            {Expenses.map((expense, i) =>
                <Col lg={4} sm={6} key={expense._id}>
                    <StatsCard bigIcon={<i className="pe-7s-server text-warning" />}
                        statsText={expense.title}
                        statsValue={"R$ " + expense.totalValue}
                        statsIcon={<i className="fa fa-edit clickable" onClick={() => showModal(i)} />}
                        statsIconText={<span className="clickable" onClick={() => showModal(i)}>Editar gasto</span>}
                    />
                    <Expense Expense={expense} i={i} ExpenseModals={ExpenseModals} setExpenseModals={setExpenseModals} setUpdate={props.setUpdate} />
                </Col>
            )}
        </Grid>
    )
}
