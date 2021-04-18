const express = require('express');
const { Connection, Request } = require("tedious");

const app = express();
const config = {
    authentication: {
        options: {
            userName: "stefan@bank-server1",
            password: "password9A"
        },
        type: "default"
    },
    server: "bank-server1.database.windows.net",
    options: {
        database: "bank-database",
        encrypt: true
    }
};

const connection = new Connection(config);

connection.on("connect", err => {
    if (err) {
        console.error(err.message);
        console.log("EROROROROORORORO")

    } else {
        //queryDatabase();
        console.log("connected")
    }
});
connection.connect()


app.post('/clients', (req, res) => {
    let { name, id_card, age, username, password, } = req.query;
    console.log(name, id_card, age, username, password)

    if (!name) return res.status(400).json('Name cant be blank');
    if (!id_card) return res.status(400).json('ID cant be blank');
    if (!age) return res.status(400).json('Age cant be blank');
    if (!username) return res.status(400).json('Username cant be blank');
    if (!password) return res.status(400).json('Password cant be blank');

    var data = {
        name: name,
        id_card: id_card,
        age: age,
        username: username,
        password: password
    };

    // Read all rows from table
    const request = new Request(
        "INSERT INTO clienti (nume, card_identitate, varsta, username, password) values \
            ('" + name + "', '" + id_card + "', " + age + ", '" + username + "', '" + password + "')",
        (err, rowCount, rows) => {
            if (err) {
                console.error(err.message);
                res.status(409).json({ error: "Username: " + username + " already exists." });
                return;
            } else {
                const request2 = new Request(
                    "SELECT id FROM clienti WHERE username='" + username + "' and password='" + password + "'",
                    (err, rowCount) => {
                        if (err) {
                            console.error(err.message);
                            res.status(500).json({ error: "Database error." });
                            return;
                        } else {
                            if (rowCount != 1) {
                                res.status(404).json({ error: "Username or password not found." })
                                return
                            }

                        }
                    }
                );

                request2.on("row", columns => {
                    data = {
                        id: columns[0].value
                    };
                    res.status(200).json(data)
                });

                connection.execSql(request2);
            }
        }
    );


    connection.execSql(request);
});

app.get('/clients/:clientId', (req, res) => {
    console.log(req.params.clientId);
    if (!req.params.clientId) return res.status(400).json('id cant be blank');

    // Read all rows from table
    const request = new Request(
        "SELECT * FROM clienti WHERE id='" + req.params.clientId + "'",
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: "Database error." });
                return;
            } else {
                if (rowCount == 0) {
                    res.status(404).json({ error: "Id: " + req.params.clientId + " not found." });
                    return;
                }
            }
        }
    );
    request.on("row", columns => {
        data = {
            id: columns[0].value,
            name: columns[1].value,
            id_card: columns[2].value,
            age: columns[3].value,
            username: columns[4].value,
            password: columns[5].value
        };
        console.log(columns)
        console.log(data)
        res.status(200).json(data)
    });
    connection.execSql(request);
});

app.post('/login', (req, res) => {
    let { username, password, } = req.query;
    console.log(username, password)

    if (!username) return res.status(400).json('username cant be blank');
    if (!password) return res.status(400).json('password cant be blank');

    // Read all rows from table
    const request = new Request(
        "SELECT id FROM clienti WHERE username='" + username + "' and password='" + password + "'",
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: "Database error." });
                return;
            } else {
                if (rowCount != 1) {
                    res.status(404).json({ error: "Username or password not found/invalid." })
                    return
                }
                
            }
        }
    );
    request.on("row", columns => {
        data = {
            id: columns[0].value
        };
        res.status(200).json(data)
    });
    connection.execSql(request);
});

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});