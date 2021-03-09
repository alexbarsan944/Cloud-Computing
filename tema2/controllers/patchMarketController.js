const model = require('../models/marketModel')
let path = require('path');
const fileLocation = path.join(__dirname, '..', 'db', 'data.json');


async function notAllowed(req, res) {
    res.writeHead(405, {'Content-Type': 'application/json'})
    return res.end(JSON.stringify('Method not allowed'))
}

async function patchStatistics(req, res) {
    try {
        const body = await model.getPostData(req)
        let result = await model.patchStatsModel(fileLocation, body, req)
        if (result === "Not found") {
            res.writeHead(409, {'Content-Type': 'application/json'})
            return res.end('Not found')
        } else if (result === "Stats don't exist") {
            res.writeHead(409, {'Content-Type': 'application/json'})
            return res.end(result)
        } else if(result === 'created') {
            res.writeHead(201, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(body))
        }
        else{
            res.writeHead(404, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify('Error'))
        }
    } catch (error) {
        console.log(error)
    }
}
async function patchMarket(req, res) {
    try {
        const body = await model.getPostData(req)
        let result = await model.patchMarketModel(fileLocation, body, req)
        if (result === "Not found") {
            res.writeHead(409, {'Content-Type': 'application/json'})
            return res.end('Not found')
        } else if (result === "Stats don't exist") {
            res.writeHead(409, {'Content-Type': 'application/json'})
            return res.end(result)
        } else if(result === 'updated') {
            res.writeHead(201, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(body))
        }
        else {
            res.writeHead(404, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(result))
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {notAllowed, patchStatistics, patchMarket}