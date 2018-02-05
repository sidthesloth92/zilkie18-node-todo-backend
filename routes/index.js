var express = require('express');
var router = express.Router();

//Mysql Connection
var mysql = require('mysql');

//Constructor to add todo Items 
function CreateListItem(id, desc) {
  this.id = id;
  this.description = desc;
  this.isChecked = false;
}

function createConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "zilkeradmin",
    database: "todo_list"
  });
}

//POST request - To add todos
router.post('/list-item', function (req, res, next) {
  var getIdStatement = "select MAX(id) as id from todo_data";
  var con = createConnection();
  con.connect(function (err) {
    if (err) throw err;
  });
  con.query(getIdStatement, function (err, result) {
    if (err) throw err;
    var id = result[0].id == null ? 1 : result[0].id + 1;
    var insertListStatement = "Insert into todo_data (id,description) values ('" + id + "','" + req.body.desc + "')";
    var listItem = new CreateListItem(id, req.body.desc);

    con.query(insertListStatement, function (err, result) {
      con.end();
      res.end(JSON.stringify(listItem));
    });
  });
});


//GET request - To retrieve todos
router.get('/list-item', function (req, res, next) {
  var resultData;
  var con = createConnection();
  console.log("in");
  con.connect(function (err) {
    if (err) throw err;
    console.log("in");
    var sql = "select * from todo_data"
    con.query(sql, function (err, result) {
      if (err) throw err;
      else {
        resultData = result;
        if (resultData == null) {
          res.send("Nothing to Display");
        }
        else {
          console.log(JSON.stringify(resultData));
          res.send(resultData);
        }
      }
      con.end();
    });
  });
});

//PUT request - To Update Todos
router.put('/list-item', function (req, res, next) {
  var id = req.body.id;
  var con = createConnection();
  var sql = "SELECT is_checked from todo_data where id = " + id;
  con.connect(function (err) {
    if (err) throw err;
  });
  con.query(sql, function (err, result) {
    if (err) throw err;
    con.end();
    con = createConnection();
    if (result[0].is_checked == 0) {
      sql = "UPDATE todo_data SET is_checked = 1 WHERE id = " + id;
    } else {
      sql = "UPDATE todo_data SET is_checked = 0 WHERE id = " + id;
    }
    con.connect(function (err) {
      if (err) throw err;
      con.query(sql, function (err, result) {
        if (err) throw err;
        con.end();
      });
    });
  });
});

//DELETE request - To delete Todos
router.delete('/list-item/:id', function (req, res, next) {
  var id = req.params.id;
  var con = createConnection();
  con.connect(function (err) {
    if (err){
      throw new Error("Connection Failed");
    } 
    var delete_query = "delete from todo_data where id=" + id;
    con.query(delete_query, function (err, result) {
      if (err) {
        throw new Error("Query Failed");
      }
      con.end();
    });
  });
});

module.exports = router;
