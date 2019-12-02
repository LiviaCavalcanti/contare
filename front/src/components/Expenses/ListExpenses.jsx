import {StatsCard} from 'components/StatsCard/StatsCard.jsx'
import {Grid, Col, FormGroup, FormControl, ControlLabel, Row} from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import {getExpenses} from '../../services/expenseService'
import {daysDiff, weeksDiff, monthsDiff, yearsDiff} from '../../utils/date'
import ExpenseModal from './ExpenseModal'
import '../../assets/css/custom.css'
import { initializeConnection } from 'services/ConnectionService'

var token = localStorage.getItem("token-contare")
var socket

export default function ListExpenses(props) {
    const [Expenses, setExpenses] = useState([])
    const [ExpenseModals, setExpenseModals] = useState([])
    const [cachedExpenses, setCachedExpenses] = useState([])
    const [sorting, setSorting] = useState('Data do Gasto')
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        if (initializing) {
            socket = initializeConnection()
            socket.on("updateexpense", () => {
                props.setUpdate(true)
            })
            setInitializing(false)   
        }
    }, [initializing])

    useEffect(() => {
        if (props.update) {
            props.setUpdate(false)
            let totalExpense = 0

            getExpenses(token).then(resp => {
                setCachedExpenses(resp)
                
                setExpenseModals(resp.map(expense => {
                    let dueDate = new Date(expense.dueDate)
                    let endDate = new Date(expense.endDate)

                    if (expense.totalValue > 0 && dueDate <= endDate) {
                        totalExpense += expense.totalValue
                        if (expense.periodicity === 'DAILY') totalExpense += expense.totalValue * daysDiff(dueDate, endDate)
                        else if (expense.periodicity === 'WEEKLY') totalExpense += expense.totalValue * weeksDiff(dueDate, endDate)
                        else if (expense.periodicity === 'MONTHLY') totalExpense += expense.totalValue * monthsDiff(dueDate, endDate)
                        else if (expense.periodicity === 'ANNUALLY') totalExpense += expense.totalValue * yearsDiff(dueDate, endDate)
                    }

                    return false
                }))

                props.setTotalExpense(totalExpense)
            })
        }
    })

    useEffect(() => {
        sortExpenses()
    }, [cachedExpenses, sorting])

    function sortExpenses() {
        if (cachedExpenses) {
            if (sorting === 'Título') setExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.title.toLowerCase() < inc2.title.toLowerCase()) return -1
                return 1
            }))
            else if (sorting === 'Valor') setExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.totalValue > inc2.totalValue) return -1
                return 1
            }))
            else if (sorting === 'Data do Gasto') setExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (new Date(inc1.dueDate) > new Date(inc2.dueDate)) return -1
                return 1
            }))
            else if (sorting === 'Tipo de Recorrencia') setExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.periodicity > inc2.periodicity) return -1
                return 1
            }))
            else if (sorting === 'Categoria') setExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.category > inc2.category) return -1
                return 1
            }))
            else if (sorting === 'Descrição') setExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.description > inc2.description) return -1
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
                        <ControlLabel>Ordenar os gastos por</ControlLabel>
                        <FormControl componentClass="select" value={sorting} onChange={val => setSorting(val.target.value)}>
                            <option>Título</option>
                            <option>Categoria</option>
                            <option>Descrição</option>
                            <option>Valor</option>
                            <option>Data do Gasto</option>
                            <option>Tipo de Recorrencia</option>
                        </FormControl>
                    </FormGroup>
                </Col>
            </Row>
            {Expenses.map((expense, i) =>
                <Col lg={4} sm={6} key={expense._id}>
                    <StatsCard bigIcon={<i className="pe-7s-wallet text-danger" />}
                        statsText={expense.title}
                        statsValue={"R$ " + expense.totalValue}
                        statsIcon={<i className="fa fa-edit clickable" onClick={() => showModal(i)} />}
                        statsIconText={<span className="clickable" onClick={() => showModal(i)}>Editar gasto</span>}
                    />
                    <ExpenseModal expense={expense} i={i} ExpenseModals={ExpenseModals} setExpenseModals={setExpenseModals} setUpdate={props.setUpdate} />
                </Col>
            )}
        </Grid>
    )
}
