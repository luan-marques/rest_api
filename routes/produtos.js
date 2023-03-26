const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {


    res.status(200).send({

        mensagem: 'Retorna todos os produtos'

    });


});

router.post('/', (req, res, next) => {

    const produto = {

        nome: req.body.nome,
        preco: req.body.preco

    };

    res.status(201).send({
        mensage: 'Insere um produto',
        produtoCriado: produto


    });

});


router.get('/:id_produto',(req,res,next)=> {
const id = res.params.id_produto
if(id === 'especial'){
    res.status(200).send({

        mensage: 'vc descobriu o ID',
        id: id


    });

} else{

    res.status(200).send({

        mensage: 'Passou um ID',
        id : id
        
        });

}




});

router.patch('/', (req, res, next) => {

    res.status(201).send({
        mensge: 'Produto alterado'


    });

});

router.delete('/', (req, res, next) => {

    res.status(201).send({
        mensge: 'Produto excluido'


    });

});

module.exports = router;