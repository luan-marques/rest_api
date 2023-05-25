const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, './uploads/');
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

//const fileFilter = (req,file,cb) => {
  //  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    //    cb(null, true );
    //} else{
    //    cb(null, false);
    //}
    


const upload = multer({storage : storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    //fileFilter: fileFilter
    
});

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM Musicas;',
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    Produtos: result.map(prod => {
                        return {
                            id_musica: prod.id_musica,
                            nome: prod.nome,
                            musica: prod.musica,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna uma música com base no id',
                                url: 'http://localhost:3000/produtos/' + prod.id_musica
                            }
                        }
                    })
                }

                return res.status(200).send({ response })
            }
        )
    });
});

router.post('/', upload.single('musica'), (req, res, next) => {
    console.log(req.file);
     mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO Musicas (nome, musica) VALUES(?, ?);',
            [
                req.body.nome, 
                req.file.path
            ],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensage: 'Música inserida com sucesso!!',
                    musicaCriada: {
                        id_musica: result.id_musica,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        musica: req.file.path, 
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere uma música',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }

                return res.status(201).send({ response });

            }
        )
    });
});


router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(

            'SELECT * FROM Musicas WHERE id_musica = ?;',
            [req.params.id_musica],
            (error, result, fields) => {
                //conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'ID não existe!'
                    })
                }

                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        musica: result[0].musica,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todas as músicas',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }

                return res.status(200).send({ response })

            }
        )
    });
});

router.patch('/', login, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'UPDATE Musicas SET nome = ? WHERE id_musica = ?',
            [req.body.nome, req.body.preco, req.body.id_musica],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    produtoAtualizado: {
                        id_musica: req.body.id_musica,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de uma música',
                            url: 'http://localhost:3000/produtos/' + req.body.id_musica
                        }
                    }
                }

                return res.status(202).send({ response })
            }

        )


    });
});


router.delete('/', login, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM Produtos WHERE id_musica = ?',
            [req.body.id_musica],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Música removida com sucesso!!',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Deleta uma música',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            nome: 'String',
                        }
                    }
                }
                return res.status(202).send({ response })
            }

        )


    });
});

module.exports = router;