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
        this.formataData = this.formataData.bind(this);

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

    formataData(d){
        var date = new Date(d);
        let data = date.getDate().toLocaleString().length > 1 ? date.getDate() + 1 : '0'+date.getDate();
        let mes = (date.getMonth() + 1).toLocaleString().length > 1 ? date.getMonth() + 1 : '0'+ (date.getMonth() + 1);
        let ano = date.getFullYear();
        return `${data}/${mes}/${ano}`;
    }

    render() {
        let modalDetalheClose = () => this.setState({ modalDetalharShow: false });
        let modalAdicionaClose = () => this.setState({ modalAdicionarShow: false });

        return (
            <CardStyled>
                {this.props.list.map((task, i) => {
                    var fd = this.formataData;

                    function formataData(data){
                       return fd(data);

                    }

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
                                    
                                    <label>Data de Criação:</label>
                                    <p>{formataData(task.createdAt)}</p>
                                    
                                    <label>Data de Vencimento:</label>
                                    <p>{formataData(task.dueDate)}</p>

                                    <label>Valor:</label>
                                    <p>R$ {task.participants[0].payValue}</p>

                                </div>

                                <div className="task-name">
                                    <p>
                                        {task.title}
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
