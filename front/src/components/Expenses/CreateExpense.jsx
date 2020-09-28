import React, {useEffect, useState} from 'react'
import {Modal, Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {addExpenses} from '../../services/expenseService'
import { getUser,getFriends } from '../../services/userService'
import {Typeahead} from 'react-bootstrap-typeahead';
import '../../../node_modules/react-bootstrap-typeahead/css/Typeahead.css';
import './styles.css'

export default function CreateExpense(props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')
    const [category, setCategory] = useState('')
    const [date, setDate] = useState((new Date()).toISOString().slice(0, 10))
    const [periodicity, setPeriodicity] = useState('NONE')
    
    const [friends, setFriends] = useState([])
    const [listEmail,setListEmail] = useState([])
    const [selectedFriend, setSelectedFriend] = useState([])
    const [friendPayValue, setFriendPayValue] = useState(0)
    const [sharedValue, setSharedValue] = useState(0)

    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [showFailureAlert, setShowFailureAlert] = useState(false)

    const [showTitleAlert, setShowTitleAlert] = useState(false)
    const [showValueAlert, setShowValueAlert] = useState(false)

    const [friendValueAlert, setFriendValueAlert] = useState(false)

    function clearForm() {
        setTitle('');
        setDescription('');
        setValue('')
        setCategory('')
        setDate((new Date()).toISOString().slice(0, 10))
        setPeriodicity('NONE')

        setShowTitleAlert(false)
        setShowValueAlert(false)
        setSelectedFriend([])
        setListEmail([])
        setFriendPayValue(0)
    }

    function addExpensesResp(resp) {
       // console.log("resp: %o", resp)
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

    function validateFriendValue(value) {
        if (value > 0) {
            setFriendValueAlert(false)
            return true
        } else {
            setFriendValueAlert(true)
            return false
        }
    }

    async function submit() {
        let isValidTitle = validateTitle(title)
        let isValidValue = validateValue(value)
        let user = await getUser(localStorage.getItem("token-contare"));
        listEmail.unshift({email:user.email, payValue:value-sharedValue})
        
        if (isValidTitle && isValidValue) {
            let expenseBody = {
                title: title,
                description: description,
                dueDate: date,
                owner: user.id,
                totalValue: value,
                category: category,
                periodicity: periodicity,
                listEmail:listEmail
            }
            let resp = await addExpenses(localStorage.getItem("token-contare"), expenseBody, true);
            addExpensesResp(resp)
            closeModal();
        }
    }

    async function getThisFriends(){
        let thisFriends = await getFriends(localStorage.getItem("token-contare"));
        thisFriends.data.map(f=>{
            friends.push(f);
        })
    }

    function handleParticipationValueChange(){
        setSharedValue(sharedValue+friendPayValue)
        const participantObj = {email:selectedFriend[0].email,payValue:parseInt(friendPayValue)}
        listEmail.push(participantObj);
        setSelectedFriend([])
        setFriendPayValue('')
    }

    function removeInvite(participant){
        const temp = [];
        listEmail.map(p=>{
            if(p.email != participant.email) temp.push(p)
        })

        setListEmail(temp);
    }
    
    useEffect(()=>{
        getThisFriends();
    },[])

    function disableInviteFriendBtn(){
        return (selectedFriend === null || selectedFriend.length=== 0 || friendPayValue <= 0 || friendPayValue > (value-sharedValue))
    }

    function closeModal(){
        props.setShow(false)
        clearForm()
        setShowSuccessAlert(false)
        setShowFailureAlert(false)
    }

    return (
        <Modal show={props.show} onHide={() => closeModal()}>
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
                    <FormGroup>
                        <ControlLabel>Convide um amigo</ControlLabel>
                            <Form inline>
                                <FormGroup controlId="formInLineEmail">
                                    <Typeahead
                                        id="basic-typeahead-single"
                                        onChange={setSelectedFriend}
                                        options={friends}
                                        selected={selectedFriend}
                                        labelKey={option => `${option.name} (${option.email})`}
                                        placeholder="Digite o EMAIL"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Valor: </ControlLabel>
                                    <FormControl type="number" value={friendPayValue} onChange={val => setFriendPayValue(val.target.value) & validateFriendValue(val.target.value)} style={friendValueAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                                        {friendValueAlert && <span style={{color: 'red'}}>Valor acima de zero necessário</span>}        
                                    <Button disabled={disableInviteFriendBtn()} bsStyle="success" className='pull-right' onClick={handleParticipationValueChange}>✔</Button>
                                </FormGroup>
                            </Form>
                            <Form inline>
                                {listEmail.map(p=><div>
                                        <ControlLabel key={p.email}>Email: {p.email+" "}R${p.payValue}</ControlLabel>
                                        <Button  bsSize="xsmall" bsStyle="danger" onClick={()=>removeInvite(p)}>X</Button>
                                    </div>
                                )} 
                            </Form>
                    </FormGroup>
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
