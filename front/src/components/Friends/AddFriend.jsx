import React, { useState } from 'react'
import {Modal, Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import { getUserFromID } from 'services/userService'

export default function AddFriend(props) {
    const [friendId, setFriendId] = useState('')
    const [userFound, setUserFound] = useState(null)

    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [showFailureAlert, setShowFailureAlert] = useState(false)

    const [showFriendIdAlert, setShowFriendIdAlert] = useState(false)

    function clearForm() {
        setFriendId('')
        setShowFriendIdAlert(false)
    }

    function addFriendResp(resp) {
        console.log("resp: %o", resp)
        if (resp.statusText === "OK" || resp.status === 200) {
            clearForm()
            props.friendAdded(true)
            setShowSuccessAlert(true)
            setShowFailureAlert(false)
        } else {
            setShowSuccessAlert(false)
            setShowFailureAlert(true)
        }
    }

    async function validateFriendId(friendId) {
        if (friendId.length > 0) {
            setShowFriendIdAlert(false)
            let friend = await getUserFromID(friendId, localStorage.getItem("token-contare"))
            setUserFound(friend)
            return friend
        } else {
            setShowFriendIdAlert(true)
            return null
        }
    }

    async function submit() {
        let friendFound = validateFriendId(friendId)
        if (friendFound != null) {
            let resp = await addFriendResp(friendFound);
            addFriendResp(resp)
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
                        <ControlLabel>Nome de usuário a ser adicionado(a)</ControlLabel>
                        <FormControl type="text"  value={friendId} onChange={val => setFriendId(val.target.value) & validateFriendId(val.target.value)} style={showFriendIdAlert ? {borderColor: 'red', color: 'red'} : {}}/>
                        {showFriendIdAlert && <span style={{color: 'red'}}>Campo necessário para prosseguir</span>}
                    </FormGroup>
                </Form>
                <div className={showSuccessAlert ? '' : 'hidden'}>
                    <p style={{color: 'green'}}>
                        Solicitação de amizade enviada com sucesso!
                        <Button className='pull-right' style={{color: 'green', borderColor: 'green'}} onClick={() => setShowSuccessAlert(false)}>Ok</Button>
                    </p>
                </div>
                <div className={showFailureAlert ? '' : 'hidden'}>
                    <p style={{color: 'red'}}>
                        Não foi possível encontrar esse usuário.
                        <Button className='pull-right' style={{color: 'red', borderColor: 'red'}} onClick={() => setShowFailureAlert(false)}>Ok</Button>
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={submit}>
                    Adicionar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
