import React, {useState} from 'react'
import {Modal, Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {updateIncome, deleteIncome} from '../../services/income'

export default function Income(props) {
    const [title, setTitle] = useState(props.income.title)
    const [description, setDescription] = useState(props.income.description)
    const [value, setValue] = useState(props.income.value)
    const [date, setDate] = useState((new Date(props.income.receivedOn)).toISOString().slice(0, 10))
    const [periodicity, setPeriodicity] = useState(props.income.periodicity)
    const [canceledDate, setCanceledDate] = useState(props.income.canceledOn ? (new Date(props.income.canceledOn)).toISOString().slice(0, 10) : '')

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
                        <FormControl type="text"  value={title} onChange={val => setTitle(val.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Descrição</ControlLabel>
                        <FormControl type="text" value={description} onChange={val => setDescription(val.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Valor</ControlLabel>
                        <FormControl type="number" value={value} onChange={val => setValue(val.target.value)}/>
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
                    <FormGroup>
                        <ControlLabel>Até quando renda ainda foi recebida (deixar sem data caso renda ainda é recebida ou se renda não tem recorrencia)</ControlLabel>
                        <FormControl type="date" value={canceledDate} onChange={val => setCanceledDate(val.target.value)}/>
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="danger" onClick={() => deleteIncome(props.income._id) & props.setUpdate(true)}>
                    Deletar
                </Button>
                <Button bsStyle="primary" onClick={() => updateIncome(props.income._id, title, description, value, date, periodicity, canceledDate) & props.setUpdate(true)}>
                    Atualizar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
