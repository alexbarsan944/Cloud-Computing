const mysql = require('mysql');

const con = mysql.createConnection({
    host: '34.78.154.15',
    user: 'stupid',
    password: 'stupid',
});

con.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});


const express = require('express');
const app = express();
var cookieParser = require('cookie-parser')

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}))

const { OAuth2Client } = require('google-auth-library');
let CLIENT_ID = '203351277928-tt014ggtqeqsm3asbodcdafg8i4r95sl.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);


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

app.get('/rate', checkAuth, (req, res) => {
    let user = req.user;

    con.query('use projectCC', (err, rows) => {
        if (!err)
            con.query('SELECT max(done_at) as a FROM logging', (err, rows) => {
                if (!err) {
                    time_value = rows[0].a;
                    con.query('SELECT count(id) as b FROM logging', (err, rows2) => {
                        if (!err) {
                            console.log('Data received from Db:');
                            count_value = rows2[0].b;
                            console.log(count_value);
                            console.log(time_value);
                            var entryData = { time: time_value, count: count_value };
                            res.render('interface.ejs', { entries: entryData, user: user });
                        }
                    });
                }
            });

    });

});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running @ http://localhost:${port}`);
});