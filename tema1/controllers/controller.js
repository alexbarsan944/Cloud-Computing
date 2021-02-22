const fs = require('fs');
const path = require('path');
var http = require('http');
const qs = require('querystring');


function postHandler(request, response) {
    let reqBody = '';

    //Print any error
    request.on('error', (err) => {
        console.error(err.stack);
    });

    request.on('data', function (data) {
        reqBody += data;
        console.log(reqBody)
    });

    const RandomOrg = require('random-org');
    const random = new RandomOrg({apiKey: 'fc008460-ef02-46ae-8f25-15d5c8d686a0'});

    request.on('end', function () {
        let num1 = reqBody.split('num=')[1][0];
        let num2 = reqBody.split('num2=')[1].split('&')[0];
        let image = reqBody.split('field2=')[1];
        var random_nr = 0
        random.generateIntegers({min: num1, max: num2, n: 1})
            .then(function (result) {
                console.log(result.random.data);
                random_nr = result.random.data;
            });

        var options = {
            host: 'www.splashbase.co',
            path: '/api/v1/images/search?query=' + image
        };
        var str = '';


        http.request(options, function (res) {
            res.on('data', function (chunk) {
                str += chunk;
            });
            res.on('end', function () {
                const data = JSON.parse(str)
                console.log(random_nr)
                let img = data.images[(data.images.length - 1)  % random_nr + 1].url
                response.writeHead(200, {'Content-Type': 'text/html'})
                response.end(`<img src=${img}  alt="Random image">`);
            });
        }).end(reqBody);


     });
}

async function getHandler(filePath, response){
    if(!filePath.includes('?'))
    {
        fs.readFile(filePath, 'utf8', function(error, content)
        {
            let type = getContentType(filePath);
            response.writeHead(200, { 'Content-Type': type })
            response.end(content)
        });
    }
    else{
        response.writeHead(200, { 'Content-Type': 'application/json' });
        let json = qs.parse(filePath.split('?')[1]);
        response.end(json)
    }
}

function getContentType(filePath)
{
    var extensionName = path.extname(filePath)
    var contentTypeMap = {
        '.html': 'text/html',
        '.ico' : 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
    };
    return contentTypeMap[extensionName];
}


module.exports.postHandler = postHandler;
module.exports.getHandler = getHandler;