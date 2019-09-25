import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";

import CustomButton from "components/CustomButton/CustomButton";

class Dashboard extends Component {
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <h3>Rendas Periódicas</h3>
          </Row>
          <Row>
            <h4>Mensais</h4>
          </Row>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Emprego 1"
                statsValue="R$4.500,00"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Atualizado há pouco"
              />
            </Col>
            <Col lg={3} sm={6}>
              <Card>
                <div className="button-container">
                  Adicionar Renda Periódica
                </div>
              </Card>
            </Col>
            
          </Row>
          <Row>
            <h3>Rendas Únicas</h3>
          </Row>
          <Row>
            <Col lg={3} sm={6}>
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
    );
  }
}

export default Dashboard;
