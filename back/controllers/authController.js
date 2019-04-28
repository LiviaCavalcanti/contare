const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/auth");


function generateToken(params = {}){
    return jwt.sign(params,authConfig.secret,{

        expiresIn: 86400
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
    
        }catch (err){
            return res.status(400).send({ error: "Ocorreu um erro inesperado!"});
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
         const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400,
         });
    
    
         res.send({ user , token: generateToken({id: user.id}),
             
         })
     }
        
}