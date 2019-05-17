import React, { Component } from 'react';
import CardComponent from './cardComponent/cardComponent';
import DahsboardStyled from './dashboardStyled';
import {verifyUser} from '../../services/index'
import { Container, Row, Col } from 'react-bootstrap';


class DashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            user: {}
        };

        this.getUserFromToken = this.getUserFromToken.bind(this)
    }

    getUserFromToken = () => {
        const token = localStorage.getItem("token-contare")
        verifyUser(token, function(response){
            this.setState({user:response})
        }.bind(this))
     }

     componentWillMount() {
        this.getUserFromToken()
     }

    componentDidMount() {
        let list = [];
        for (let index = 0; index < 5; index++) {
            list.push({
                isNew : false,
                name: "Nome da task " + index
            })
        }
        list.push({
            isNew : true
        })
        this.setState({ list: list });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col xs={3} style={{backgroundColor:"blue"}}><h1>Nome do usuário: {this.state.user.name}</h1></Col>

                <Col  style={{backgroundColor:"red"}}>
            <DahsboardStyled>
                <CardComponent list={this.state.list} />
            </DahsboardStyled>
            </Col>

            <Col xs={3} style={{backgroundColor:"blue"}}> <h1>Tarefas a vencer</h1></Col>
            </Row>
            </Container>

            
        );
    }
}

export default DashboardComponent;
