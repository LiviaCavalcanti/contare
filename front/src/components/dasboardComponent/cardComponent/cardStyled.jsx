import styled from 'styled-components'


const CardStyled = styled.div`

    height: 100%;
    overflow: auto;

    .add-task{
        border: 1px solid #4a69a4;
        width: 29%;
        height: 32%;
        display: inline-block;
        margin: 3px;

        .task-content{
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
    
    .task{
        border: 1px solid #4a69a4;
        width: 29%;
        height: 32%;
        display: inline-block;
        margin: 3px;
        cursor: pointer;

        .task-content{
            height: 75%;
            background-color: #4a69a4;
        }
    }


    .task-name{
        background-color: #bfcbd8;
        height: 25%;
        
        p{
            text-align: center;
        }
    }

    .task:hover, .add-task:hover{
        border: 1px solid #bfcbd8;
        
    }

    
    @media only screen and (min-width: 1000px) {
        .add-task .task-content div img{
               width: 30%;
           }
       }
   
       @media only screen and (max-width: 1000px) {
        .add-task .task-content div img{
               width: 60%;
        }
    }

`;

export default CardStyled;

