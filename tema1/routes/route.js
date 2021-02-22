const controller = require("../controllers/controller")

const path = require('path');
const mainPath = path.join(__dirname, '..', 'views', 'mainPage');

async function route(request, response) {
    let filePath = mainPath + request.url;
    if (request.url === '/'){
        filePath = mainPath + '/main.html';
    }

    if (request.method === "GET") {
        await controller.getHandler(filePath, response)
    } else if (request.method === "POST") {
        await controller.postHandler(request, response)
    }
}

module.exports.route = route;