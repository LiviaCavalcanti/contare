import React, {useState, useEffect} from "react";
import { Grid, Row, Col, Table, Button } from "react-bootstrap";

import AddFriend from "components/Friends/AddFriend.jsx";
import StatsCard from "components/StatsCard/StatsCard";

import { getFriends, deleteFriend } from "services/userService";
import { initializeConnection } from 'services/ConnectionService';

var token = localStorage.getItem("token-contare");
var socket = null;

export default function(props) {

  const [showAddFriendModal, setShowAddFriendModal] = useState(false)
  const [updateList, setUpdateList] = useState(true)
  const [friends, setFriends] = useState([])
  const [cachedFriends, setCachedFriends] = useState([])
  const [sorting, setSorting] = useState('Data do Gasto')
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    if (initializing) {
        socket = initializeConnection()
        socket.on("updateexpense", () => {
            props.setUpdate(true)
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
    }
  }, [updateList])

  useEffect(() => {
    sortFriends()
}, [cachedFriends, sorting])

function sortFriends() {
  if (cachedFriends) {
    setFriends(cachedFriends.slice().sort((inc1, inc2) => {
        if (inc1.name.toLowerCase() < inc2.name.toLowerCase()) return -1
        return 1
    }))
  }
}

function sendDeleteFriendRequest(friendEmail) {
  console.log(friendEmail, token)
  deleteFriend(friendEmail, token)
}

  return (
    <div className="content admin-flex-container-content">
      <AddFriend show={showAddFriendModal} setShow={setShowAddFriendModal} created={setUpdateList} />
      <Grid fluid>
        <Row>
            <Button variant={"primary"} className={"text-center"} onClick={() => setShowAddFriendModal(true)}>
              Adicionar Amigo
            </Button>
          </Row>
          <br/>
        <Row>
        {friends.map((friend, i) =>
              <Col lg={4} sm={6} key={friend._id}>
                  <StatsCard bigIcon={<i className="pe-7s-users text-info" />}
                      statsText={friend.name}
                      statsValue={friend.email}
                      statsIconText={<span className="clickable" onClick={() => sendDeleteFriendRequest(friend.email)}>Deletar</span>}
                  />
              </Col>
            )}
        </Row>
      </Grid>
    </div>
  );
}
