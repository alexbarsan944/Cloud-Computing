const http = require('http')
const controller = require('/Users/alexandrubarsan/Documents/GitHub/Cloud-Computing/tema2/controllers/marketController.js')
const routes = require('/Users/alexandrubarsan/Documents/GitHub/Cloud-Computing/tema2/routes/route.js')
const model = require('./models/marketModel')
// TODO : fix get special cases

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        routes.route(req, res)
    } else {
        res.writeHead(404, {'ContentType': 'application/json'})
        res.end(JSON.stringify({message: 'Route Not Found'}))
    }
})

const PORT = process.env.PORT || 4444

server.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`))

module.exports = server;