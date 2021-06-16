const express = require('express')
const {urlencoded}= require('express')
const cors = require('cors');

const server = express()

const routes = require('./routes')

server.use(express.json())
server.use(urlencoded({extended:true}))
server.use(cors());
server.use(routes)

server.listen(3000)

