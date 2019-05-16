import React, { Component } from 'react';
import ModalComponent from '../modalComponent/modalComponent';
import plus from '../../../images/plus.svg';
import CardStyled from './cardStyled';

class CardComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            task: {},
            acao: ""
        };

        this.executaAcaoTask = this.executaAcaoTask.bind(this);

    }

    executaAcaoTask(task, acao) {
        console.log("acao ", acao);
        this.setState({
            modalShow: !this.state.modalShow,
            task: task,
            acao: acao
        })
    }

    render() {
        let modalClose = () => this.setState({ modalShow: false });

        return (
            <CardStyled>
                {this.props.list.map((task, i) => {
                    return (
                        task.isNew ?

                            <div key={i} className="add-task" onClick={() => this.executaAcaoTask(task, 'add')}>
                                <div className="task-content">
                                    <div>
                                        <img alt="background" src={plus} />
                                    </div>
                                </div>

                                <div className="task-name">
                                    <p>
                                        Adicionar Tarefa
                                    </p>
                                </div>
                            </div>
                            :
                            <div key={i} className="task" onClick={() => this.executaAcaoTask(task, "detalhar")}>
                                <div className="task-content">
                                </div>

                                <div className="task-name">
                                    <p>
                                        {task.name}
                                    </p>
                                </div>
                            </div>

                    )
                })}
                <ModalComponent
                    show={this.state.modalShow}
                    task={this.state.task}
                    acao={this.state.acao}
                    onHide={modalClose}
                />
            </CardStyled>
        );
    }
}

export default CardComponent;
