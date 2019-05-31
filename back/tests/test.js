const User = require('../models/User')
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
                    .send({ title: 'ExpenseTest', listEmail: [{ payValue: 0 }] })
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, resnumber2) => {
                        should.exist(resnumber2);
                        done()
                    })
            })
    })
})