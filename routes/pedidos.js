const express = require('express');
const router = express.Router();

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return.status(500).send({error: error })}
        conn.query(
            'SELECT * FROM pedidos;',
            (error, result, fields) =>{
                if(error) {return res.status(500).send ({error: error})}
                const response = {
                    quantidade: result.length,
                    pedidos: result.map(pedido =>{
                        return {
                            id_pedido: pedido.id_pedido,
                            id_produto: pedido.id_produto,
                            quantidade: pedido.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido',
                                url: 'http://localhost:3000/pedidos/' + pedidos.id_pedido
                            }

                        }
                    })
                }
            }
        )
    })

    res.status(200).send({
        mensagem:'Retorna os pedidos'
    });
});

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {

    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }

    res.status(201).send({
        mensagem:'O pedido foi criado',
        pedidoCriado: pedido
    })
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido
    res.status(200).send({
         mensagem: 'Detalhes do pedido',
        id_pedido: id
     });
});

//EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem:'Pedido excluido'
    })
});

module.exports = router;