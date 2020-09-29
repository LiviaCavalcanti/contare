import React, {useState} from 'react'
import {Modal, Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {updateIncome, deleteIncome} from '../../services/income'
import {makeDate} from '../../utils/date'

export default function Income(props) {
    const [title, setTitle] = useState(props.income.title)
    const [description, setDescription] = useState(props.income.description)
    const [value, setValue] = useState(props.income.value)
    const [date, setDate] = useState((new Date(props.income.receivedOn)).toISOString().slice(0, 10))
    const [periodicity, setPeriodicity] = useState(props.income.periodicity)
    const [canceledDate, setCanceledDate] = useState(props.income.canceledOn ? (new Date(props.income.canceledOn)).toISOString().slice(0, 10) : '')

    const [showTitleAlert, setShowTitleAlert] = useState(false)
    const [showValueAlert, setShowValueAlert] = useState(false)
    const [showCanceledDateAlert, setShowCanceledDateAlert] = useState(false)

    function onHide() {
        let incomeModals = props.incomeModals.slice()
        incomeModals[props.i] = false
        props.setIncomeModals(incomeModals)

        setTitle(props.income.title)
        setDescription(props.income.description)
        setValue(props.income.value)
        setDate((new Date(props.income.receivedOn)).toISOString().slice(0, 10))
        setPeriodicity(props.income.periodicity)
        setCanceledDate(props.income.canceledOn ? (new Date(props.income.canceledOn)).toISOString().slice(0, 10) : '')

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
        let isValidCanceledDate = validateCanceledDate(canceledDate)
        if (isValidTitle && isValidValue && isValidCanceledDate) {
            updateIncome(props.income._id, title, description, value, makeDate(date), periodicity, makeDate(canceledDate))
            props.setUpdate(true)
        }
    }

    return (
        <Modal show={props.incomeModals[props.i]} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Atualizar informações de renda</Modal.Title>
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
                        <ControlLabel>Data de recebimento</ControlLabel>
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
                    <FormGroup className={periodicity !== 'NONE' ? '' : 'hidden'}>
                        <ControlLabel>Até quando renda ainda foi recebida (deixar sem data caso renda ainda é recebida)</ControlLabel>
                        <FormControl type="date" value={canceledDate} onChange={val => setCanceledDate(val.target.value) & validateCanceledDate(val.target.value)} style={showCanceledDateAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                        {showCanceledDateAlert && <span style={{color: 'red'}}>Não pode ser antes da data de recebimento</span>}
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="danger" onClick={() => deleteIncome(props.income._id) & props.setUpdate(true)}>
                    Deletar
                </Button>
                <Button bsStyle="primary" onClick={submit}>
                    Atualizar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
