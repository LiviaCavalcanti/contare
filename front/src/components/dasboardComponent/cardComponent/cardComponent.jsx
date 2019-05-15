import React, { Component } from 'react';
import ModalComponent from '../modalComponent/modalComponent';


class CardComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            task: {}
        };

        this.detalheTask = this.detalheTask.bind(this);

    }

    detalheTask(task) {
        this.setState({
            modalShow: !this.state.modalShow,
            task: task
        })
    }

    render() {
        let modalClose = () => this.setState({ modalShow: false });

        return (
            <div className="list-task">
                {this.props.list.map((task, i) => {
                    return (
                        task.isNew ?

                            <div key={i} className="add-task">
                                <div className="task-content">
                                    <div>
                                        <p>X</p>
                                    </div>
                                </div>

                                <div className="task-name">
                                    <p>
                                        Adicionar Tarefa
                                    </p>
                                </div>
                            </div>
                        :
                            <div key={i} className="task" onClick={() => this.detalheTask(task)}>
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
                    onHide={modalClose}
                />
            </div>
        );
    }
}

export default CardComponent;
