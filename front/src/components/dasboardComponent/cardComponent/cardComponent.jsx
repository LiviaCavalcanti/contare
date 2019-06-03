import React, { Component } from 'react';
import plus from '../../../images/plus.svg';
import CardStyled from './cardStyled';
import Modal from 'react-bootstrap/Modal'
import AdicionarExpenseComponent from '../adicionarExpenseComponent/adicionarExpenseComponent';
import DetalharExpenseComponent from '../detalharExpenseComponent/detalharExpenseComponent';

class CardComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalDetalharShow: false,
            modalAdicionarShow: false,
            expense: {},
        };

        this.abreDetalheExpense = this.abreDetalheExpense.bind(this);
        this.abreAdicionarExpense = this.abreAdicionarExpense.bind(this);
        this.formataData = this.formataData.bind(this);
        this.updateCard = this.updateCard.bind(this);

    }

    abreDetalheExpense(expense) {
        this.setState({
            modalDetalharShow: !this.state.modalDetalharShow,
            expense: expense,
        })
    }

    abreAdicionarExpense() {
        this.setState({
            modalAdicionarShow: !this.state.modalAdicionarShow
        })
    }

    formataData(d){
        var date = new Date(d);
        let data = date.getDate().toLocaleString().length > 1 ? date.getDate() : '0'+date.getDate();
        let mes = (date.getMonth() + 1).toLocaleString().length > 1 ? date.getMonth() + 1 : '0'+ (date.getMonth() + 1);
        let ano = date.getFullYear();
        return `${data}/${mes}/${ano}`;
    }

    updateCard(){
        this.props.getExpense();
        this.setState({ modalAdicionarShow: false, modalDetalharShow: false })
    }

    render() {
        let modalDetalheClose = () => this.setState({ modalDetalharShow: false });
        let modalAdicionaClose = () => this.setState({ modalAdicionarShow: false });

        return (
            <CardStyled>
                {this.props.list.map((expense, i) => {
                    var fd = this.formataData;

                    function formataData(data){
                       return fd(data);

                    }

                    return (
                        expense.isNew ?

                            <div key={i} className="add-expense" onClick={() => this.abreAdicionarExpense()}>
                                <div className="expense-content">
                                    <div>
                                        <img alt="background" src={plus} />
                                    </div>
                                </div>

                                <div className="expense-name">
                                    <p>
                                        Adicionar Despesa
                                    </p>
                                </div>
                            </div>
                            :

                           
                            <div key={i} className="expense" onClick={() => this.abreDetalheExpense(expense)}>
                                <div className="expense-content">
                                    
                                    <label>Data de Criação:</label>
                                    <p>{formataData(expense.createdAt)}</p>
                                    
                                    <label>Data de Vencimento:</label>
                                    <p>{formataData(expense.dueDate)}</p>

                                    <label>Valor:</label>
                                    <p>R$ {expense.participants.length > 0 && String(expense.participants[0].payValue).replace(".", ",")}</p>

                                </div>

                                <div className={ expense.participants.length > 0 && "expense-name " + (expense.participants[0].status ? "expense-pay" : "expense-not-pay")}>
                                    <p>
                                        {expense.title}
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
                    <DetalharExpenseComponent updateCard={this.updateCard} onHide={modalDetalheClose} expense={this.state.expense} />

                </Modal>

                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-adicionar"
                    centered
                    show={this.state.modalAdicionarShow}
                >
                    <AdicionarExpenseComponent updateCard={this.updateCard} onHide={modalAdicionaClose} />

                </Modal>
                

            </CardStyled>
        );
    }
}

export default CardComponent;
