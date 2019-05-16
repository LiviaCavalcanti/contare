import React, { Component } from 'react';
import CardComponent from './cardComponent/cardComponent';
import DahsboardStyled from './dashboardStyled';


class DashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
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
            <DahsboardStyled>

                <CardComponent list={this.state.list} />
            </DahsboardStyled>
        );
    }
}

export default DashboardComponent;
