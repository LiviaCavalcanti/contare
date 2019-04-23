import React, { Component } from 'react';
import planoDeFundo from '../../images/planoDeFundo.jpg';
import "./contentComponent.css"


class ContentComponent extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div className="content">
                <img alt="background" src={planoDeFundo} />
                <div className="conteudo">

                    Lorem ipsum ultrices velit faucibus donec adipiscing nulla arcu consectetur velit etiam donec, aliquet sapien purus quisque tempor auctor habitant imperdiet lacus at mollis, nec sit venenatis hendrerit primis taciti facilisis aenean mattis lorem vitae. cras integer morbi id nunc per etiam class per, commodo turpis morbi iaculis at lectus sociosqu, fringilla magna sociosqu dictumst non massa taciti. cursus potenti nibh in dictum torquent cras sagittis molestie, scelerisque curae elementum at diam egestas placerat curabitur, posuere iaculis ultrices congue dolor integer inceptos. interdum maecenas sit neque bibendum nec quisque massa scelerisque, dui nostra in blandit conubia accumsan suspendisse, eros aliquam massa justo sagittis ullamcorper feugiat.

                </div>
            </div>
        );
    }
}

export default ContentComponent;
