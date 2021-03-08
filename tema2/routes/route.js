const controller = require("../controllers/marketController")
const postController = require("../controllers/postMarketController")
const deleteController = require('../controllers/deleteMarketController')
async function route(req, res) {
    console.log(req.method, req.url)
    switch (req.method) {
        case "GET":
            if (req.url === '/market' || req.url === '/market/') {
                await controller.getAll(req, res)
                console.log(req.url)
            } else if (req.url.match(/^\/market\/\d+\/statistics\/\d+$/)) {
                await controller.getStatsById(req, res)
                console.log(req.url)
            } else if (req.url.match(/^\/market\/\d+\/statistics$/)) {
                await controller.getAllStats(req, res)
                console.log(req.url)
            } else if (req.url.match(/^\/market\/\d+$/)) {
                await controller.getById(req, res)
                console.log(req.url)
            }
            else{
                console.log("Route not found.")
                await controller.notFound(req, res)
            }
            break

        case "POST":
            if (req.url === '/market' || req.url === '/market/') {
                await postController.postMarket(req, res)
            }
            else if (req.url.match(/^\/market\/\d+\/statistics$/)) {
                await postController.postStatistics(req, res)
            }
            else{
                console.log("Route not found.")
                await controller.notFound(req, res)
            }
            break

        case "DELETE":
            if (req.url === '/market' || req.url === '/market/') {
                await deleteController.notAllowed(req, res)
            }
            else if(req.url.match(/^\/market\/\d+\/statistics$/)){
                await deleteController.notAllowed(req, res)
            }
            else if (req.url.match(/^\/market\/\d+\/statistics\/\d+$/)) {
                await deleteController.deleteStat(req, res)
            }
            else if (req.url.match(/^\/market\/\d+$/)) {
                await deleteController.deleteMarketId(req, res)
            }
    }
}

module.exports.route = route;