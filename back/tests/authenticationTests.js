const User = require('../models/User')
const mongoose = require('mongoose');
const request = require('request')
const chai      = require('chai')
const expect    = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should();

chai.use(chaiHttp)

/* --- DICAS

    para rodar esta suíte de testes execute o comando:

    mocha --timeout 5000 'tests/authenticationTests.js'

    para rodar outra suite de testes, basta trocar o nome do arquivo no fim do comando.

    Esse mocha ele roda os testes e fica executando, sendo necessário fazer um CTRL+C para matar o processo dele.
    Mas mesmo assim, um outro processo dele fica rodando escutando a porta 8080, aí quando eu rodava o teste de novo
    ele executava normal mas dava um erro indicando que havia um outro processo escutando a porta 8080, e era o processo
    dos testes que havia rodado anteriormente.

    Para evitar esse erro, toda vez que rodava os testes executava o seguinte comando:

    CTRL+C para voltar ao shell
    
    lsof -i :8080 -> para descobrir o pid do processo (ou processoS) que estavam escutando na porta 8080 e 
    sudo kill -9 PID -> neste processo para então rodar os testes novamente sem dar aquele erro.
*/

describe('Some Tests on invitations and authenticantion', function(){

    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();           
        });        
    });


    it('get all emails in an empty db', function(done) {
        
        chai.request('http://localhost:8080/contare')
            .get('/user/getAll')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(401)
                done();
            })
    });

    it('save user without error', function(done) {
        
        chai.request('http://localhost:8080/contare')
            .post('/register')
            .send({"name":"Teste", "email":"teste@mail.com", "password":"teste"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done();
            })
    });

    it('saving two times the same user', function(done) {
        
        chai.request('http://localhost:8080/contare')
            .post('/register')
            .send({"name":"Teste", "email":"teste@mail.com", "password":"teste"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)

                chai.request('http://localhost:8080/contare')
                    .post('/register')
                    .send({"name":"Teste", "email":"teste@mail.com", "password":"teste"})
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        should.exist(res);
                        res.should.have.status(400)
                        done();
                    })
            })

    });

    it('authenticating an unexistent user', function(done) {
        
        chai.request('http://localhost:8080/contare')
            .post('/register')
            .send({"name":"Teste", "email":"teste@mail.com", "password":"teste"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)

                chai.request('http://localhost:8080/contare')
                    .post('/authenticate')
                    .send({"email":"none@mail.com","password":"none"})
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        should.exist(res);
                        res.should.have.status(400);
                        done();
                    })
            })

    });

    it('authenticating an EXISTENT user with wrong password', function(done) {
    
        chai.request('http://localhost:8080/contare')
            .post('/register')
            .send({name:"Teste", email:"teste@mail.com", password:"teste"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)

                chai.request('http://localhost:8080/contare')
                    .post('/authenticate')
                    .send({email:"teste@mail.com",password:"none"})
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        should.exist(res);
                        res.should.have.status(400);
                        done();
                    })
            })

    });

    it('authenticating an EXISTENT user without errors', function(done) {

        chai.request('http://localhost:8080/contare')
            .post('/register')
            .send({"name":"Teste", 'email':"teste@mail.com", "password":"teste"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200);

                chai.request('http://localhost:8080/contare')
                .post('/authenticate')
                .send({'email':"teste@mail.com",'password':"teste"})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(200);
                    done();
                })
            })
    });
});