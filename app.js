const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false})); // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body

app.use((req, res, next) => {
    res.header('Acess-Contreol-Allow-Origin', '*');
    res.header('Acess-Contreol-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({})
    }
    next();
});

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

// Quando não encontra rota, entra aqui:
app.use((req,res,next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;