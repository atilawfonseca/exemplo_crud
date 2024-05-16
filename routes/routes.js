const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

//upload de imagem
var store = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads" );
    }, 
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now + '_'+ file.originalname);
    }
});

var upload = multer({
    storage: store, 
}).single('image');


//inserir usuário no banco de dados
router.post('/add', upload, async (req, res)=> {
    const user = new User({
        name: req.body.name, 
        email: req.body.email,
        telefone: req.body.phone, 
        image:req.file.filename, 
    });
    try {
        await user.save();
        req.session.message = {
            type: "success",
            message: "Usuário adicionado com sucesso!"
        }
        res.redirect('/');
    }
    catch(erro) {
        console.error("Erro ao salvar os dados: ", erro);
        res.json({message: erro.message, type: "danger"})
    }
    
})

//paginas do site

router.get('/', (req, res) => {
    res.render('index', {title:"Pagina Inicial"});
});

router.get('/add_users', (req, res) => {
    //nome do arquivo
    res.render('add_users', {title: "Adicionar usuário"})
})

module.exports = router; 