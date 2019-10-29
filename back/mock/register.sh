#!/bin/bash

baseUrl="http://localhost:8080/contare/register"
contentType="Content-Type: application/json"

echo "Mocking contare bd at url $baseUrl  ..."

 for i in $(seq 1 25); do
    data='{"name": "'teste$i'", "email":"'teste$i@teste.com'","password":"1234"}'
    req="$(curl -X POST "$baseUrl" -H "$contentType" -d "$data")"
    echo "${req}"
done

