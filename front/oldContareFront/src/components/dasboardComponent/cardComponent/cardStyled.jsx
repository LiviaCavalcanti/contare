import styled from 'styled-components'


const CardStyled = styled.div`

    height: 100%;
    overflow: auto;

    .add-expense{
        border: 1px solid #4a69a4;
        width: 31%;
        height: 32%;
        display: inline-block;
        margin: 3px;

        label{
            cursor: pointer;
        }

        .expense-content{
            height: 75%;
            background-color: #bfcbd8;
            padding: 10% 20% 0% 20%;
            cursor: pointer;

            div{
                height: 78%;
                background-color: #dfe5ec;
                text-align: center;
                line-height: 5.5;
            }
    
        }

    }
    
    .expense{
        border: 1px solid #4a69a4;
        width: 31%;
        height: 32%;
        display: inline-block;
        margin: 3px;
        cursor: pointer;

        .expense-content{
            height: 75%;
            background-color: #4a69a4;
            color: white;
            font-size: 14px;
            padding: 2% 0% 0% 5%;

            label{
                margin-bottom: 0px;
                font-weight: 700;
                cursor: pointer;
            }

            p{
                margin-top: -7px;
                margin-bottom: 8px;
            }
        }
    }

    .expense-not-pay{
        background-color: #dc3545 !important;
    }

    .expense-pay{
        background-color: #28a745 !important;
    }

    .expense-name{
        height: 25%;
        background-color: #bfcbd8;
        color: white;
        font-weight: 600;


        p{
            text-align: center;
        }
    }

    .expense:hover, .add-expense:hover{
        border: 1px solid #bfcbd8;
        
    }

    
    @media only screen and (min-width: 1000px) {
        .add-expense .expense-content div img{
               width: 30%;
           }
       }
   
       @media only screen and (max-width: 1000px) {
        .add-expense .expense-content div img{
               width: 60%;
        }
    }

`;

export default CardStyled;

