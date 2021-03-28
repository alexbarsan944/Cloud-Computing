// Imports the Google Cloud client library
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var qs = require('qs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log(req.params)
    console.log(req.body)
    res.end()
})
let text = '';

app.post('/', async(req, res) => {
    let url = qs.parse(req.url)
    text = url['/?lyrics']
    x = await f()
    console.log(x)
    res.end(JSON.stringify(x))
})

const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

async function f() { // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the document

    const res = await client.analyzeSentiment({ document: document });
    let score = res[0].documentSentiment.score;
    let mag = res[0].documentSentiment.magnitude;
    return res[0].documentSentiment


}

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running @ http://localhost:${port}`);
});