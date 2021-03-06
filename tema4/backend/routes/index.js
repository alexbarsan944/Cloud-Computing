var express = require('express');
const app = express();

var router = express.Router();
var jwt = require('jsonwebtoken');

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())




const { Connection, Request } = require("tedious");

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
        rowCollectionOnRequestCompletion: true,
        database: "bank-database",
        encrypt: true
    }
};


router.post('/clients', (req, res) => {
    connection = new Connection(config);
    connection.connect((none) => {
        var name, id_card, age, username, password, bad_token = false;
        token = req.headers.jwt;
        jwt.verify(token, 'secretKey', function (err, decoded) {
            if (err) {
                bad_token = true;
            } else {
                username = decoded.username;
                password = decoded.password;
                id_card = decoded.id_card;
                name = decoded.name;
                age = decoded.age;
            }
        });

        if (bad_token) return res.status(400).json({ error: "JWT bad." })


        if (!name) return res.status(400).json('Name cant be blank');
        if (!id_card) return res.status(400).json('ID cant be blank');
        if (!age) return res.status(400).json('Age cant be blank');
        if (!username) return res.status(400).json('Username cant be blank1');
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
});

router.get('/clients/:clientId', (req, res) => {

    connection = new Connection(config);
    connection.connect((none) => {
        
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
            console.log(data)
            res.status(200).json(data)
        });
        connection.execSql(request);
    });
});

router.post('/login', (req, res) => {
    connection = new Connection(config);
    connection.connect((none) => {
        var username, password, bad_token = false;
        token = req.headers.jwt;
        jwt.verify(token, 'secretKey', function (err, decoded) {
            if (err) {
                bad_token = true;
            } else {
                username = decoded.username;
                password = decoded.password;
            }
        });

        if (bad_token) return res.status(400).json({ error: "JWT bad." })
        if (!username) return res.status(400).json('username cant be blank');
        if (!password) return res.status(400).json('password cant be blank');

        // Read all rows from table
        const request = new Request(
            "SELECT id FROM clienti WHERE username='" + username + "' and password='" + password + "'",
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: "Database error." });
                    return;
                } else {
                    if (rowCount != 1) {
                        res.status(404).json({ error: "Username or password not found/invalid." })
                        return
                    }
                    res.status(200).json({ id: rows[0][0].value })
                }
            });

        connection.execSql(request);

    });
});
router.post('/clients/:clientId/cards', (req, res) => {
    connection = new Connection(config);
    connection.connect((none) => {
        var name, bad_token = false;
        token = req.headers.jwt;
        jwt.verify(token, 'secretKey', function (err, decoded) {
            if (err) {
                bad_token = true;
            } else {
                name = decoded.name;
            }
        });

        if (bad_token) return res.status(400).json({ error: "JWT bad." })

        id_client = req.params.clientId

        if (!name) return res.status(400).json('Name cant be blank');
        if (!id_client) return res.status(400).json('ID cant be blank');


        // Read all rows from table
        const request = new Request(
            "SELECT MAX(nr_card) FROM carduri",
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: "Database error." });
                    return;
                } else {
                    new_card = increment_card(rows[0][0].value);

                    cvv = getRandomInt(100, 999);
                    expirare = 0 + getRandomInt(0, 9) + '/' + getRandomInt(22, 40);
                    const request2 = new Request(
                        "INSERT INTO carduri (id_client, sold, nr_card, data_expirare, nume_titular, csv) values \
          (" + id_client + ", " + 0 + ",'" + new_card + "', '" + expirare + "', '" + name + "', '" + cvv + "')",
                        (err, rowCount, rows) => {
                            if (err) {
                                console.error(err.message);
                                res.status(500).json({ error: "Database error." });
                                return;
                            } else {
                                return res.status(200).json({ ok: "ok" })
                            }
                        }
                    );
                    connection.execSql(request2);
                }
            }
        );
        connection.execSql(request);
    });
});

