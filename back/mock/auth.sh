#!/bin/bash

authenticateUrl="http://localhost:8080/contare/authenticate"
credentials='{"email":"teste1@teste.com","password":"1234"}' # adidionar credenciais do usuario 
                                                             # que deseja usar   
authenticate="$(curl -X POST "$authenticateUrl" -H "$contentType" -d "$credentials")"
echo ${authenticate}

#copiar token retornado ao executar este scripit e colar ele quando for necessário nos outros scripts