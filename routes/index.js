var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
var queries = require('./queries');
var dbconfig = require('./dbconfig');
var mysql = require('mysql');
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

//PUT request - To Update status of a list item.
router.put('/list-item', function (req, res, next) {
  delegate.updateListItem(req).then(function (response) {
    res.json(response);
  }).catch(function (error) {
    res.json(error);
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
