var express = require('express');
var router = express.Router();
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
function CreateResponse(isSuccess,errorCode,data){
  this.isSuccess=isSuccess;
  this.errorCode=errorCode;
  this.data=data;
}

function executeQuery(statement,callback, req, res) {
  var con = dbconfig.getConnection();
  con.connect(function (err) {
    if (err)  {
      var response = new CreateResponse(false,err.code,"");
      res.end(JSON.stringify(response));
      return;
    }
    con.query(statement, function (err, result) {
      if (err) {
      var response = new CreateResponse(false,err.code,"");
      res.end(JSON.stringify(response));
       return;
      }
      if (callback != undefined) {
        callback(result, req, res);
        con.end();
      }
    });
  });
}
//POST request - To add todos
router.post('/list-item', function (req, res, next) {
  var getIdStatement = queries.POSTID;
  executeQuery(getIdStatement,insertElement, req, res);
});

function insertElement(result, req, res) {
  var id = result[0].id == null ? 1 : result[0].id + 1;
  var insertListStatement = mysql.format(queries.INSERTQUERY,[id,req.body.desc]);
  executeQuery(insertListStatement,postResponse, req, res);
  listItem = new CreateListItem(id, req.body.desc);
}

function postResponse(result, req, res) {
  var response = new CreateResponse(true,"",JSON.stringify(listItem));
  res.end(JSON.stringify(response));
}

// GET request - Retrieve data
router.get('/list-item', function (req, res, next) {
  var selectStatement = queries.GETQUERY;
  executeQuery(selectStatement,getTodo, req, res);

});

function getTodo(result, req, res) {
  var resultData = result;
  var response;
  if (resultData == null) {
   response = new CreateResponse(true,"","Nothing to display");
    
  }
  else {
    response = new CreateResponse(true,"",JSON.stringify(result));
  }
  res.send(JSON.stringify(response));
};

  //DELETE request - To delete Todos
  router.delete('/list-item/:id', function (req, res, next) {
    var id = req.params.id;
    var delete_query=queries.DELETEQUERY;
    executeQuery(delete_query,deleteResponse,req,res);
  });

  function deleteResponse(result,req,res) {
    var response=new response(true,"","Successful");
    res.end(JSON.stringify(response));
  }
  module.exports = router;
