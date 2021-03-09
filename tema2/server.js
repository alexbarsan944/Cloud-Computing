const http = require('http')
let path = require('path');
const routes = require(path.join(__dirname, '..', 'tema2', 'routes', 'route.js'))

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        routes.route(req, res)
    } else if (req.method === 'POST') {
        routes.route(req, res)
    } else if (req.method === 'PUT') {
        routes.route(req, res)
    } else if (req.method === 'PATCH') {

    } else if (req.method === 'DELETE') {
        routes.route(req, res)
    } else {
        res.writeHead(404, {'ContentType': 'application/json'})
        res.end(JSON.stringify({message: 'Route Not Found'}))
    }
})

const PORT = process.env.PORT || 4444

server.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`))

module.exports = server;