import React, { Component } from 'react';
import plus from '../../../images/plus.svg';
import CardStyled from './cardStyled';
import Modal from 'react-bootstrap/Modal'
import DetalharTaskComponent from '../detalharTaskComponent/detalharTaskComponent';
import AdicionarTaskComponent from '../adicionarTaskComponent/adicionarTaskComponent';


class CardComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalDetalharShow: false,
            modalAdicionarShow: false,
            task: {},
        };

        this.abreDetalheTask = this.abreDetalheTask.bind(this);
        this.abreAdicionarTask = this.abreAdicionarTask.bind(this);

    }

    abreDetalheTask(task) {
        this.setState({
            modalDetalharShow: !this.state.modalDetalharShow,
            task: task,
        })
    }

    abreAdicionarTask() {
        this.setState({
            modalAdicionarShow: !this.state.modalAdicionarShow
        })
    }

    render() {
        let modalDetalheClose = () => this.setState({ modalDetalharShow: false });
        let modalAdicionaClose = () => this.setState({ modalAdicionarShow: false });

        return (
            <CardStyled>
                {this.props.list.map((task, i) => {
                    return (
                        task.isNew ?

                            <div key={i} className="add-task" onClick={() => this.abreAdicionarTask()}>
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
                            <div key={i} className="task" onClick={() => this.abreDetalheTask(task)}>
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

                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-detalhe"
                    centered
                    show={this.state.modalDetalharShow}
                >
                    <DetalharTaskComponent onHide={modalDetalheClose} task={this.state.task} />

                </Modal>

                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-adicionar"
                    centered
                    show={this.state.modalAdicionarShow}
                >
                    <AdicionarTaskComponent onHide={modalAdicionaClose} />

                </Modal>
            </CardStyled>
        );
    }
}

export default CardComponent;
