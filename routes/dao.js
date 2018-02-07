var dbconfig = require('./dbconfig');


module.exports = {
    executeQuery: function (statement) {

        return new Promise(function (resolve, reject) {
            var con = dbconfig.getConnection();
            con.connect(function (err) {
                if (err) {
                    reject(err.code);
                }
                con.query(statement, function (err, result) {
                    if (err) {
                        reject(err.code);
                    }
                    resolve(result);
                    con.end();
                });
            });
        });
    }
}