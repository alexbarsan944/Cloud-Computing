const model = require('../models/marketModel')

async function getAll(req, res) {
    let result = await model.getAllModel();
    if (result === 'Not found') {
        res.writeHead(404, {'Content-Type': 'application/json'})
        res.end(JSON.stringify('Data not found'))
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(result))
    }
}

async function getById(req, res) {
    let id = req.url.split('/')[2]
    let result = await model.getByIdModel(id);
    if (result === 'Not found') {
        res.writeHead(404, {'Content-Type': 'application/json'})
        res.end(JSON.stringify('Data not found'))
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(result))
    }
}

async function getAllStats(req, res) {
    let id = req.url.split('/')[2]
    let result = await model.getAllStatsModel(id);
    if (result === 'Not found') {
        res.writeHead(404, {'Content-Type': 'application/json'})
        res.end(JSON.stringify('Data not found'))
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(result))
    }
 
}

async function getStatsById(req, res) {
    let market_id = req.url.split('/')[2]
    let stats_id = req.url.split('/')[4]

    let result = await model.getStatsByIdModel(market_id, stats_id)
    console.log(result)
    if (result === 'Not found') {
        res.writeHead(404, {'Content-Type': 'application/json'})
        res.end(JSON.stringify('Data not found'))
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(result))
    }

}

async function notFound(req, res) {
    res.writeHead(404, {'Content-Type': 'application/json'})
    res.end(JSON.stringify('Route not found'))
}

module.exports = {getAll, getById, getAllStats, getStatsById, notFound}