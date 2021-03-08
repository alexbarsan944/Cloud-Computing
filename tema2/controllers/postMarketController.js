const model = require('../models/marketModel')
let path = require('path');
const fileLocation = path.join(__dirname, '..', 'db', 'data.json');

async function postMarket(req, res) {
    try {
        const body = await model.getPostData(req)
        let result = await model.appendToJson(fileLocation, body)
        console.log(result)
        if (result === "ID already exists") {
            res.writeHead(409, {'Content-Type': 'application/json'})
            return res.end('Resourse already exists')
        } else {
            res.writeHead(201, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(body))
        }

    } catch (error) {
        console.log(error)
    }
}


async function postStatistics(req, res) {
    try {
        const body = await model.getPostData(req)


        let result = await model.appendStats(fileLocation, body, req)
        if (result === "ID already exists") {
            res.writeHead(409, {'Content-Type': 'application/json'})
            return res.end('Resourse already exists')
        } else if (result === "Stats don't exist") {
            res.writeHead(409, {'Content-Type': 'application/json'})
            return res.end(result)
        } else {
            res.writeHead(201, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(body))
        }

    } catch (error) {
        console.log(error)
    }
}


module.exports = {postMarket, postStatistics}