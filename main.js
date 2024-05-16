require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 4000; 

/*A função express.urlencoded({extended:false}) é um middleware do Express.js, 
um framework para Node.js utilizado para construir aplicações web e APIs. 
Este middleware é usado para lidar com dados enviados através de formulários HTML 
usando o método POST ou PUT. */
app.use(express.urlencoded({extended:false}));
app.use(express.json());


/*
O middleware express-session armazena os dados da sessão no servidor; ele salva apenas o 
ID da sessão no cookie, não os dados da sessão. 
Por padrão, ele usa armazenamento em memória e não é projetado para um ambiente de produção.
*/
app.use(session({
    secret:'minha chave secreta',
    saveUninitialized: true,
    resave: false, 
}));


app.use((req, res, next)=> {
    res.locals.message = req.session.message; 
    delete req.session.message; 
    next();
})

//set templates
app.set('view engine', 'ejs');


//conexão com o db
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection; 
db.on("error", (error)=> {
    console.log(error);
});
db.once("open", ()=> {
    console.log("banco de dados conectado!");
})

//para carregar as fotos de uploads
app.use(express.static("uploads"));
app.use(express.static(path.join(__dirname, 'scripts')));

//usando rotas
app.use("", require('./routes/routes'))

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta http://localhost:${PORT}`)
})