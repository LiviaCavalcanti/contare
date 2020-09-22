import React, {useState} from 'react'
import {Modal, Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {createIncome} from '../../services/income'
import {makeDate} from '../../utils/date'

export default function CreateIncome(props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')
    const [date, setDate] = useState((new Date()).toISOString().slice(0, 10))
    const [periodicity, setPeriodicity] = useState('NONE')

    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [showFailureAlert, setShowFailureAlert] = useState(false)

    const [showTitleAlert, setShowTitleAlert] = useState(false)
    const [showValueAlert, setShowValueAlert] = useState(false)

    function clearForm() {
        setTitle('')
        setDescription('')
        setValue('')
        setDate((new Date()).toISOString().slice(0, 10))
        setPeriodicity('NONE')

        setShowTitleAlert(false)
        setShowValueAlert(false)
    }

    function createIncomeResp(resp) {
        if (resp.ok) {
            clearForm()
            props.created(true)
            setShowSuccessAlert(true)
            setShowFailureAlert(false)
        } else {
            setShowSuccessAlert(false)
            setShowFailureAlert(true)
        }
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

    function submit() {
        let isValidTitle = validateTitle(title)
        let isValidValue = validateValue(value)
        if (isValidTitle && isValidValue)
            createIncome(title, description, value, makeDate(date), periodicity, createIncomeResp)
    }

    return (
        <Modal show={props.show} onHide={() => props.setShow(false) & clearForm() & setShowSuccessAlert(false) & setShowFailureAlert(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Criar nova renda</Modal.Title>
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
                </Form>
                <div className={showSuccessAlert ? '' : 'hidden'}>
                    <p style={{color: 'green'}}>
                        Renda criada com sucesso
                        <Button className='pull-right' style={{color: 'green', borderColor: 'green'}} onClick={() => setShowSuccessAlert(false)}>Ok</Button>
                    </p>
                </div>
                <div className={showFailureAlert ? '' : 'hidden'}>
                    <p style={{color: 'red'}}>
                        Não foi possível criar a renda
                        <Button className='pull-right' style={{color: 'red', borderColor: 'red'}} onClick={() => setShowFailureAlert(false)}>Ok</Button>
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={submit}>
                    Criar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
