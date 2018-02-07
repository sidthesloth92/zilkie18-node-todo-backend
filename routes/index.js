var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
var queries = require('./queries');
var dbconfig = require('./dbconfig');
var mysql = require('mysql');
var listItem;
var delegate = require('./delegate');
//Constructor to add todo Items 
function CreateListItem(id, desc) {
  this.id = id;
  this.description = desc;
  this.isChecked = false;
}
function CreateResponse(isSuccess, errorCode, data) {
  this.isSuccess = isSuccess;
  this.errorCode = errorCode;
  this.data = data;
}


//POST request - To add todos
router.post('/list-item', function (req, res, next) {
  delegate.addListItem(req).then(function (response) {
    res.json(response);
  }).catch(function (error) {
    res.json(error);
  });
});


// GET request - Retrieve data
router.get('/list-item', function (req, res, next) {
  executeQuery(queries.GET_QUERY, getTodo, req, res);
});

function getTodo(result, req, res) {
  var resultData = result;
  var response;
  if (resultData == null) {
    response = new CreateResponse(true, "", "Nothing to display");
  }
  else {
    response = new CreateResponse(true, "", JSON.stringify(result));
  }
  res.send(JSON.stringify(response));
};

//PUT request - To Update status of a list item.
router.put('/list-item', function (req, res, next) {
  var id = req.body.id;
  var getCheckedStatus = mysql.format(queries.GET_STATUS, [id]);
  var getStatusPromise = dbDelegate.executeQuery(getCheckedStatus);
  getStatusPromise.then(function (result) {
    var is_checked = result[0].is_checked == 0 ? 1 : 0;
    var updateCheckedStatus = mysql.format(queries.PUT_UPDATE, [is_checked, id]);
    var updateStatusPromise = dbDelegate.executeQuery(updateCheckedStatus);
    updateStatusPromise.then(function (result) {
      var response = new CreateResponse(true, "", "Update success for item " + id);
      res.end(JSON.stringify(response));
    }).catch(function (error) {
      var response = new CreateResponse(false, error.code, "");
      res.end(JSON.stringify(response));
    });
  }).catch(function (error) {
    var response = new CreateResponse(false, error.code, "");
    res.end(JSON.stringify(response));
  });
  // executeQuery(getCheckedStatus, function getIsChecked(result) {
  //   var is_checked = result[0].is_checked == 0 ? 1 : 0;
  //   var updateCheckedStatus = mysql.format(queries.PUT_UPDATE, [is_checked, id]);
  //   executeQuery(updateCheckedStatus, function putResponse(result) {
  //     var response = new CreateResponse(true, "", "Update success for item " + id);
  //     res.end(JSON.stringify(response));
  //   }, req, res);
  // }, req, res);
});

//DELETE - to remove list item
router.delete('/list-item/:id', function (req, res, next) {
  var id = req.params.id;
  var delete_query = mysql.format(queries.DELETE_QUERY, [id]);
  executeQuery(delete_query, function deleteResponse(result) {
    var response = new CreateResponse(true, "", "Delete success for item " + id);
    res.end(JSON.stringify(response));
  }, req, res);
});

function deleteItemresponse(result, req, res) {
  var response = new CreateResponse(true, "", "success");
  res.end(JSON.stringify(response));
}



module.exports = router;
