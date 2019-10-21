import {StatsCard} from 'components/StatsCard/StatsCard.jsx'
import {Grid, Col, FormGroup, FormControl, ControlLabel, Row} from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import {getIncomes} from '../../services/income'
import Income from './Income'
import {daysDiff, weeksDiff, monthsDiff, yearsDiff} from '../../utils/date'
import '../../assets/css/custom.css'

export default function ListIncomes(props) {
    const [incomes, setIncomes] = useState([])
    const [incomeModals, setIncomeModals] = useState([])
    const [cachedIncomes, setCachedIncomes] = useState([])
    const [sorting, setSorting] = useState('Data de Criação')

    useEffect(() => {
        if (props.update) {
            props.setUpdate(false)
            let totalIncome = 0

            getIncomes().then(resp => {
                setCachedIncomes(resp)

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

    useEffect(() => {
        sortIncomes()
    }, [cachedIncomes, sorting])

    function sortIncomes() {
        if (sorting == 'Data de Criação') setIncomes(cachedIncomes.slice())
        else if (sorting == 'Título') setIncomes(cachedIncomes.slice().sort((inc1, inc2) => {
            if (inc1.title.toLowerCase() < inc2.title.toLowerCase()) return -1
            return 1
        }))
        else if (sorting == 'Valor') setIncomes(cachedIncomes.slice().sort((inc1, inc2) => {
            if (inc1.value > inc2.value) return -1
            return 1
        }))
        else if (sorting == 'Data de Recebimento') setIncomes(cachedIncomes.slice().sort((inc1, inc2) => {
            if (new Date(inc1.receivedOn) > new Date(inc2.receivedOn)) return -1
            return 1
        }))
        else if (sorting == 'Tipo de Recorrencia') setIncomes(cachedIncomes.slice().sort((inc1, inc2) => {
            if (inc1.periodicity > inc2.periodicity) return -1
            return 1
        }))
    }

    function showModal(i) {
        let incModals = incomeModals.slice()
        incModals[i] = true
        setIncomeModals(incModals)
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
                            <option>Valor</option>
                            <option>Data de Recebimento</option>
                            <option>Tipo de Recorrencia</option>
                        </FormControl>
                    </FormGroup>
                </Col>
            </Row>
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
