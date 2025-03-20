const express = require("express");
const bcrypt = require("bcrypt")
const mysql = require('mysql2')
const cors = require("cors");
const saltRounds = 10;
const app = express();

    const db = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "Supershadow@123",
        database: "bancovaggon",
    });

    app.use(express.json())
    app.use(cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }));

    app.post("/cadastro", (req, res) => {
        const email = req.body.email
        const password = req.body.password

        db.query("SELECT * FROM usuários WHERE email = ?", [email], (err, result) => {
            if (err) {
                res.send(err)
            }
            if (result.length == 0) {
                bcrypt.hash(password, saltRounds, (erro, hash) => {
                    db.query("INSERT INTO usuários (email, password) VALUES (?, ?)", [email, hash], (err, response) => {
                        if (err) {
                            res.send(err)
                        }
                        res.send({ msg: "Cadastrado com sucesso" })
                    }
                    )
                })

            } else {
                res.send({ msg: "Usuário já cadstrado" })
            }
        })
    })

    app.post("/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password

    db.query("SELECT * FROM usuários WHERE email = ?", [email], (err, result) => {
        if (err) {
            req.send(err)
        }
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (erro, result) => {
                if (result) {
                    res.send("Usuário está logado")
                } else {
                    res.send("Senha incorreta")
                }
            })
        } else {
            res.send({ msg: "Conta não encontrada" })
        }
    })
})

        app.post("/atividades", (req, res) => {
            const { nome, descricao, dataInicio, dataFim, status } = req.body;
            
            const sql = "INSERT INTO atividades (nome, descricao, dataInicio, dataFim, status) VALUES (?, ?, ?, ?, ?)";
            db.query(sql, [nome, descricao, dataInicio, dataFim, status], (err, result) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(201).send({ msg: "Atividade adicionada com sucesso" })
                }
            });
        });

        app.get("/atividades", (req, res) => {
            db.query("SELECT * FROM atividades", (err, result) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    res.status(200).json(result)
                }
            });
        });

        app.delete("/atividades/:id", (req, res) => {
            const { id } = req.params;
            
            db.query("DELETE FROM atividades WHERE id = ?", [id], (err, result) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send({ msg: "Atividade removida com sucesso" })
                }
            });
        });

    app.listen(3001, () => {
        console.log("Rodando na porta 3001");
    });
