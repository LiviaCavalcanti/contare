import {StatsCard} from 'components/StatsCard/StatsCard.jsx'
import {Grid, Col, FormGroup, FormControl, ControlLabel, Row, Pager} from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import {getIncomes} from '../../services/income'
import Income from './Income'
import {unfold} from '../../utils/periodicity'
import '../../assets/css/custom.css'
import { initializeConnection } from 'services/ConnectionService'
var socket

export default function ListIncomes(props) {
    const [incomes, setIncomes] = useState([])
    const [incomeModals, setIncomeModals] = useState([])
    const [cachedIncomes, setCachedIncomes] = useState([])
    const [sorting, setSorting] = useState('Data de Criação')
    const [pageIndex, setPageIndex] = useState(0)
    const [pageIncomes, setPageIncomes] = useState([])
    const [sortedIncomes, setSortedIncomes] = useState([])
    const [search, setSearch] = useState('')
    const [select, setSelect] = useState('')

    const elemsPerPage = 12
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        if (initializing) {
            socket = initializeConnection()
            socket.on("updateincome", () => {
                props.setUpdate(true)
            })
            setInitializing(false)   
        }
    }, [initializing])

    useEffect(() => {
        if (props.update) {
            props.setUpdate(false)

            getIncomes().then(resp => {
                setCachedIncomes(resp)

                if (elemsPerPage * pageIndex >= resp.length && pageIndex > 0)
                    setPageIndex(pageIndex - 1)

                setIncomeModals(resp.map(_ => {
                    return false
                }))

                let totalIncome = 0
                for (const income of unfold(resp)) {
                    totalIncome += income.value
                }
                props.setTotalIncome(totalIncome)
            })
        }
    })

    useEffect(() => {
        sortIncomes()
    }, [cachedIncomes, sorting])

    useEffect(() => {
        setPageIncomes(incomes.slice(elemsPerPage * pageIndex, elemsPerPage * pageIndex + elemsPerPage))
    }, [incomes])

    useEffect(() => {
        setIncomes(sortedIncomes.filter(income => {
            let norm = str => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            let inFilter = false
            if (norm(income.title).includes(norm(search)) ||
            norm(income.description).includes(norm(search))){
                inFilter = true
            }
            if (select==='' || income.periodicity===select) {
                inFilter = true && inFilter
            } else {
                inFilter = false && inFilter
            }
            return inFilter
        }))
    }, [search, sortedIncomes, select])

    useEffect(() => {
        setPageIndex(0)
    }, [search, select])

    function sortIncomes() {
        console.log(sorting)
        if (sorting === 'Data de Criação') setSortedIncomes(cachedIncomes.slice().reverse())
        else if (sorting === 'Título') setSortedIncomes(cachedIncomes.slice().sort((inc1, inc2) => {
            if (inc1.title.toLowerCase() < inc2.title.toLowerCase()) return -1
            return 1
        }))
        else if (sorting === 'Valor') setSortedIncomes(cachedIncomes.slice().sort((inc1, inc2) => {
            if (inc1.value > inc2.value) return -1
            return 1
        }))
        else if (sorting === 'Data de Recebimento') setSortedIncomes(cachedIncomes.slice().sort((inc1, inc2) => {
            if (new Date(inc1.receivedOn) > new Date(inc2.receivedOn)) return -1
            return 1
        }))
        else if (sorting === 'Tipo de Recorrencia') setSortedIncomes(cachedIncomes.slice().sort((inc1, inc2) => {
            if (inc1.periodicity > inc2.periodicity) return -1
            return 1
        }))
    }

    function showModal(i) {
        let incModals = incomeModals.slice()
        incModals[i] = true
        setIncomeModals(incModals)
    }

    function previous() {
        setPageIndex(val => {
            if (val > 0) val -= 1
            setPageIncomes(incomes.slice(elemsPerPage * val, elemsPerPage * val + elemsPerPage))
            return val
        })
    }

    function next() {
        setPageIndex(val => {
            if (elemsPerPage * (val + 1) < incomes.length) val += 1
            setPageIncomes(incomes.slice(elemsPerPage * val, elemsPerPage * val + elemsPerPage))
            return val
        })
    }

    return (
        <>
            <Grid fluid>
                <Row>
                    <Col lg={6} sm={8} xs={12}>
                        <FormGroup>
                            <ControlLabel>Pesquisar por rendas</ControlLabel>
                            <FormControl
                                placeholder="Título ou Descrição" componentClass="input"
                                value={search} onChange={val => setSearch(val.target.value)}
                            />
                        </FormGroup>
                    </Col>
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
                    <Col lg={3} sm={4} xs={6}>
                        <FormGroup>
                            <ControlLabel>Ordenar as rendas por</ControlLabel>
                            <FormControl componentClass="select" value={select} onChange={val => setSelect(val.target.value)}>
                            <option value=''>Selecione uma periodicidade</option>
                            <option value='NONE'>Sem recorrencia</option>
                            <option value='DAILY'>Diária</option>
                            <option value='WEEKLY'>Semanal</option>
                            <option value='MONTHLY'>Mensal</option>
                            <option value='ANNUALLY'>Anual</option>
                            </FormControl>
                        </FormGroup>
                    </Col>
                </Row>
                {pageIncomes.map((income, i) =>
                    <Col lg={4} sm={6} key={income._id}>
                        <StatsCard bigIcon={<i className="pe-7s-server text-warning" />}
                            statsText={income.title}
                            statsValue={ income.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            statsIcon={<i className="fa fa-edit clickable" onClick={() => showModal(i)} />}
                            statsIconText={<span className="clickable" onClick={() => showModal(i)}>Editar renda</span>}
                        />
                        <Income income={income} i={i} incomeModals={incomeModals} setIncomeModals={setIncomeModals} setUpdate={props.setUpdate} />
                    </Col>
                )}
            </Grid>
            <Pager>
                <Pager.Item className={pageIndex <= 0 ? 'hidden' : ''} previous onClick={previous}>
                    &larr; Anterior
                </Pager.Item>
                <Pager.Item className={elemsPerPage * (pageIndex + 1) >= incomes.length ? 'hidden' : ''} next onClick={next}>
                    Próximo &rarr;
                </Pager.Item>
            </Pager>
        </>
    )
}
