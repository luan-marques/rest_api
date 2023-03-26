const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {


    res.status(200).send({

        mensagem: 'Retorna os pedidos'

    });


});

router.post('/', (req, res, next) => {

    const pedido = {

        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }

    res.status(201).send({
        mensge: 'Pedido criado',
        pedidoCriado: pedido


    });

});


router.get('/:id_produto',(req,res,next)=> {
const id = res.params.id_produto
res.status(200).send({

mensage: 'Detalhes do pedido',
 id_pedido: id

});

});


router.delete('/', (req, res, next) => {

    res.status(201).send({
        mensge: 'Pedido excluido'


    });

});

module.exports = router;