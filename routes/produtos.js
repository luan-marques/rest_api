
const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PRODUTOS
//router.get('/', (req, res, next) => {
//     res.status(200).send({
//         mensagem:'Retorna todos os produtos'
//     });
router.get('/', (req, res, next) => {
mysql.getConnection((error, conn)=> {
    if(error) {return res.status(500).send({error: error})}
    conn.query(
        'SELECT * FROM Produtos;',

        (error, resultado, field) =>{
            if(error) {return res.status(500).send({ error: error })}
            const response = {
                quantidade: resultado.length,
                Produtos: resultado.map(prod =>{
                    return {
                        id_produto: prod.id_produto,
                        nome: prod.nome,
                        preco: prod.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos/' + prod.id_produto
                        }
                    }
                })
            }

        return res.status(200).send({response})
        }

    )
    

});
});


// INSERE UM PRODUTO
router.post('/', (req, res, next) => {

mysql.getConnection((error, conn) => {
  if(error) {return res.status(500).send({error: error})}
    conn.query(
        'INSERT INTO Produtos (nome,preco) VALUES(?,?)',
        [req.body.nome, req.body.preco],
        (error, resultado, field) => {
            conn.release(); 

            if(error) {return res.status(500).send({error: error})}
           
            const response = {
                mensage: 'Produto inserido com sucesso!!',
                produtoCriado: {
                    id_produto: resultado.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,

                    request: {
                        tipo: 'GET',
                        descricao: '',
                        url: ''
                    }
                }
            }
            
               
            

            res.status(201).send({
                mensagem:'Produto inserido com sucesso!!',
                id_produto: resultado.insertId
            });

        }

        )

})
});

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn)=> {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM Produtos WHERE id_produto = ?',
            [req.params.id_produto],
            (error, resultado, field) =>{
                if(error) {return res.status(500).send({ error: error })}
            return res.status(200).send({response: resultado})
            }
    
        )
        
    
    });
});

// ALTERA UM PRODUTO

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn)=> {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'UPDATE Produtos SET nome = ?, preco = ? WHERE id_produto = ?',
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, resultado, field) =>{
                if(error) {return res.status(500).send({ error: error })}
            
                return res.status(202).send({
                    
                    
                    mensagem: "Produto alterado com Sucesso!!"
                })
            }
    
        )
        
    
    });
});

//EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn)=> {
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM Produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, resultado, field) =>{
                if(error) {return res.status(500).send({ error: error })}
            
                return res.status(202).send({
                    
                    
                    mensagem: "Produto deletado com Sucesso!!"
                })
            }
    
        )
        
    
    });
});

module.exports = router;