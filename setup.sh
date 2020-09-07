#!/bin/bash

cd front
npm i
npm audit fix
cd ../back
npm i
npm audit fix
