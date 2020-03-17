import React, {useState} from "react"
import { Grid, Row, Col, Table, Button } from "react-bootstrap";

import AddFriend from "components/Friends/AddFriend.jsx";
import Card from "components/Card/Card.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";
import StatsCard from "components/StatsCard/StatsCard";

export default function() {

  const [showModal, setShowModal] = useState(false)
  const [updateList, setUpdateList] = useState(true)

  return (
    <div className="content admin-flex-container-content">
      <AddFriend show={showModal} setShow={setShowModal} created={setUpdateList} />
      <Grid fluid>
        <Row>
          <Button variant={"primary"} className={"text-center"} onClick={() => setShowModal(true)}>
                  Adicionar Amigo
              </Button>
          </Row>
          <br/>
          <Row>
              {/* <ListExpenses update={updateList} setUpdate={setUpdateList} setTotalExpense={setTotalExpense} /> */}
          </Row>
        <Row>
          <Col md={12}>
            <Card
              title="Lista de Amigos"
              // category="(Dados gerados aleatoriamente, por enquanto, by Rafael)"
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table striped hover>
                  <thead>
                    <tr>
                      {thArray.map((prop, key) => {
                        return <th key={key}>{prop}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {tdArray.map((prop, key) => {
                      return (
                        <tr key={key}>
                          {prop.map((prop, key) => {
                            return <td key={key}>{prop}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              }
            />
          </Col>

          <Col md={12}>
            <StatsCard
              plain
              title="Striped Table with Hover"
              category="Here is a subtitle for this table"
              ctTableFullWidth
              ctTableResponsive
              content={
                <Table hover>
                  <thead>
                    <tr>
                      {thArray.map((prop, key) => {
                        return <th key={key}>{prop}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {tdArray.map((prop, key) => {
                      return (
                        <tr key={key}>
                          {prop.map((prop, key) => {
                            return <td key={key}>{prop}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              }
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
}
