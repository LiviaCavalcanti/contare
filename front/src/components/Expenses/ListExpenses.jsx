import {StatsCard} from 'components/StatsCard/StatsCard.jsx'
import {Grid, Col, FormGroup, FormControl, ControlLabel, Row, Pager} from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import {getExpenses} from '../../services/expenseService'
import {unfold} from '../../utils/periodicity'
import ExpenseModal from './ExpenseModal'
import '../../assets/css/custom.css'
import { initializeConnection } from 'services/ConnectionService'
import { getUser } from 'services/userService'

var token = localStorage.getItem("token-contare")
var socket

export default function ListExpenses(props) {
    const [Expenses, setExpenses] = useState([])
    const [ExpenseModals, setExpenseModals] = useState([])
    const [cachedExpenses, setCachedExpenses] = useState([])
    const [sorting, setSorting] = useState('Data do Gasto')
    const [initializing, setInitializing] = useState(true)
    const [loggedUser, setLoggedUser] = useState({})
    const [sortedExpenses, setSortedExpenses] = useState([])
    const [search, setSearch] = useState('')


    const [pageIndex, setPageIndex] = useState(0)
    const [pageExpenses, setpageExpenses] = useState([])

    const elemsPerPage = 12

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
            getUser(token).then(user =>{
                setLoggedUser(user)
                getExpenses(token).then(resp => {

                setCachedExpenses(resp)
                
                setExpenseModals(resp.map(_ => {
                    return false
                }))

                let totalExpense = 0
                for (const expense of unfold(resp)) {
                    totalExpense += expense.participants.find(p=>p._id === user._id).payValue
                }
                props.setTotalExpense(totalExpense)
                })
            })
        }
    })

    useEffect(() => {
        sortExpenses()
    }, [cachedExpenses, sorting])

    useEffect(() => {
        setpageExpenses(Expenses.slice(elemsPerPage * pageIndex, elemsPerPage * pageIndex + elemsPerPage))
    }, [Expenses])

    function previous() {
        setPageIndex(val => {
            if (val > 0) val -= 1
            setpageExpenses(Expenses.slice(elemsPerPage * val, elemsPerPage * val + elemsPerPage))
            return val
        })
    }

    function next() {
        setPageIndex(val => {
            if (elemsPerPage * (val + 1) < Expenses.length) val += 1
            setpageExpenses(Expenses.slice(elemsPerPage * val, elemsPerPage * val + elemsPerPage))
            return val
        })
    }
    useEffect(()=>{
        setExpenses(sortedExpenses.filter(expense => {
            let norm = str => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            if (norm(expense.title).includes(norm(search))) return true
            if (norm(expense.category).includes(norm(search))) return true
            if (norm(expense.description).includes(norm(search))) return true
        }))
    }, [search, sortedExpenses])

    useEffect(() => {
         setPageIndex(0)
    }, [search])

    function sortExpenses() {
        if (cachedExpenses) {
            if (sorting === 'Título') setSortedExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.title.toLowerCase() < inc2.title.toLowerCase()) return -1
                return 1
            }))
            else if (sorting === 'Valor') setSortedExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.totalValue > inc2.totalValue) return -1
                return 1
            }))
            else if (sorting === 'Data do Gasto') setSortedExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (new Date(inc1.dueDate) > new Date(inc2.dueDate)) return -1
                return 1
            }))
            else if (sorting === 'Tipo de Recorrencia') setSortedExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.periodicity > inc2.periodicity) return -1
                return 1
            }))
            else if (sorting === 'Categoria') setSortedExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
                if (inc1.category > inc2.category) return -1
                return 1
            }))
            else if (sorting === 'Descrição') setSortedExpenses(cachedExpenses.slice().sort((inc1, inc2) => {
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
        <>
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
                <Col lg={6} sm={8} xs={12}>
                    <FormGroup>
                        <ControlLabel>Pesquisar por gastos</ControlLabel>
                        <FormControl
                            placeholder="Título, Categoria ou Descrição" componentClass="input"
                            value={search} onChange={val => setSearch(val.target.value)}
                        />
                    </FormGroup>
                </Col>
            </Row>
            {pageExpenses.map((expense, i) =>
                <Col lg={4} sm={6} key={expense._id}>
                    <StatsCard 
                        bigIcon={expense.participants.length > 1?<i className="pe-7s-users text-success"/>:<i className="pe-7s-wallet text-danger"/>}
                        statsText={expense.title}
                        statsIcon={<i hidden={expense.owner !== loggedUser._id} className="fa fa-edit clickable" onClick={() => showModal(i)} />}
                        statsIconText={expense.owner !== loggedUser._id?<span  className="clickable" onClick={() => showModal(i)}>Visualizar gasto</span>:<span  className="clickable" onClick={() => showModal(i)}>Editar gasto</span>}
                        statsValue={expense.participants.find(p=> p._id === loggedUser._id).payValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    />
                    <ExpenseModal owner={expense.owner === loggedUser._id} expense={expense} i={i} ExpenseModals={ExpenseModals} setExpenseModals={setExpenseModals} setUpdate={props.setUpdate} />
                </Col>
                )}
        </Grid>
        <Pager>
            <Pager.Item className={pageIndex <= 0 ? 'hidden' : ''} previous onClick={previous}>
                &larr; Anterior
            </Pager.Item>
            <Pager.Item className={elemsPerPage * (pageIndex + 1) >= Expenses.length ? 'hidden' : ''} next onClick={next}>
                Próximo &rarr;
            </Pager.Item>
        </Pager>
    </>
    )
}
