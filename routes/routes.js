const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title:"Pagina Inicial"});
});

router.get('/add_users', (req, res) => {
    //nome do arquivo
    res.render('add_users', {title: "Adicionar usuário"})
})

module.exports = router; 