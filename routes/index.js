var express = require('express');
var router = express.Router();
//Mysql Connection
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

function executeQuery(statement, queryParameters, callback, request, response) {
  var con = dbconfig.getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(statement, queryParameters, function (err, result) {
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
  var getIdStatement = queries.POSTID;
  executeQuery(getIdStatement, null, insertElement, req, res);
});

function insertElement(result, req, res) {
  var id = result[0].id == null ? 1 : result[0].id + 1;
  var insertListStatement = queries.INSERTQUERY;
  executeQuery(insertListStatement, [id, req.body.desc], postResponse, req, res);
  listItem = new CreateListItem(id, req.body.desc);
}

function postResponse(result, req, res) {
  console.log(result);
  res.end(JSON.stringify(listItem));
}

//GET request - Retrieve data
router.get('/list-item', function (req, res, next) {
  var selectStatement = queries.GETQUERY;
  executeQuery(selectStatement, null, getTodo, req, res);
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

//PUT request - To Update Todos
router.put('/list-item', function (req, res, next) {
  var id = req.body.id;
  var getCheckedStatus = queries.PUTSTATUS;
  executeQuery(getCheckedStatus, [id], getIsChecked, req, res);
});

function getIsChecked (result, req, res) {
  var is_checked = result[0].is_checked == 0 ? 1 : 0;
  var id = req.body.id;
  var updateCheckedStatus = queries.PUTUPDATE;
  executeQuery(updateCheckedStatus, [is_checked, id], updateStatusResponse, req, res);
}

function updateStatusResponse (result, req, res) {
  console.log('Update success.');
  res.json({ message: 'Successfully updated' });
}

  // //GET request - To retrieve todos
  // router.get('/list-item', function (req, res, next) {
  //   var resultData;
  //   var con = createConnection();
  //   con.connect(function (err) {
  //     if (err) throw err;
  //     var sql = "select * from todo_data"
  //     con.query(sql, function (err, result) {
  //       if (err) throw err;
  //       else {
  //         resultData = result;
  //         if (resultData == null) {
  //           res.send("Nothing to Display");
  //         }
  //         else {
  //           console.log(JSON.stringify(resultData));
  //           res.send(resultData);
  //         }
  //       }
  //       con.end();
  //     });
  //   });
  // });

  // //DELETE request - To delete Todos
  // router.delete('/list-item/:id', function (req, res, next) {
  //   var id = req.params.id;
  //   var con = createConnection();
  //   con.connect(function (err) {
  //     if (err) {
  //       throw new Error("Connection Failed");
  //     }
  //     var delete_query = "delete from todo_data where id=" + id;
  //     con.query(delete_query, function (err, result) {
  //       if (err) {
  //         throw new Error("Query Failed");
  //       }
  //       con.end();
  //     });
  //   });

  // });

  module.exports = router;
