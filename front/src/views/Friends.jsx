import React, {useState, useEffect} from "react";
import { Grid, Row, Col, Table, Button } from "react-bootstrap";

import AddFriend from "components/Friends/AddFriend.jsx";
import StatsCard from "components/StatsCard/StatsCard";

import { 
  getFriends, deleteFriend,
  getSentFriendRequests, getReceivedFriendRequests,
  refuseFriend, acceptFriend, cancelRequest
} from "services/userService";

import { initializeConnection } from 'services/ConnectionService';

var token = localStorage.getItem("token-contare");
var socket = null;

export default function(props) {

  const [showAddFriendModal, setShowAddFriendModal] = useState(false)
  const [updateList, setUpdateList] = useState(true)
  const [friends, setFriends] = useState([])
  const [sentFriendRequests, setSentFriendRequests] = useState([])
  const [receivedFriendRequests, setReceivedFriendRequests] = useState([])
  const [cachedFriends, setCachedFriends] = useState([])
  const [cachedSentFriendRequests, setCachedSentFriendRequests] = useState([])
  const [cachedReceivedFriendRequests, setCachedReceivedFriendRequests] = useState([])
  const [sorting, setSorting] = useState('Data do Gasto')
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    if (initializing) {
        socket = initializeConnection()
        socket.on("updatefriendship", () => {
            setUpdateList(true)
        })
        setInitializing(false)   
    }
  }, [initializing])

  useEffect(() => {
    if (updateList) {
        setUpdateList(false)

        getFriends(token).then(resp => {
          setCachedFriends(resp.data)
        }).catch(err => console.err("Erro!! ", err))

        getSentFriendRequests(token).then(data => {
          setCachedSentFriendRequests(data)
        }).catch(err => console.err("Erro!! ", err))

        getReceivedFriendRequests(token).then(data => {
          setCachedReceivedFriendRequests(data)
        }).catch(err => console.err("Erro!! ", err))

    }
  }, [updateList])

useEffect(() => {
  sortFriends()
}, [cachedFriends, cachedSentFriendRequests, cachedReceivedFriendRequests, sorting])

function sortFriends() {
  if (cachedFriends) {
    setFriends(cachedFriends.slice().sort((inc1, inc2) => {
        if (inc1.name.toLowerCase() < inc2.name.toLowerCase()) return -1
        return 1
    }))
  }

  if (cachedSentFriendRequests) {
    setSentFriendRequests(cachedSentFriendRequests.slice().sort((inc1, inc2) => {
        if (inc1.name.toLowerCase() < inc2.name.toLowerCase()) return -1
        return 1
    }))
  }

  if (cachedReceivedFriendRequests) {
    setReceivedFriendRequests(cachedReceivedFriendRequests.slice().sort((inc1, inc2) => {
        if (inc1.name.toLowerCase() < inc2.name.toLowerCase()) return -1
        return 1
    }))
  }
}

function sendDeleteFriendRequest(friendEmail) {
  console.log(friendEmail, token)
  deleteFriend(friendEmail, token)
  setUpdateList(true)
}

function acceptFriendRequest(friendEmail) {
  console.log(friendEmail, token)
  acceptFriend(friendEmail, token)
  setUpdateList(true)
}

function refuseFriendRequest(friendEmail) {
  console.log(friendEmail, token)
  refuseFriend(friendEmail, token)
  setUpdateList(true)
}

function cancelFriendRequest(friendEmail) {
  cancelRequest(friendEmail, token)
  setUpdateList(true)
}

  return (
    <div className="content admin-flex-container-content">
      <AddFriend
        show={showAddFriendModal}
        setShow={setShowAddFriendModal}
        created={setUpdateList}
        shouldUpdateList={updateList}/>
      <Grid fluid>
        <Row style={friendRow}>
            <Button variant={"primary"} className={"text-center"} onClick={() => setShowAddFriendModal(true)}>
              Adicionar Amigo
            </Button>
        </Row>
        <br/>
        <Row style={friendRow}>
          <h3>Solicitações Enviadas</h3>
          <p style={{visibility: sentFriendRequests.length > 0 ? "hidden" : "visible"}}>Não há solicitações enviadas!</p>
          {sentFriendRequests.map((friend, i) =>
              <Col lg={4} sm={6} key={friend._id}>
                  <StatsCard bigIcon={(friend.image == null || friend.image.url == "NONE") ? <i className="pe-7s-users text-info" /> : <img style={{height:"60px", width:"60px", borderRadius:"25%", margin:"0px"}} src={`${friend.image.url}`} />}
                      statsText={friend.name}
                      statsValue={friend.email}
                      statsIconText={
                        <div>
                          <button type="button" class="btn btn-danger btn-sm" onClick={() => cancelFriendRequest(friend.email)}>Cancelar</button>
                        </div>
                      }
                  />
              </Col>
            )}
        </Row>
        <Row style={friendRow}>
          <h3>Solicitações Recebidas</h3>
          <p style={{visibility: receivedFriendRequests.length > 0 ? "hidden" : "visible"}}>Não há solicitações recebidas!</p>
          {receivedFriendRequests.map((friend, i) =>
              <Col lg={4} sm={6} key={friend._id}>
                  <StatsCard bigIcon={(friend.image == null || friend.image.url == "NONE") ? <i className="pe-7s-users text-info" /> : <img style={{height:"60px", width:"60px", borderRadius:"25%", margin:"0px"}} src={`${friend.image.url}`} />}
                      statsText={friend.name}
                      statsValue={friend.email}
                      statsIconText={
                        <div>
                          <button className="btn btn-primary btn-sm" onClick={() => acceptFriendRequest(friend.email)}>Aceitar</button>
                          <span style={{marginLeft: "4px"}}></span>
                          <button className="btn btn-danger btn-sm" onClick={() => refuseFriendRequest(friend.email)}>Recusar</button>
                        </div>
                      }
                  />
              </Col>
            )}
        </Row>
        <Row style={friendRow}>
        <h3>Lista de Amigos</h3>
        {friends.map((friend, i) =>
              <Col lg={4} sm={6} key={friend._id}>
                  <StatsCard bigIcon={(friend.image == null || friend.image.url == "NONE") ? <i className="pe-7s-users text-info" /> : <img style={{height:"60px", width:"60px", borderRadius:"25%", margin:"0px"}} src={`${friend.image.url}`} />}
                      statsText={friend.name}
                      statsValue={friend.email}
                      statsIconText={<button className="btn btn-danger  btn-sm" onClick={() => sendDeleteFriendRequest(friend.email)}>Deletar</button>}
                  />
              </Col>
            )}
        </Row>
      </Grid>
    </div>
  );
}

const friendRow = {
    marginBottom: "10px"
};