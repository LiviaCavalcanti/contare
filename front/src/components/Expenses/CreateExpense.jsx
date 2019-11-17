import React, {useState} from 'react'
import {Modal, Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {addExpenses} from '../../services/expenseService'
import { getUser } from 'services/userService'

export default function CreateExpense(props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')
    const [category, setCategory] = useState('')
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
        setCategory('')
        setDate((new Date()).toISOString().slice(0, 10))
        setPeriodicity('NONE')

        setShowTitleAlert(false)
        setShowValueAlert(false)
    }

    function addExpensesResp(resp) {
        console.log("resp: %o", resp)
        if (resp.statusText === "OK" || resp.status === 200) {
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

    async function submit() {
        let isValidTitle = validateTitle(title)
        let isValidValue = validateValue(value)
        let user = await getUser(localStorage.getItem("token-contare"));
        if (isValidTitle && isValidValue) {
            let expenseBody = {
                title: title,
                description: description,
                dueDate: date,
                owner: user.id,
                totalValue: value,
                category: category,
                periodicity: periodicity
            };
            let resp = await addExpenses(localStorage.getItem("token-contare"), expenseBody);
            addExpensesResp(resp)
        }
    }

    return (
        <Modal show={props.show} onHide={() => props.setShow(false) & clearForm() & setShowSuccessAlert(false) & setShowFailureAlert(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Criar novo gasto</Modal.Title>
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
                </Form>
                <div className={showSuccessAlert ? '' : 'hidden'}>
                    <p style={{color: 'green'}}>
                        Gasto criado com sucesso
                        <Button className='pull-right' style={{color: 'green', borderColor: 'green'}} onClick={() => setShowSuccessAlert(false)}>Ok</Button>
                    </p>
                </div>
                <div className={showFailureAlert ? '' : 'hidden'}>
                    <p style={{color: 'red'}}>
                        Não foi possível criar o gasto
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