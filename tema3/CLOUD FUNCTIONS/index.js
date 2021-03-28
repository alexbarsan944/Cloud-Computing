/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.helloWorld = (req, res) => {
    const mysql = require('mysql');

    const con = mysql.createConnection({
        host: '34.78.154.15',
        user: 'stupid',
        password: 'stupid'
    });

    con.connect((err) => {
        if (err) {
            console.log('Error connecting to Db');
            return;
        }
        console.log("ghsdjkghdjkghjkd");
        con.query('use projectCC', (err, rows) => {
            if (!err)
                con.query('SELECT max(done_at) as a FROM logging', (err, rows) => {
                    if (!err) {
                        time_value = rows[0].a;
                        con.query('SELECT count(id) as b FROM logging', (err, rows2) => {
                            if (!err) {
                                console.log('Data received from Db:');
                                count_value = rows2[0].b;

                                con.query('UPDATE information SET last_submit = \'' + time_value + '\', total_submits = ' + count_value + ' where 1=1', (err, rows3) => {
                                    if (!err) {
                                        console.log('Update Complete');
                                        res.status(200);
                                        res.send("update complete");
                                    } else {
                                        res.status(400);
                                        res.send(err);
                                    }
                                });
                            }
                        });
                    }
                });
        });
    });
};