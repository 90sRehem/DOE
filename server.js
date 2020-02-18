//configuando o servidor
const express = require('express')
const server = express()

//configurar servidor para apresentar aquivos depententes(css,js,img)
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({extended: true}))

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0207',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})




//configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true,
})













//configurar apresentação da página//ROTAS
server.get('/', function(req, res){
    db.query("SELECT * from donors",function(err, result){
        if (err) return res.send("Erro do banco de dados.")

        const donors = result.rows
        return res.render('index.html', { donors})
    })
})


server.post('/', function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const bloodtype = req.body.bloodtype

    if (name =="" || email =="" || bloodtype ==""){
        return res.send('Todos os campos são obrigatórios.')
    }





    //colocar valores dentro do banco de daDos
    const query = 
    `INSERT INTO donors ("name", "email", "bloodtype")
     VALUES ($1, $2, $3)`

    const values = [name, email, bloodtype]

    db.query(query, values, function(err){
       //fluxo de erro
        if (err) return res.send('Erro no banco de dados.')
       
        //fluxo ideal
        return res.redirect('/')

    })    
})









//ligar o servidor através da porta 3000
server.listen(3000, function(){
    console.log('Servidor iniciado');
    
})