router.get('/clients/:clientId/cards', (req, res) => {
    connection = new Connection(config);
    connection.connect((none) => {
        console.log(req.params.clientId);
        if (!req.params.clientId) return res.status(400).json('id cant be blank');

        // Read all rows from table
        const request = new Request(
            "SELECT * FROM carduri WHERE id_client='" + req.params.clientId + "'",
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: "Database error." });
                    return;
                } else {
                    if (rowCount == 0) {
                        res.status(404).json({ error: "Id: " + req.params.clientId + " not found." });
                        return;
                    }
                    var data_array = new Array();
                    rows.forEach(row => {
                        data = {
                            id: row[0].value,
                            id_client: row[1].value,
                            sold: row[2].value,
                            nr_card: row[3].value,
                            data_expirare: row[4].value,
                            nume_titular: row[5].value,
                            csv: row[6].value
                        };
                        console.log(data);
                        data_array.push(data);
                    });

                    res.status(200).json(data_array)


                }
            });
        connection.execSql(request);
    });
});

router.get('/cards/:cardId', (req, res) => {
    connection = new Connection(config);
    connection.connect((none) => {
        console.log(req.params.cardId);
        if (!req.params.cardId) return res.status(400).json('id cant be blank');

        // Read all rows from table
        const request = new Request(
            "SELECT * FROM carduri WHERE id='" + req.params.cardId + "'",
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: "Database error." });
                    return;
                } else {
                    if (rowCount == 0) {
                        res.status(404).json({ error: "Id: " + req.params.cardId + " not found." });
                        return;
                    }
                    var data_array = new Array();
                    rows.forEach(row => {
                        data = {
                            id: row[0].value,
                            id_client: row[1].value,
                            sold: row[2].valslue,
                            nr_card: row[3].value,
                            data_expirare: row[4].value,
                            nume_titular: row[5].value,
                            csv: row[6].value
                        };
                        console.log(data);
                        data_array.push(data);
                    });

                    res.status(200).json(data_array[0])
                }
            });
        connection.execSql(request);
    });
});

