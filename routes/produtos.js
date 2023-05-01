
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

        (error, result, field) =>{
            //conn.release();
            if(error) {return res.status(500).send({ error: error })}
            const response = {
                quantidade: result.length,
                Produtos: result.map(prod =>{
                    return {
                        id_produto: prod.id_produto,
                        nome: prod.nome,
                        preco: prod.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um produto com base no id',
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
        (error, result, field) => {
            conn.release(); 

            if(error) {return res.status(500).send({error: error})}
           
            const response = {
                mensage: 'Produto inserido com sucesso!!',
                produtoCriado: {
                    id_produto: result.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,

                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: 'http://localhost:3000/produtos'
                    }
                }
            }
            
               
            

            return res.status(201).send({ response });

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
            (error, result, field) =>{
                conn.release();
                if(error) {return res.status(500).send({ error: error })}

                if(result.lenght == 0){
                    return res.status(404).send({
                        mensagem: 'Id não existe!'
                    })
                }

                const response = {
                    produto: {
                        id_produto: resultado[0].id_produto,
                        nome: resultado[0].nome,
                        preco: resultado[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }


            return res.status(202).send({response   })
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
            (error, result, field) =>{
                conn.release();
                if(error) {return res.status(500).send({ error: error })}
            
                const response = {
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produto',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produto
                        }
                    }
                }

                return res.status(202).send({response})
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
            (error, result, field) =>{
                if(error) {return res.status(500).send({ error: error })}
                const response = {
                    mensagem: 'Produto removido com sucesso!!',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Deleta um produto',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                return res.status(202).send({ response })
            }
    
        )
        
    
    });
});

module.exports = router;