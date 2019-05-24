import styled from 'styled-components'


const DetalharExpenseStyled = styled.div`

    .campo-pago{
       color: #0bd50b;
    }

    .campo-pagar{
        color: red;
    }

    .div-title{
        display: inline;
    }

    .div-acao{
        float: right;

        img{
            cursor: pointer;
            width: 17px;
            margin-right: 14px;
        }
    }

    .modal-title{
        width: 100% !important;
    }

    .div-dado{
        width: 50%;
        display: inline-block;
        margin-bottom: 0px;
        
        label{
            width: 44%;
        }
        p{
            display: inline;
            margin-bottom: 5px;
        }
    }

    .p-title{
        margin-top: 29px;
        font-size: 20px;
        font-weight: 600;
    }

    .modal-body{
        overflow: auto;
        max-height: 450px;
    }

`;

export default DetalharExpenseStyled;