router.post('/pay', (req, res) => {
    connection = new Connection(config);
    connection.connect((none) => {
        var from_nr_card, from_data_expirare, from_name, from_csv, to_nr_card, amount, bad_token = false;
        token = req.headers.jwt;
        jwt.verify(token, 'secretKey', function (err, decoded) {
            if (err) {
                bad_token = true;
            } else {
                from_nr_card = decoded.from_nr_card;
                from_data_expirare = decoded.from_data_expirare;
                from_name = decoded.from_name;
                from_csv = decoded.from_csv;
                to_nr_card = decoded.to_nr_card;
                amount = decoded.amount;
            }
        });

        if (bad_token) return res.status(400).json({ error: "JWT bad." })

        money_sent = amount

        if (!from_nr_card) return res.status(400).json('from_nr_card cant be blank');
        if (!from_data_expirare) return res.status(400).json('from_data_expirare cant be blank');
        if (!from_name) return res.status(400).json('from_name cant be blank');
        if (!from_csv) return res.status(400).json('from_csv be blank');
        if (!to_nr_card) return res.status(400).json('to_nr_card cant be blank');
        if (!money_sent) return res.status(400).json('money_sent cant be blank');


        const request = new Request(
            "SELECT sold FROM carduri WHERE \
    nr_card = '" + from_nr_card + "' AND data_expirare='" + from_data_expirare + "'\
    AND nume_titular='" + from_name + "' AND csv='" + from_csv + "'",
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: "Database error." });
                    return;
                } else {
                    if (rowCount == 0)
                        return res.status(404).json({ error: "Card details invalid" })
                    sold = rows[0][0].value;
                    if (sold < money_sent)
                        return res.status(406).json({ error: "Not enough money" })


                    const request2 = new Request(
                        "SELECT id FROM carduri WHERE nr_card = '" + to_nr_card + "'",
                        (err, rowCount, rows2) => {
                            if (err) {
                                console.error(err.message);
                                res.status(500).json({ error: "Database error." });
                                return;
                            } else {
                                if (rowCount == 0)
                                    return res.status(404).json({ error: "No card with number " + to_nr_card })
                                console.log(rows2[0][0].value)
                                ///update out account
                                const request3 = new Request(
                                    "UPDATE carduri SET sold = sold + " + money_sent + " WHERE nr_card = '" + to_nr_card + "'",
                                    (err, rowCount, rows3) => {
                                        if (err) {
                                            console.error(err.message);
                                            res.status(500).json({ error: "Database error." });
                                            return;
                                        } else {
                                            ///update in account
                                            const request4 = new Request(
                                                "UPDATE carduri SET sold = sold - " + money_sent + " WHERE nr_card = '" + from_nr_card + "'",
                                                (err, rowCount, rows4) => {
                                                    if (err) {
                                                        console.error(err.message);
                                                        res.status(500).json({ error: "Database error." });
                                                        return;
                                                    } else {
                                                        return res.status(200).json({ ok: "ok" })
                                                    }
                                                }
                                            );
                                            connection.execSql(request4);
                                        }
                                    }
                                );
                                connection.execSql(request3);

                            }
                        }
                    );
                    connection.execSql(request2);
                }
            }
        );
        connection.execSql(request);

    });
});
router.post('/cards/bancomat/add', (req, res) => {
    connection = new Connection(config);
    connection.connect((none) => {
        var nr_card, amount, bad_token = false;
        token = req.headers.jwt;
        jwt.verify(token, 'secretKey', function (err, decoded) {
            if (err) {
                bad_token = true;
            } else {
                nr_card = decoded.nr_card;
                amount = decoded.amount;
            }
        });

        if (bad_token) return res.status(400).json({ error: "JWT bad." })

        if (!nr_card) return res.status(400).json('nr_card cant be blank');
        if (!amount) return res.status(400).json('amount cant be blank');

        // Read all rows from table
        const request = new Request(
            "UPDATE carduri SET sold = sold + " + amount + " WHERE nr_card = '" + nr_card + "'",
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: "Database error." });
                    return;
                } else {
                    return res.status(200).json({ ok: "ok" })
                }
            }
        );
        connection.execSql(request);
    });
});

router.post('/cards/bancomat/extract', (req, res) => {
    connection = new Connection(config);
    connection.connect((none) => {
        var nr_card, amount, bad_token = false;
        token = req.headers.jwt;
        jwt.verify(token, 'secretKey', function (err, decoded) {
            if (err) {
                bad_token = true;
            } else {
                nr_card = decoded.nr_card;
                amount = decoded.amount;
            }
        });
        if (bad_token) return res.status(400).json({ error: "JWT bad." })

        if (!nr_card) return res.status(400).json('nr_card cant be blank');
        if (!amount) return res.status(400).json('amount cant be blank');

        // Read all rows from table
        const request = new Request(
            "SELECT sold FROM carduri WHERE nr_card = '" + nr_card + "'",
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: "Database error." });
                    return;
                } else {
                    sold = rows[0][0].value;
                    if (sold < amount)
                        return res.status(406).json({ error: "Not enough money" })
                    const request2 = new Request(
                        "UPDATE carduri SET sold = sold - " + amount + " WHERE nr_card = '" + nr_card + "'",
                        (err, rowCount, rows) => {
                            if (err) {
                                console.error(err.message);
                                res.status(500).json({ error: "Database error." });
                                return;
                            } else {
                                return res.status(200).json({ ok: "ok" })
                            }
                        }
                    );
                    connection.execSql(request2);
                }
            }
        );
        connection.execSql(request);
    });
});

function increment_card(card_nr) {
    new_card = '';
    has_changed = false
    for (i = 15; i >= 0; i--)
        if (has_changed) {
            new_card = card_nr[i] + new_card;
        } else {
            if (card_nr[i] != 9) {
                new_card = (Number(card_nr[i]) + 1) + new_card
                has_changed = true
            } else {
                new_card = 0 + new_card
            }
        }
    return new_card
}

function getRandomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

module.exports = router;