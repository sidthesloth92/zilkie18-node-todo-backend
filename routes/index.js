var express = require('express');
var router = express.Router();


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
});

function addListItem(err, result) {
  var id = result[0].id;

}

//GET request - To retrieve todos
router.get('/listItem', function (req, res, next) {
  if (toDoList == null) {
    res.send("Nothing to Display");
  }
  else {
    res.send(toDoList);
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
