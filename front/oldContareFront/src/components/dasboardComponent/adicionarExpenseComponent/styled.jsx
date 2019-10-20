import styled from 'styled-components'


const AddExpenseStyled = styled.div`


    .teste{
        border: 2px solid blue;
    }

    .campo-pago{
       color: #0bd50b;
    }

    .campo-pagar{
        color: red;
    }

    .acao{
        text-align: center;
    }

    .icon-acao{
        width: 15px;
        margin-right: 9px;
        cursor: pointer;
        margin-top: 17px;
    }

    .modal-body{
        overflow: auto;
        max-height: 450px;
    }

    .remove-validacao{
        border: 1px solid #ced4da !important;
        background-image: none !important;
    }

    .display-block{
        display : block;
    }

    .display-none{
        display : none;
    }

`;

export default AddExpenseStyled;

