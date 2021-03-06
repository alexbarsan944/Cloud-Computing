let market = require('../db/data')

async function getByIdModel(id) {
    return new Promise((resolve, reject) => {
        const marketObj = market.find((p) => p.id === id)
        resolve(marketObj)
    })
}

async function getAllModel() {
    return new Promise((resolve, reject) => {
        resolve(market)
    })
}

async function getAllStatsModel(id) {
    return new Promise((resolve, reject) => {
        const marketObj = market.find((p) => p.id === id)
        resolve(marketObj['statistics'])
    })
}

async function getStatsByIdModel(id, stat_id) {
    return new Promise((resolve, reject) => {
        const marketObj = market.find((p) => p.id === id)
        resolve(marketObj['statistics'][stat_id])
    })
}

module.exports = {getByIdModel, getAllModel, getAllStatsModel, getStatsByIdModel}