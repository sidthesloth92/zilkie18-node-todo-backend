var dbconfig = require('./dbconfig');
var mysql = require('http');

function CreateResponse(isSuccess, errorCode, data) {
    this.isSuccess = isSuccess;
    this.errorCode = errorCode;
    this.data = data;
}

module.exports = {
    executeQuery : function (statement) {
        var con = dbconfig.getConnection();
        return new Promise(function(resolve, reject) {
            con.connect(function (err) {
                if (err) {
                    reject(err);
                }
                con.query(statement, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                    con.end();
                });
            });
        });
    }
}