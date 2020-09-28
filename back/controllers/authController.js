const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/auth");
const {OAuth2Client} = require("google-auth-library")

const client = new OAuth2Client(authConfig.google_api_key)

function generateToken(params = {}){
    return jwt.sign(params,authConfig.secret,{

        expiresIn: 86400 // expira em 24 horas
    });
}

module.exports = {
    async register(req,res) {
        const { email } = req.body;
        try{
            // se o email ja for usado o usuario n pode se cadastrar 
            if(await User.findOne({ email }))
                return res.status(400).send({ error: "Já existe um usuário cadastrado com este email"});
            
            const user = await User.create(req.body);
            user.password = undefined;
            return res.send({ user ,  token: generateToken({id: user.id}),  sucess: "Cadastrado com sucesso!"});
    
        } catch (err){
            return res.status(400).send({ error: err});
        }
    },
    
     async authenticate(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne( { email } ).select("+password");
    
        if(!user)
            return res.status(400).send({ error: "Usuário não encontrado" });
            
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: "Senha inválida" });
    
        user.password = undefined;
           
        return res.send({ user , token: generateToken({id: user.id}),})
     },

     async googleAuthenticate(req, res) {
        const { googleToken } = req.body;
        client.verifyIdToken({idToken: googleToken, audience: authConfig.google_api_key}).then(async response => {
            const {email_verified, name, email, picture} = response.payload
            if (email_verified) {
                const user = await User.findOne( { email } )
                
                if(!user) {
                    const password = email+authConfig.secret
                    const image = {url: picture}
                    const createdUser = await User.create({email, password, name, image});
                    createdUser.password = undefined
                    return res.send({ createdUser , token: generateToken({id: createdUser.id}),  sucess: "Cadastrado com sucesso!"});
                } else {
                    user.password = undefined;
                    return res.send({ user , token: generateToken({id: user.id}),})
                }

            } else {
                return res.status(400).send({ error: "É necessário que sua conta google possua o e-mail verificado!" });
            }
        }).catch(error => {
            return res.status(400).send({ error: "Houve um problema ao validar o token do Google" });
        })
     }
}