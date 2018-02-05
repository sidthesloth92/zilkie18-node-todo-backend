var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var resultData;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ztech@123",
  database: 'todo_list'
});


//TODO Array 
var toDoList = { 'listItems': [] };

//Function to generate ID
function getId() {
  if (toDoList.listItems.length == 0) {
    return 1;
  } else {
    return (toDoList.listItems[(toDoList.listItems.length) - 1].id) + 1;
  }
}

//Constructor to add todo Items 
function CreateListItem(id, desc) {
  this.id = id;
  this.desc = desc;
  this.isChecked = false;
}

//POST request - To add todos
router.post('/list-item', function (req, res, next) {
  var id = getId();
  var listItem = new CreateListItem(id, req.body.desc);
  toDoList.listItems.push(listItem);
  res.end(JSON.stringify(listItem));
});

//GET request - To retrieve todos
router.get('/listItem', function (req, res, next) {
  con.connect(function (err) {
    if (err) throw err;
  });
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
  });
});

//PUT request - To Update Todos
router.put('/list-item', function (req, res, next) {
  var id = req.body.id;
  var index = toDoList.listItems.findIndex(function (item) {
    return item.id == id;
  });
  if (toDoList.listItems[index].isChecked == false) {
    toDoList.listItems[index].isChecked = true;
  } else {
    toDoList.listItems[index].isChecked = false;
  }
  console.log(toDoList);
});

//DELETE request - To delete Todos
router.delete('/list-item/:id', function (req, res, next) {
  var id = req.params.id;
  var mysql_query = "delete from todo_data where id=" + id;
  con.query(mysql_query, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });

});

module.exports = router;
