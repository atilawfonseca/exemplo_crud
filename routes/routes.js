const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');
const { type } = require('os');


//upload de imagem
var store = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads" );
    }, 
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_'+ file.originalname);
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

router.get('/', async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('index', {
            title: "Página Inicial",
            users: users,
        })
    } catch (error) {
        res.json({message: error.message})
    }
});

router.get('/add_users', async (req, res) => {
    //nome do arquivo
    res.render('add_users', { title: "Adicionar usuário" })
})

//editar usuário
//depois dessa etapa precisa atualizar os dados do usuário
router.get('/edit/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const user = await User.findById(id);
        res.render("edit_users", {
            title: "Editar usuario",
            user: user,
        })
        
    } catch (error) {
        res.redirect('/');
    }
    
})

//atualizar rota do usuário
router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id; 
    let new_image = '';

    if(req.file) {
        new_image = req.file.filename; 

        try {
            fs.unlinkSync("./uploads/"+req.body.old_image);
        } catch (error) {
            console.log(error)
        }
    }
    else {
        new_image = req.body.old_image; 
    }

    try {
        const result = await User.findByIdAndUpdate(id, {
            name: req.body.name, 
            email: req.body.email, 
            telefone: req.body.phone, 
            image: new_image, 
        });

        req.session.message = {
            type: 'success', 
            message: 'Usuário atualizado com sucesso.'
        }
        res.redirect('/')
        
        
    } catch (error) {
        res.json({message: error.message, type:'danger'})
    }
} ) 

//DELETAR USUARIO
router.get('/delete/:id', async (req, res)=> {
    let id = req.params.id; 
    try {
        const result = await User.findByIdAndDelete(id);
        
        if (result.image != '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (error) {
                console.log(error);
            }
        }

        req.session.message = {
            type: 'success',
            message: 'Usuário deletado com sucesso!'
        };
        
        res.redirect('/');
    } catch (erro) {
        res.json({
            message: erro.message
        });
    }
    

})

module.exports = router; 
