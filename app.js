const express = require('express');
const cors = require('cors');
const app = express();
var bcrypt = require('bcryptjs');

//const Home = require('./models/Home');
const Cadastrar = require('./models/Cadastrar.js');
const Produto = require('./models/Produto.js');
const db = require('./models/db');

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();
});
/*
app.get('/', async(req, res) => {
    return res.json({
        erro: false,
        datahome: {
            text_one: "Temos a solução",
            text_two: "que a sua empresa precisa.",
            text_three: "Podemos ajudar a sua empresa!",
            btn_title: "Entrar em Contato",
            btn_link: "http://localhost:3000/contato"
        }
    });
});
*/
app.post("/cadastrar", async(req, res)=>{


    //const { email, senha, confirmacaosenha} = req.body;
    var data = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(data.senha, salt);
  
    data.senha = hash;

    /*if(senha !== confirmacaosenha){
        return res.status(400).json({
            erro: true, 
            mensagem: "Confirmação de senha diferentes"
        });
    }*/

   await Cadastrar.create(data).
   then( (cadastrar)=>{
    return res.json({
        erro: false,
        mensagem: "Cadastro realizado com sucesso"
    });
   }).catch(()=>{
    return res.status(400).json({
        erro: true,
        mensagem: "Error : Cadastro não foi realizado com sucesso"
    });
   });
});

app.post("/login", async(req,res)=>{
    var data = req.body;
    var usuario = await Cadastrar.findOne({where: {email: data.email}});
    if(usuario === null){ 
        //console.log("Entrou IF === null");
        return res.status(400).json({
            erro: true,
            mensagem: "Login não foi realizado com sucesso"
        });   
    }
    else{
        var senhaValida = bcrypt.compareSync(data.senha, usuario.senha);
        //console.log("Entrou ELSE === null");
        if(senhaValida){
            //console.log("Entrou IF senha valida");
            return res.json({
                erro: false,
                mensagem: "Login realizado com sucesso"
            });
        }
        else{
            return res.status(400).json({
                erro: true,
                mensagem: "ERRO : Login não foi realizado com sucesso"
            }); 
        }
    }
});

app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});