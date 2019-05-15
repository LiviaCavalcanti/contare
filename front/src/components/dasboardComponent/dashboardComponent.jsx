import React, { Component } from 'react';
import "./dashboardComponent.css"
import CardComponent from './cardComponent/cardComponent';

class DashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }

    componentDidMount() {
        let list = [];
        for (let index = 0; index < 11; index++) {
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
            <div className="dashboard">
                <CardComponent list={this.state.list} />
            </div>
        );
    }
}

export default DashboardComponent;
