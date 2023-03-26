const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); // apenas dados simples
app.use(bodyParser.json());

app.use((req,res,next) =>{

    res.header('Acess-Control-Allow-Origin','*');
    res.header(
        'Acess-Control-Allow-Header',
        'Origin, X-Requested-With,Content-Type,Accept,Authorization'
    );

if(req.method === 'OPTIONS'){

    res.header('Acess-Control-Allow-Methods','PUT,POST,PATCH,DELET,GET');
    return res.status(200).send({});


}

next();

})





app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

// Rota não encontrada. Informa Erro!
app.use((req, res, nex) => {

    const erro = new error('Não encontrado!!');

    erro.status = 404;
    next(erro);
});

app.use('/teste', (req, res, next) => {

    res.status(200).send({

        mensagem: "Ok, deu certo!"

    });

});

app.use((error,req,res,next)=> {

res.status(error.status || 500);
return res.send({
erro: {
    mensage: error.mensage
}


})

});

module.exports = app;