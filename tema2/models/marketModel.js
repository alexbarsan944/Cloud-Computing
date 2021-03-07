let market = require('../db/data')

async function getByIdModel(id) {
    return new Promise((resolve, reject) => {
        const marketObj = market.find((p) => p.id === id)
        if (marketObj === undefined) {
            resolve('Not found')
        }
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
        console.log(marketObj)
        if (marketObj['statistics'] === undefined) {
            resolve('Not found')
        } else
            resolve(marketObj['statistics'])
    })
}

async function getStatsByIdModel(id, stat_id) {
    return new Promise((resolve, reject) => {
        const marketObj = market.find((p) => p.id === id)
        if (marketObj['statistics'][stat_id] === undefined) {
            resolve('Not found')
        } else
            resolve(marketObj['statistics'][stat_id])
    })
}

module.exports = {getByIdModel, getAllModel, getAllStatsModel, getStatsByIdModel}