const User = require('../models/User')
const Expense = require('../models/Expense')
const mongoose = require('mongoose');
const request = require('request')
const chai      = require('chai')
const expect    = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should();
const requestAgent = require('supertest')
chai.use(chaiHttp)


describe('Testing registration routes', function(){

    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();           
        });        
    });


    it('save user without error', function(done) {
        var url = '/register'
        chai.request('http://localhost:8080/contare')
            .post(url)
            .send({'name':"Teste", 'email':"teste@mail.com", 'password':"teste"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
        
    });

});

describe('creating invites', function() {

    beforeEach( ( done ) => {
        
        var url = '/register'
        chai.request('http://localhost:8080/contare')
            .post(url)
            .send({'name':"Teste1", 'email':"teste1@mail.com", 'password':"teste1"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
    })

    beforeEach( ( done ) => {
        
        var url = '/register'
        chai.request('http://localhost:8080/contare')
            .post(url)
            .send({'name':"Teste2", 'email':"teste2@mail.com", 'password':"teste2"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
    })

    it('login', (done) => {
        var serverAgent = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste1',
            email:"teste1@mail.com", 
            password:"teste1"
        }
        var user_token;

        serverAgent
            .post('/authenticate')
            .send(user)
            .end( (err, res) => {
                if (err) return done(err)
                should.exist(res);
                user_token = res.body.token
                res.should.have.status(200)

                chai.request('http://localhost:8080/contare')
                    .post('/user/expenses')
                    .send({ title: 'expense test', listEmail: [{ payValue: 50 }, { email: "teste2@mail.com", payValue: 501 }] })
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, resnumber2) => {
                        should.exist(resnumber2);
                        chai.request('http://localhost:8080/contare')
                            .get('/user/expenses')
                            .set('Content-Type', 'application/json')
                            .set('x-access-token', user_token)
                            .end((err, resnumber3) => {
                                should.exist(resnumber3);
                                resnumber3.should.have.status(200);
                                resnumber3.body.should.be.a('array');
                                expect(resnumber3.body[0].title).to.equal('expense test')
                                // expect(resnumber3.body[0].participants[0].email).to.equal('teste2@mail.com')
                                // console.log(resnumber3.body[0].participants)
                                done()
                            })
                    })
            })
    })

    // after( (done) => {
    //     serverAgent.get('/user/expenses')
    // })
})

describe('creating invite using invalid guesting', function() {

    it('login', (done) => {
        var serverAgent = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste1',
            email:"teste1@mail.com", 
            password:"teste1"
        }
        var user_token;

        serverAgent
            .post('/authenticate')
            .send(user)
            .end( (err, res) => {
                if (err) return done(err)
                should.exist(res);
                user_token = res.body.token
                res.should.have.status(200)

                chai.request('http://localhost:8080/contare')
                    .post('/user/expenses')
                    .send({ title: 'ExpenseTest', listEmail: [{ payValue: 150 }, { email: "teste3@mail.com", payValue: 510 }] })
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, resnumber2) => {
                        should.exist(resnumber2);
                        resnumber2.body.should.be.a('object');
                        expect(resnumber2.body).to.be.empty
                        done()
                    })
            })
    })
})