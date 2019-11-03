import React, {useState} from 'react'
import {Modal, Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {updateExpenses, deleteExpense} from '../../services/expenseService'

var token = localStorage.getItem("token-contare")

export default function ExpenseModal(props) {
    const [title, setTitle] = useState(props.expense.title)
    const [category, setCategory] = useState(props.expense.category)
    const [description, setDescription] = useState(props.expense.description)
    const [totalValue, setTotalValue] = useState(props.expense.totalValue)
    const [dueDate, setDueDate] = useState((new Date(props.expense.dueDate)).toISOString().slice(0, 10))
    const [endDate, setEndDate] = useState(props.expense.endDate ? (new Date(props.expense.endDate)).toISOString().slice(0, 10) : '')
    const [createdAt, setCreatedAt] = useState(props.expense.createdAt ? (new Date(props.expense.createdAt)).toISOString().slice(0, 10) : '')
    const [periodicity, setPeriodicity] = useState(props.expense.periodicity)
    
    const [showTitleAlert, setShowTitleAlert] = useState(false)
    const [showValueAlert, setShowValueAlert] = useState(false)
    const [showEndDateAlert, setShowEndDateAlert] = useState(false)

    function onHide() {
        let ExpenseModals = props.ExpenseModals.slice()
        ExpenseModals[props.i] = false
        props.setExpenseModals(ExpenseModals)

        setTitle(props.expense.title)
        setDescription(props.expense.description)
        setTotalValue(props.expense.totalValue)
        setCreatedAt(props.expense.createdAt ? (new Date(props.expense.createdAt)).toISOString().slice(0, 10) : (new Date()).toISOString().slice(0, 10))
        setDueDate((new Date(props.expense.dueDate)).toISOString().slice(0, 10))
        setEndDate(props.expense.endDate ? (new Date(props.expense.endDate)).toISOString().slice(0, 10) : '')
        setPeriodicity(props.expense.periodicity)

        setShowTitleAlert(false)
        setShowValueAlert(false)
        setShowEndDateAlert(false)
    }

    function validateTitle(title) {
        if (title.length > 0) {
            setShowTitleAlert(false)
            return true
        } else {
            setShowTitleAlert(true)
            return false
        }
    }

    function validateValue(totalValue) {
        if (totalValue > 0) {
            setShowValueAlert(false)
            return true
        } else {
            setShowValueAlert(true)
            return false
        }
    }

    function validateEndDate(endDate) {
        if (dueDate) {
            let d1 = new Date(dueDate)
            let d2 = new Date(endDate)
            window.d1 = d1
            window.d2 = d2
            if (d1 > d2) {
                setShowEndDateAlert(true)
                return false
            }
        }
        setShowEndDateAlert(false)
        return true
    }

    async function submit() {
        let isValidTitle = validateTitle(title)
        let isValidValue = validateValue(totalValue)
        let isValidEndDate = validateEndDate(endDate)
        if (isValidTitle && isValidValue && isValidEndDate) {
            if (isValidTitle && isValidValue) {
                let expense = {
                    title: title,
                    description: description,
                    category: category,
                    totalValue: totalValue,
                    dueDate: dueDate,
                    periodicity: periodicity,
                    endDate: endDate,
                    createdAt: createdAt
                }

                updateExpenses(localStorage.getItem("token-contare"), props.expense._id, expense)
                props.setUpdate(true)
            }
        }
    }

    return (
        <Modal show={props.ExpenseModals[props.i]} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Atualizar informações de gastos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup>
                        <ControlLabel>Título</ControlLabel>
                        <FormControl type="text"  value={title} onChange={val => setTitle(val.target.value) & validateTitle(val.target.value)} style={showTitleAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                        {showTitleAlert && <span style={{color: 'red'}}>Título necessário</span>}
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Categoria</ControlLabel>
                        <FormControl type="text" value={category} onChange={val => setCategory(val.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Descrição</ControlLabel>
                        <FormControl type="text" value={description} onChange={val => setDescription(val.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Valor</ControlLabel>
                        <FormControl type="number" value={totalValue} onChange={val => setTotalValue(val.target.value) & validateValue(val.target.value)} style={showValueAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                        {showValueAlert && <span style={{color: 'red'}}>Valor acima de zero necessário</span>}
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Data de gasto</ControlLabel>
                        <FormControl type="date" value={dueDate} onChange={val => setDueDate(val.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Tipo de recorrencia</ControlLabel>
                        <FormControl componentClass="select" value={periodicity} onChange={val => setPeriodicity(val.target.value)}>
                            <option value='NONE'>Sem recorrencia</option>
                            <option value='DAILY'>Diária</option>
                            <option value='WEEKLY'>Semanal</option>
                            <option value='MONTHLY'>Mensal</option>
                            <option value='ANNUALLY'>Anual</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup className={periodicity != 'NONE' ? '' : 'hidden'}>
                        <ControlLabel>Até quando gasto ainda foi realizado (deixar sem data caso gasto ainda ocorre)</ControlLabel>
                        <FormControl type="date" value={endDate} onChange={val => setEndDate(val.target.value) & validateEndDate(val.target.value)} style={showEndDateAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                        {showEndDateAlert && <span style={{color: 'red'}}>Não pode ser antes da data de gasto</span>}
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="danger" onClick={() => deleteExpense(token, props.expense._id) & props.setUpdate(true)}>
                    Deletar
                </Button>
                <Button bsStyle="primary" onClick={submit}>
                    Atualizar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
