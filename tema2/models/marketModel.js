let market = require('../db/data')
const fs = require('fs')

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
        if (marketObj['statistics'] === undefined) {
            resolve('Not found')
        } else
            resolve(marketObj['statistics'])
    })
}

async function getStatsByIdModel(id, stat_id) {
    return new Promise((resolve, reject) => {
        const marketObj = market.find((p) => p.id === id)
        if (marketObj === undefined || marketObj['statistics'] === undefined) {
            resolve('Not found')
        } else if (marketObj['statistics'].find((p) => p.ID === stat_id) === undefined) {
            resolve('Not found')
        } else {
            resolve(marketObj['statistics'].find((p) => p.ID === stat_id))
        }
    })
}

async function appendToJson(filename, content) { // TODO: get market ID from req
    let fileString = fs.readFileSync(filename, "utf-8");
    let exists = market.find((p) => p.id === content['id'])
    if (exists === undefined) { // doesn't already exist in DB
        let marketsObj = JSON.parse(fileString);
        marketsObj.push(content)
        fs.writeFileSync(filename, JSON.stringify(marketsObj), 'utf8', (err) => {
            if (err) {
                console.log(err)
            }
        })
    } else
        return 'ID already exists'
}

async function deleteStatModel(filename, req) {
    let statsId = req.url.split('/')[4]
    let marketId = req.url.split('/')[2]
    let fileString = fs.readFileSync(filename, "utf-8");
    let marketsObj = JSON.parse(fileString);
    let objToDelete = await getStatsByIdModel(marketId, statsId)
    if (objToDelete === 'Not found') return objToDelete
    else {
        let idx1 = marketsObj.indexOf(marketsObj.find((p) => p.id === marketId))
        let idx2 = marketsObj[idx1].statistics.indexOf(marketsObj.find((p) => p.ID === statsId))
        marketsObj[idx1].statistics.splice(idx2, 1)
        fs.writeFileSync(filename, JSON.stringify(marketsObj), 'utf8', (err) => {
            if (err) {
                console.log(err)
            }
        })
        return 'Stat deleted successfully'
    }
}

async function deleteMarketIdModel(filename, req) {
    let marketId = req.url.split('/')[2]
    let fileString = fs.readFileSync(filename, "utf-8");
    let marketsObj = JSON.parse(fileString);

    let marketIdToDelete = await getByIdModel(marketId)
    if (marketIdToDelete === 'Not found') return marketIdToDelete
    else {
        let idx = marketsObj.indexOf(marketsObj.find((p) => p.id === marketId))
        marketsObj.splice(idx, 1)
        fs.writeFileSync(filename, JSON.stringify(marketsObj), 'utf8', (err) => {
            if (err) {
                console.log(err)
            }
        })
        return 'Stock deleted successfully'
    }
}

async function appendStats(filename, content, req) {
    let fileString = fs.readFileSync(filename, "utf-8");
    let statsId = req.url.split('/')[4]
    let marketId = req.url.split('/')[2]
    let existsStock = market.find((p) => p.id === marketId)
    if (existsStock === undefined) { // no bueno. we need a stock to add the stats
        return 'ID already exists'
    } else {
        let existsStat = existsStock['statistics']
        if (existsStat === undefined) {  // undefined daca stock ul nu are 'statistics'
            return "Stats don't exist"
        } else {
            if (existsStat.find((p) => p.ID === statsId) === undefined) { // Can add to stats
                content['ID'] = statsId
                let marketsObj = JSON.parse(fileString);
                marketsObj.find((p) => p.id === marketId)['statistics'].push(content)
                fs.writeFileSync(filename, JSON.stringify(marketsObj), 'utf8', (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
        }
    }
}

async function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = ''

            req.on('data', (chunk) => {
                body += chunk.toString()
            })

            req.on('end', () => {
                resolve(JSON.parse(body))
            })
        } catch (error) {
            reject(err)
        }
    })
}


module.exports = {
    getByIdModel,
    getAllModel,
    getAllStatsModel,
    getStatsByIdModel,
    appendToJson,
    appendStats,
    getPostData,
    deleteStatModel,
    deleteMarketIdModel
}