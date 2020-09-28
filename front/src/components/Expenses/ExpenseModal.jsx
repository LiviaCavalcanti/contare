import React, {useEffect, useState} from 'react'
import {Table,Modal, Button, Form, FormGroup, FormControl, ControlLabel, OverlayTrigger, Tooltip} from 'react-bootstrap'
import { deleteInvitation } from '../../services/inviteService'
import {updateExpenses, deleteExpense} from '../../services/expenseService'
import { getFriends } from '../../services/userService'
import "./styles.css"
import { Typeahead } from 'react-bootstrap-typeahead'
import {makeDate} from '../../utils/date'


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
    const [participants, setParticipants] = useState(props.expense.participants)
    const [allValues, setAllValues] = useState([])
    
    const [showTitleAlert, setShowTitleAlert] = useState(false)
    const [showValueAlert, setShowValueAlert] = useState(false)
    const [showAllValuesAlert, setShowAllValuesAlert] = useState(false)
    const [showEndDateAlert, setShowEndDateAlert] = useState(false)

    const [friends, setFriends] = useState([])
    const [selectedFriend, setSelectedFriend] = useState([])
    const [addNewParticipant,setAddNewParticipant] = useState(false)
    const [listEmail, setListEmail] = useState([{name:participants[0].name,email:participants[0].email,payValue:participants[0].payValue}])

    async function getThisFriends(){
        await getFriends(token).then(res=>{
            const temp = []
            res.data.map(f=>{
                if(participants.find(p=> p.email===f.email) === undefined) temp.push(f);
            })
           setFriends(temp)
        });
    }

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
        setParticipants(props.expense.participants)
        setFriends([])
        setSelectedFriend([])
        setAddNewParticipant(false)
        setListEmail([{name:participants[0].name,email:participants[0].email,payValue:participants[0].payValue}])
        getThisFriends();

        const temp = []
        props.expense.participants.map(p=>{
            temp.push(p.payValue)
        })
        setAllValues(temp)

        setShowAllValuesAlert(false)
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
        const sumAllValues = allValues.reduce((total, value)=> total+value, 0)
        
        validateAllValues()
        
        if (isValidTitle && isValidValue && isValidEndDate && (sumAllValues === totalValue)) {

            var i = 0
            participants.map(p=>{
                p.payValue = allValues[i]
                i++
            })

            if (isValidTitle && isValidValue) {
                let expense = {
                    title: title,
                    description: description,
                    category: category,
                    totalValue: totalValue,
                    dueDate: makeDate(dueDate),
                    periodicity: periodicity,
                    participants:participants,
                    listEmail:listEmail
                    endDate: makeDate(endDate),
                    createdAt: createdAt
                }

                await updateExpenses(token, props.expense._id, expense)
                props.setUpdate(true)
            }
        }
    }

    function removeParticipant(participant){
        var temp = [];
        const index = participants.indexOf(participant)
        allValues[0] += parseInt(participant.payValue) 

        participants.map(p=>{
           if(p._id != participant._id) temp.push(p)
        })
        setParticipants(temp);

        temp = []
        var i = 0
        allValues.map(v=>{
            if(i !== index) {temp.push(v)}
            i++
        })
        setAllValues(temp)

        if(participant.participantStatus === "WAITING") deleteInvitation(participant._id,props.expense._id,token)
    }

    function handleValueChange(index, payValue){
       
        if(index === -1 && payValue > 0 && payValue <= totalValue){
            listEmail[listEmail.length-1].payValue = parseInt(payValue)
            if(allValues.slice(participants.length,allValues.length) < listEmail.length-1 ){

                const temp = []
                allValues.map(value=>{temp.push(value)})
                temp.push(parseInt(payValue))
                setAllValues(temp)

            }else{
                const temp = []
                var i = 0
                allValues.map(value=>{
                    if(i === allValues.length-1) return;
                    else temp.push(value)
                    i++
                })
                temp.push(parseInt(payValue))
                setAllValues(temp)
            }
        }else{            
            if(index !== -1 && payValue > 0 && payValue <= totalValue){
                const temp = []
                var i = 0
                allValues.map(value=>{
                    if(i===index) {temp.push(parseInt(payValue))}
                    else {temp.push(value)}
                    i++
                })
                setAllValues(temp)
            }
        }
    }

    function validateAllValues(){
        const sumAllValues = allValues.reduce((total, value)=> total+value, 0)
        if (sumAllValues === totalValue) {
            setShowAllValuesAlert(false)
            return true
        } else {
            setShowAllValuesAlert(true)
            return false
        }
    }

    function createNewParticipant(){
        if(friends.length > 0){
            setAddNewParticipant(true)
            listEmail.push({name:"",email:"",payValue:0})
        }
    }
    
    useEffect(()=>{
        if(selectedFriend.length > 0){
            listEmail[listEmail.length-1].email=selectedFriend[0].email
            listEmail[listEmail.length-1].name=selectedFriend[0].name

            const temp = []
            friends.map(f=>{
                if(f.email !== selectedFriend[0].email) temp.push(f)
            })
            setFriends(temp)
        }
   },[selectedFriend])

    useEffect(()=>{
        participants.map(p=>{
            allValues.push(p.payValue)
        })
        getThisFriends();
    },[])

    const tooltip = (
       friends.length === 0 ? <Tooltip id="tooltip"><strong>Não há mais amigos para adicionar a esta despesa</strong></Tooltip>:<div id="not"/>
    );
    
    return (
        <Modal show={props.ExpenseModals[props.i]} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Atualizar informações de gastos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup>
                        <ControlLabel>Título</ControlLabel>
                        <FormControl disabled={!props.owner} type="text"  value={title} onChange={val => setTitle(val.target.value) & validateTitle(val.target.value)} style={showTitleAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                        {showTitleAlert && <span style={{color: 'red'}}>Título necessário</span>}
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Categoria</ControlLabel>
                        <FormControl disabled={!props.owner} type="text" value={category} onChange={val => setCategory(val.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Descrição</ControlLabel>
                        <FormControl disabled={!props.owner} type="text" value={description} onChange={val => setDescription(val.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Valor</ControlLabel>
                        <FormControl disabled={!props.owner} type="number" value={totalValue} onChange={val => setTotalValue(val.target.value) & validateValue(val.target.value)} style={showValueAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                        {showValueAlert && <span style={{color: 'red'}}>Valor acima de zero necessário</span>}
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Data de gasto</ControlLabel>
                        <FormControl disabled={!props.owner} type="date" value={dueDate} onChange={val => setDueDate(val.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Tipo de recorrencia</ControlLabel>
                        <FormControl disabled={!props.owner} componentClass="select" value={periodicity} onChange={val => setPeriodicity(val.target.value)}>
                            <option value='NONE'>Sem recorrencia</option>
                            <option value='DAILY'>Diária</option>
                            <option value='WEEKLY'>Semanal</option>
                            <option value='MONTHLY'>Mensal</option>
                            <option value='ANNUALLY'>Anual</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup className={periodicity != 'NONE' ? '' : 'hidden'}>
                        <ControlLabel>Até quando gasto ainda foi realizado (deixar sem data caso gasto ainda ocorre)</ControlLabel>
                        <FormControl disabled={!props.owner} type="date" value={endDate} onChange={val => setEndDate(val.target.value) & validateEndDate(val.target.value)} style={showEndDateAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                        {showEndDateAlert && <span style={{color: 'red'}}>Não pode ser antes da data de gasto</span>}
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Participantes
                        <OverlayTrigger placement="right" overlay={tooltip}>
                            <Button 
                                style={!props.owner?{marginLeft:"5px", visibility:"hidden"}:{marginLeft:"5px",}} 
                                onClick={()=>createNewParticipant()} bsSize="medium" 
                                bsStyle="success" className="pe-7s-plus text-success"/>
                            </OverlayTrigger>
                        </ControlLabel>
                        <Table responsive striped bordered>
                            <thead>
                                <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Valor (R$)</th>
                                <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                            {participants.map(p=>
                                <tr key={p._id}>
                                    <td>{p.name}</td>
                                    <td>{p.email}</td>
                                    <td>
                                    <FormGroup>
                                        <FormControl
                                        disabled={!props.owner}
                                        type="number"
                                        value= {allValues[participants.indexOf(p)]}
                                        onChange={val=> handleValueChange(participants.indexOf(p),val.target.value)} style={showAllValuesAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                                        {showAllValuesAlert && <p style={{color: 'red',fontSize:10}}>Valores não batem com valor total da despesa</p>}
                                    </FormGroup>
                                    </td>
                                    {p.participantStatus==="ACTIVE"?<td>ATIVO</td>:
                                     p.participantStatus==="WAITING"?<td>AGUARDANDO</td>:
                                     <td>RECUSADO</td>}
                                    {props.owner && p._id!==props.expense.owner?<td><Button onClick={()=>removeParticipant(p)} bsSize="xsmall" bsStyle="danger" >X</Button></td>:""}
                                </tr>
                            )}
                            </tbody>
                            </Table>
                            <Table responsive striped bordered hidden={!addNewParticipant}>
                                {
                                listEmail.slice(1).map(v=>            
                                    <tbody key={v.email}>
                                    <tr>
                                        <td>
                                            <Typeahead
                                                id="basic-typeahead-single"
                                                onChange={setSelectedFriend}
                                                options={friends}
                                                selected={v.email===""?selectedFriend:[v]}
                                                labelKey={option => `${option.name}`}
                                                placeholder="Digite o EMAIL"
                                                />
                                        </td>
                                        <td>{selectedFriend.length>0?selectedFriend[0].email:"email@example.com"}</td>
                                        <td>
                                            <FormGroup>
                                                <FormControl
                                                disabled={!props.owner}
                                                type="number"
                                                value={v.payValue}
                                                onChange={val=> handleValueChange(-1,val.target.value)} style={showAllValuesAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                                                {showAllValuesAlert && <p style={{color: 'red',fontSize:10}}>Valores não batem com valor total da despesa</p>}
                                            </FormGroup>
                                        </td>
                                        <td>AGUARDANDO</td>
                                    </tr> 
                                    </tbody>
                                    )
                                }
                        </Table>
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button style={!props.owner?{visibility:"hidden"}:{}} bsStyle="danger" onClick={() => deleteExpense(token, props.expense._id) & props.setUpdate(true)}>
                    Deletar
                </Button>
                <Button style={!props.owner?{visibility:"hidden"}:{}} bsStyle="primary" onClick={submit}>
                    Atualizar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
