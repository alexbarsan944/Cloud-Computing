const mysql = require('mysql');
var path = require("path");
const fetch = require("node-fetch");
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser')
var qs = require('qs');

var data = require(path.resolve('env/secrets.js'))

const con = mysql.createConnection({
    host: data.host,
    user: data.user,
    password: data.password,
});
let CLIENT_ID = data.CLIENT_ID

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}))

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


con.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});


app.get('/', (req, res) => {
    res.render('index');
})

app.get('/login', (req, res) => {
    res.render('login');
})


app.post('/login', (req, res) => {
    let token = req.body.JWT;
    console.log(token)

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log(payload)
    }

    verify()
        .then(() => {
            res.cookie('session-token', token);
            res.send('success')
        })
        .catch(console.error);
})


app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('login')
})

function checkAuth(req, res, next) {

    let token = req.cookies['session-token'];

    let user = {};

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }

    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect('/login')
        })

}

app.get('/rate', checkAuth, async (req, res) => {

    let url = qs.parse(req.url)
    value = url['/rate?lyrics']
    score2 = '-'
    console.log(url)
    console.log(value)
    if (value !== undefined) {
        response = await fetch('https://europe-west2-cloudcomputin2021.cloudfunctions.net/insert_row', {
            method: 'get'
        })

        const body = {lyrics: value};
        console.log(value)
        console.log(body)
        response = await fetch('https://cloudcomputin2021.nw.r.appspot.com/?lyrics=' + value, {
            method: 'post',
            headers: {'Content-Type': 'application/json'}
        })
            .then(res => res.json())
            .then(json => score2 = json);

    }
    console.log(score2)
    let user = req.user;

    con.query('use projectCC', (err, rows) => {
        if (!err)
            con.query('SELECT * from information', (err, rows) => {
                if (!err) {
                    time_value = rows[0].last_submit;

                    console.log('Data received from Db:');
                    count_value = rows[0].total_submits;
                    console.log(count_value);
                    console.log(time_value);
                    var entryData = {time: time_value, count: count_value, score: score2.score};
                    res.render('interface.ejs', {entries: entryData, user: user});

                }
            });

    });


});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running @ http://localhost:${port}`);
});