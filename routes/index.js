var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var resultData;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ztech@123",
  database : 'todo_list'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "select * from todo_data"
  con.query(sql, function (err, result) {
    if (err) throw err;
    else {
     resultData = result;
    // console.log(JSON.stringify(resultData));
    }
  });
});


//Mysql Connection
var mysql = require('mysql');




//Constructor to add todo Items 
function CreateListItem(id, desc) {
  this.id = id;
  this.desc = desc;
  this.isChecked = false;
}

function createConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ztech@123",
    database: "todo_list"
  });

}

//POST request - To add todos
<<<<<<< HEAD
router.post('/listItem', function (req, res, next) {
  var getIdStatement = "select MAX(id) as id from todo_data";
  var con = createConnection();
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected! man");
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
=======
router.post('/list-item', function (req, res, next) {
  var id = getId();
  var listItem = new CreateListItem(id, req.body.desc);
  toDoList.listItems.push(listItem);
  res.end(JSON.stringify(listItem));
>>>>>>> 3888e395feefc008eabd646505e49c5f05cec932
});

function addListItem(err, result) {
  var id = result[0].id;

}

//GET request - To retrieve todos
router.get('/listItem', function (req, res, next) {
  if (resultData == null) {
    res.send("Nothing to Display");
  }
  else {
    console.log(JSON.stringify(resultData));
    res.send(resultData);
  }
});

//PUT request - To Update Todos
router.put('/list-item', function (req, res, next) {
  var id = req.body.id;
  var index = toDoList.listItems.findIndex(function (item) {
    return item.id == id;
  });
  if(toDoList.listItems[index].isChecked == false) {
    toDoList.listItems[index].isChecked = true;
  } else {
    toDoList.listItems[index].isChecked = false;
  }
  console.log(toDoList);
});

//DELETE request - To delete Todos
router.delete('/list-item/:id', function (req, res, next) {
  var id = req.params.id;
  var mysql_query="delete from todo_data where id="+id;
  con.query(mysql_query, function (err, result) {
    if (err) throw err;
    console.log("Result: " +result);
  });
  
});

module.exports = router;
