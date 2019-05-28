import React, { Component } from 'react';
import CardComponent from './cardComponent/cardComponent';
import DahsboardStyled from './dashboardStyled';
import { verifyUser } from '../../services/index'
import { Container, Row, Col } from 'react-bootstrap';
import UserProfile from '../dasboardComponent/userProfileComponent/userProfileComponent'
import { withRouter } from 'react-router';
import { getExpenses } from '../../services/index';




class DashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            user: {}
        };

        this.getUserFromToken = this.getUserFromToken.bind(this)
        this.getExpense = this.getExpense.bind(this)
    }

    getUserFromToken = () => {
        const token = localStorage.getItem("token-contare")
        if (token === null || token === undefined) {
            this.props.history.push("/")
        }
        verifyUser(token, function (response) {
            this.setState({ user: response })
        }.bind(this))
    }

    componentWillMount() {
        this.getUserFromToken()
    }

    componentDidMount() {
        this.getExpense();
    }

    async getExpense() {

        let listaRetorno = await getExpenses(localStorage.getItem("token-contare"));
        if(!Array.isArray(listaRetorno)){
            return;
        }
        let list = [];
        
        listaRetorno.forEach(element => {
            let aux = {};
            aux = element;
            aux.isNew = false;
            list.push(aux);
        });

        list.push({
            isNew: true
        })
        this.setState({ list: list });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col xs={12} md={3}>
                        <UserProfile user={this.state.user} list={this.state.list} />
                    </Col>
                    <Col style={{ padding: "0" }}>
                        <DahsboardStyled>
                            <CardComponent getExpense={this.getExpense} list={this.state.list} />
                        </DahsboardStyled>
                    </Col>

                    <Col xs={12} md={3}> <h1>Tarefas a vencer</h1></Col>
                </Row>
            </Container>


        );
    }
}

export default withRouter(DashboardComponent);
