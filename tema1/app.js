const http = require('http');
const port = process.env.PORT || 8128;
const routes = require('C:\\Users\\Alex\\Documents\\GitHub\\Cloud-Computing\\tema1\\routes\\route.js')

http.createServer( (request, response) => {
    //See request
    console.log('request', request.method, request.url)

    if (request.method === "POST")
    {
        routes.route(request, response)
    }else
    if (request.method === "GET")
    {
        routes.route(request, response)
    }
    else{
        response.writeHead(401, { 'Content-Type': 'text/html' });
        response.end('Failed to get method');
    }


}).listen(port)

serverRunningTxt = 'Server running at http://127.0.0.1:' + port + '/'
console.log(serverRunningTxt)