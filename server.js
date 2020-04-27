//CONFIGURAÇÃO DO SERVIDOR
const express = require("express")
const server = express()

const db = require("./db")

//ARQUIVOS ESTÁTICOS
server.use(express.static("public"))

//REQ.BODY
server.use(express.urlencoded({ extended: true }))

//NUNJUCKS
const nunjucks = require("nunjucks")
nunjucks.configure("views",{
    express: server, 
    noCache: true, //boolean
})

//ROTAS
server.get("/", function(req, res){

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) { 
            console.log(err)
            return res.send("Erro no Banco de Dados!")
        }

        const reverseIdeas = [...rows].reverse()

        let lastIdeas = []
        for (let idea of reverseIdeas) {
            if(lastIdeas.length <2){
                lastIdeas.push(idea)
            }
        }
    
        return res.render("index.html", {ideas: lastIdeas})
    })
  
})

server.get("/ideias", function(req, res){

    db.all(`SELECT * FROM ideas`, function(err, rows){
    if (err) { 
        console.log(err)
        return res.send("Erro no Banco de Dados!")
    }
    const reverseIdeas = [...rows].reverse()

    return res.render("ideias.html", {ideas: reverseIdeas})
    })
})

server.post("/", function(req, res){
    const query =`
        INSERT INTO ideas(
            image,
            title,
            category,
            description,
            link
        ) VALUES (?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]
        db.run(query, values, function(err){
            if (err) { 
                console.log(err)
                return res.send("Erro no Banco de Dados!")
            }
    
            return res.redirect("/ideias")
        })
})

//PORTA DO SERVIDOR 
server.listen(3000)
