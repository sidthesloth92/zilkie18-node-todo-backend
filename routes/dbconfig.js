var connection;
var mysql = require('mysql');

module.exports = {
    getConnection : function() {
        return mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "Gayathiri2728",
            database: "todo_list"
        });
    }
}   