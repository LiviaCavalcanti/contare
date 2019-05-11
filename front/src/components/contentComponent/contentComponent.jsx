import React, { Component } from 'react';
import planoDeFundo from '../../images/planoDeFundo.jpg';
import "./contentComponent.css"

class ContentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="content">
                <img alt="background" src={planoDeFundo} />
                <div className="conteudo">
                    <this.props.component/>
                </div>
            </div>
        );
    }
}

export default ContentComponent;
