const controller = require("../controllers/marketController")
let UrlPattern = require('url-pattern');

async function route(req, res) {
    let pattern1 = new UrlPattern('/market/:idm/statistics/:ids');
    let pattern2 = new UrlPattern('/market/:idm');

    switch (req.method) {
        case "GET":
            if (req.url === '/market' || req.url === '/market/') {

                console.log(req.url)
                await controller.getAll(req, res)

            } else if (req.url.match(/^\/market\/\d+\/statistics\/\d+$/)) {

                console.log('1')
                await controller.getStatsById(req, res)
                console.log(req.url)

            } else if (req.url.match(/^\/market\/\d+\/statistics$/)) {
                console.log('2')
                await controller.getAllStats(req, res)
                console.log(req.url)
            } else if (req.url.match(/^\/market\/\d+$/)) {

                console.log('\n3')
                console.log(req.url)

                await controller.getById(req, res)
            }
            else{
                console.log("Route not found.")
                await controller.notFound(req, res)
            }
            break

        case "POST":
            console.log(req.url)
            break
    }
}

module.exports.route = route;