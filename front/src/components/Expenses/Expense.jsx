import React, {useState} from 'react'
import {Modal, Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {updateExpenses, deletedExpenses} from '../../services/expenseService'

export default function Expense(props) {
    const [title, setTitle] = useState(props.Expense.title)
    const [description, setDescription] = useState(props.Expense.description)
    const [value, setValue] = useState(props.Expense.value)
    //const [date, setDate] = useState((new Date(props.Expense.date)).toISOString().slice(0, 10))
    const [date, setDate] = useState(new Date())
    const [periodicity, setPeriodicity] = useState(props.Expense.periodicity)
    //const [canceledDate, setCanceledDate] = useState(props.Expense.canceledOn ? (new Date(props.Expense.canceledOn)).toISOString().slice(0, 10) : '')

    const [showTitleAlert, setShowTitleAlert] = useState(false)
    const [showValueAlert, setShowValueAlert] = useState(false)
    const [showCanceledDateAlert, setShowCanceledDateAlert] = useState(false)

    function onHide() {
        let ExpenseModals = props.ExpenseModals.slice()
        ExpenseModals[props.i] = false
        props.setExpenseModals(ExpenseModals)

        setTitle(props.Expense.title)
        setDescription(props.Expense.description)
        setValue(props.Expense.value)
        //setDate((new Date(props.Expense.receivedOn)).toISOString().slice(0, 10))
        setDate(new Date())
        setPeriodicity(props.Expense.periodicity)
        //setCanceledDate(props.Expense.canceledOn ? (new Date(props.Expense.canceledOn)).toISOString().slice(0, 10) : '')

        setShowTitleAlert(false)
        setShowValueAlert(false)
        setShowCanceledDateAlert(false)
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

    function validateValue(value) {
        if (value > 0) {
            setShowValueAlert(false)
            return true
        } else {
            setShowValueAlert(true)
            return false
        }
    }

    function validateCanceledDate(canceledDate) {
        if (date) {
            let d1 = new Date(date)
            let d2 = new Date(canceledDate)
            window.d1 = d1
            window.d2 = d2
            if (d1 > d2) {
                setShowCanceledDateAlert(true)
                return false
            }
        }
        setShowCanceledDateAlert(false)
        return true
    }

    function submit() {
        let isValidTitle = validateTitle(title)
        let isValidValue = validateValue(value)
        //let isValidCanceledDate = validateCanceledDate(canceledDate)
        //if (isValidTitle && isValidValue && isValidCanceledDate) {
        if (isValidTitle && isValidValue) {
            let expense = {
                title: title,
                description: description,
                value: value,
                date: date,
                periodicity: periodicity,
                //canceledDate: canceledDate
            }
            updateExpenses(localStorage.getItem("token-contare"), props.Expense._id, expense)
            props.setUpdate(true)
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
                        <ControlLabel>Descrição</ControlLabel>
                        <FormControl type="text" value={description} onChange={val => setDescription(val.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Valor</ControlLabel>
                        <FormControl type="number" value={value} onChange={val => setValue(val.target.value) & validateValue(val.target.value)} style={showValueAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                        {showValueAlert && <span style={{color: 'red'}}>Valor acima de zero necessário</span>}
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Data de gasto</ControlLabel>
                        <FormControl type="date" value={date} onChange={val => setDate(val.target.value)}/>
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
                        {/* <FormControl type="date" value={canceledDate} onChange={val => setCanceledDate(val.target.value) & validateCanceledDate(val.target.value)} style={showCanceledDateAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                        {showCanceledDateAlert && <span style={{color: 'red'}}>Não pode ser antes da data de gasto</span>} */}
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="danger" onClick={() => deletedExpenses(props.Expense._id) & props.setUpdate(true)}>
                    Deletar
                </Button>
                <Button bsStyle="primary" onClick={submit}>
                    Atualizar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
