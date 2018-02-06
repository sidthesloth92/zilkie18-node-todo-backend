var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'zilkeradmin',
    database : 'todo_list'
});

exports.getConnection = function () {
    return connection;
}

// connection.connect(function(err) {
//     if(err){
//         console.log('Error connecting to Db');
//         return;
//     }
//     console.log('Connection established');
// });
