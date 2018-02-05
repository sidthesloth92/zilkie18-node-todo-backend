var express = require('express');
var router = express.Router();

//TODO Array 
var toDoList = { 'listItems': [], 'noOfItemsChecked': 0 };

//Function to generate ID
function getId() {
  if (toDoList.listItems.length == 0) {
    return 1;
  } else {
    return (toDoList.listItems[(toDoList.listItems.length) - 1].id) + 1;
  }
}

//Constructor to add todo Items 
function createListItem(id, desc) {
  this.id = id;
  this.desc = desc;
  this.ischecked = false;
}

//POST request - To add todos
router.post('/listItem', function (req, res, next) {
  var id = getId();
  var duplicateToDoList = { 'listItems': [], 'noOfItemsChecked': 0 };
  var listItem = new createListItem(id, req.body.desc);
  toDoList.listItems.push(listItem);
  duplicateToDoList.listItems.push(listItem);
  res.end(JSON.stringify(duplicateToDoList));
});

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
router.put('/checkListItem', function (req, res, next) {
  var id = req.query.id;
  var index = toDoList.listItems.findIndex(function (item, i) {
    return item.id == id;
  });
  toDoList.noOfItemsChecked--;
  toDoList.listItems[index].ischecked = false;
});

router.put('/uncheckListItem', function (req, res, next) {
  var id = req.query.id;
  var index = toDoList.listItems.findIndex(function (item) {
    return item.id == id;
  });
  toDoList.noOfItemsChecked++;
  toDoList.listItems[index].ischecked = true;
});

//DELETE request - To delete Todos
router.delete('/listItem', function (req, res, next) {
  var id = req.query.id;
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
