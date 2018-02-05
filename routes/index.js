var express = require('express');
var router = express.Router();
var mysql = require('mysql');

function createConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "zilkeradmin",
    database: "todo_list"
  });
}

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
router.get('/list-item', function (req, res, next) {
  if (toDoList == null) {
    res.send("Nothing to Display");
  }
  else {
    res.send(toDoList);
  }
});

//PUT request - To Update Todos
router.put('/list-item', function (req, res, next) {
  var id = req.body.id;
  var con = createConnection();
  var sql = "SELECT is_checked from todo_data where id = " + id;
  con.connect(function (err) {
    if (err) throw err;
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.end();
      con = createConnection();
      if (result[0].is_checked == 0) {
        sql = "UPDATE todo_data SET is_checked = 1 WHERE id = " + id;
        console.log('check');
      } else {
        sql = "UPDATE todo_data SET is_checked = 0 WHERE id = " + id;
        console.log('uncheck');
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
});

//DELETE request - To delete Todos
router.delete('/list-item/:id', function (req, res, next) {
  var id = req.params.id;
  var list_array = toDoList.listItems;
  var index = list_array.findIndex(function (element) {
    return element.id == id;
  });
  if (list_array[index].ischecked === true) {
    toDoList.noOfItemsChecked--;
  }
  toDoList.listItems.splice(index, 1);
});

module.exports = router;
