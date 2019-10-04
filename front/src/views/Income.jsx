import React, {useState} from "react"
import {Grid, Row, Col } from "react-bootstrap"
import {StatsCard} from "components/StatsCard/StatsCard.jsx"
import {Button} from "react-bootstrap"
import CreateIncome from '../components/Income/CreateIncome'

export default function() {
    const [showModal, setShowModal] = useState(false)
    const [updateList, SetUpdateList] = useState(true)

    return (
        <div className="content">
            <CreateIncome show={showModal} setShow={setShowModal} created={SetUpdateList} />
            <Grid fluid>
                <Row>
                    <Button variant={"primary"} className={"text-center"} onClick={() => setShowModal(true)}>
                        Adicionar Renda
                    </Button>
                </Row>
                <br/>
                <Row>
                    <Col lg={4} sm={6}>
                        <StatsCard
                            bigIcon={<i className="pe-7s-server text-warning" />}
                            statsText="Renda Mensal"
                            statsValue="R$4.500,00"
                            statsIcon={<i className="fa fa-refresh" />}
                            statsIconText="Atualizado há pouco"
                        />
                    </Col>
                </Row>
            </Grid>
        </div>
    )
}
