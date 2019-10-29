#!/bin/bash

# Este script cria um numero X de despesas para um determinado usuario
# O usuario eh definido no script auth.sh

X=25
baseUrl="http://localhost:8080/contare/user/expenses"
contentType="Content-Type: application/json"

#COLAR AO LADO DO BEARER O TOKEN FORNECIDO APÓS AUTENTICAR
auth="Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYjYzMTVhMjljZDU1NWY0MTNiZTM2NyIsImlhdCI6MTU3MjI3OTg5OSwiZXhwIjoxNTcyMzY2Mjk5fQ.vJc0wmqVwtIu5c3jRdJ3rmldQbRfm98SwQyzXL9zfHM"

categorias[0]="alimentação"
categorias[1]="transporte"
categorias[2]="saúde"
categorias[3]="segurança"
categorias[4]="outros"
categorias[5]="viagem"

RANDOM=$$

for i in $(seq 1 $X); do
    # O primeiro email no atributo listEmail deve ser o email do usuario logado      --->>             -->>            -->>            v v v v v v v v v v << ----
    expense='{"title": "'conta$i'","dueDate":"'$(date -Is -d "+$(($RANDOM%10+2)) days")'", "totalValue":'$(($RANDOM%100))',"listEmail":["teste1@teste.com"],"category":"'${categorias[$(($RANDOM%6))]}'"}'
    
    postExpense="$(curl -H "$auth" -X POST "$baseUrl" -H "$contentType"  -d "$expense" )"

    echo ${postExpense}
done