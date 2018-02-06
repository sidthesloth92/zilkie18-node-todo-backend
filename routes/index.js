var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
var queries = require('./queries');
var dbconfig = require('./dbconfig');
var errors = require('./errors');
var mysql = require('mysql');
var listItem;

//Constructor to add todo Items 
function CreateListItem(id, desc) {
  this.id = id;
  this.description = desc;
  this.isChecked = false;
}

function executeQuery(statement, callback, request, response) {
  var con = dbconfig.getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(statement, function (err, result) {
      if (err) throw err;
      if (callback != undefined) {
        callback(result, request, response);
        con.end();
      }
    });
  });
}

//POST request - To add todos
router.post('/list-item', function (req, res, next) {
  var getIdStatement = queries.POST_ID;
  executeQuery(getIdStatement, insertElement, req, res);
});

function insertElement(result, req, res) {
  var id = result[0].id == null ? 1 : result[0].id + 1;
  var insertListStatement = mysql.format(queries.INSERT_QUERY, [id, req.body.desc]);
  executeQuery(insertListStatement, postResponse, req, res);
  listItem = new CreateListItem(id, req.body.desc);
}     

function postResponse(result, req, res) {
  console.log(result);
  res.end(JSON.stringify(listItem));
}

//GET request - Retrieve data
router.get('/list-item', function (req, res, next) {
  var selectStatement = queries.GET_QUERY;
  executeQuery(selectStatement, getTodo, req, res);
});

function getTodo(result, req, res) {
  var resultData = result;
  if (resultData == null) {
    res.send("Nothing to Display");
  }
  else {
    console.log(JSON.stringify(resultData));
    res.send(resultData);
  }
};

//PUT request - To Update status of a list item.
router.put('/list-item', function (req, res, next) {
  var id = req.body.id;
  var getCheckedStatus = mysql.format(queries.PUT_STATUS, [id]);
  executeQuery(getCheckedStatus, getIsChecked, req, res);
});

function getIsChecked(result, req, res) {
  var is_checked = result[0].is_checked == 0 ? 1 : 0;
  var id = req.body.id;
  var updateCheckedStatus = mysql.format(queries.PUT_UPDATE, [is_checked, id]);
  executeQuery(updateCheckedStatus, updateItemResponse, req, res);
}

function updateItemResponse(result) {
  console.log('Update success.');
}

//DELETE - to remove list item
router.delete('/list-item/:id', function (req, res, next) {
  var id = req.params.id;
  var delete_query = mysql.format(queries.DELETE_QUERY,[id]);
  executeQuery(delete_query, deleteItemresponse, req, res);
});

function deleteItemresponse() {
  console.log("Delete success");
}

module.exports = router;
