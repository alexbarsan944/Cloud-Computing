const controller = require("../controllers/marketController")

async function route(req, res) {

    switch (req.method) {
        case "GET":
            if (req.url === '/market' || req.url === '/market/') {
                console.log(req.url)
                await controller.getAll(req, res)
            } else if (req.url.match(/\/market\/\w+\/statistics\/\w+/)) {
                await controller.getStatsById(req, res)
                console.log(req.url)
            } else if (req.url.match(/\/market\/\w+\/statistics/)) {
                await controller.getAllStats(req, res)
                console.log(req.url)
            } else if (req.url.match(/\/market\/\w+/)) {
                console.log('here')
                await controller.getById(req, res)
            }
            break

        case "POST":
            console.log(req.url)
            break
    }
}

module.exports.route = route;