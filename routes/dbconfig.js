var connection;
var mysql = require('mysql');

module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "zilkeradmin",
    DATABASE: "todo_list",
    getConnection : function() {
        return mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "ztech@123",
            database: "todo_list"
          });
    }
}   