var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
var queries = require('./queries');
var dbconfig = require('./dbconfig');
var mysql = require('mysql');
var dbDelegate = require('./dbDelegate');
var listItem;
var delegate = require('./delegate');

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
  delegate.getListItem(req).then(function(response) {
    res.json(response);
  }).catch(function (error) {
    res.json(error);
  })
});

function getTodo(result, req, res) {
  var resultData = result;
    // console.log(JSON.stringify(resultData));
    res.send(resultData);
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
