const model = require('../models/marketModel')
let path = require('path');
const fileLocation = path.join(__dirname, '..', 'db', 'data.json');


async function notAllowed(req, res) {
    res.writeHead(405, {'Content-Type': 'application/json'})
    return res.end(JSON.stringify('Method not allowed'))
}

async function deleteStat(req, res) {
    try {
        let result = await model.deleteStatModel(fileLocation, req)
        if (result === "Not found") {
            res.writeHead(404, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(result))
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(result))
        }
    } catch (error) {
        console.log(error)
    }
}

async function deleteMarketId(req, res) {
    try {
        let result = await model.deleteMarketIdModel(fileLocation, req)
        if (result === "Not found") {
            res.writeHead(404, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(result))
        } else if (result === "Stock deleted successfully"){
            res.writeHead(200, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(result))
        }
    } catch (error) {
        console.log(error)
    }

}

module.exports = {notAllowed, deleteStat, deleteMarketId}