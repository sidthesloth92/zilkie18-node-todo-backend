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

//TODO Array 
var toDoList = { 'listItems': []};

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
router.post('/listItem', function (req, res, next) {
  var id = getId();
  var listItem = new CreateListItem(id, req.body.desc);
  toDoList.listItems.push(listItem);
  res.end(JSON.stringify(listItem));
});

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
router.put('/updateListItem', function (req, res, next) {
  var id = req.query.id;
  var status = req.query.status;
  var index = toDoList.listItems.findIndex(function (item) {
    return item.id == id;
  });
  if (status === "check") {
    toDoList.noOfItemsChecked++;
    toDoList.listItems[index].ischecked = true;
  } else if (status === "uncheck") {
    toDoList.noOfItemsChecked--;
    toDoList.listItems[index].ischecked = false;
  }
});

//DELETE request - To delete Todos
router.delete('/listItem/:id', function (req, res, next) {
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
