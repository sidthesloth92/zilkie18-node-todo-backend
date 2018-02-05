var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var queries = require('./queries');
var dbconfig = require('./dbconfig');
var errors = require('./errors');
var mysql = require('mysql');

//Constructor to add todo Items 
function CreateListItem(id, desc) {
  this.id = id;
  this.description = desc;
  this.isChecked = false;
}

function createConnection() {
  return mysql.createConnection({
    host: dbconfig.HOST,
    user: dbconfig.USER,
    password: dbconfig.PASSWORD,
    database: dbconfig.DATABASE
  });
}

//POST request - To add todos
router.post('/list-item', function (req, res, next) {
  var getIdStatement = queries.POSTID;
  var con = createConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(getIdStatement, function (err, result) {
      if (err) throw err;
      var id = result[0].id == null ? 1 : result[0].id + 1;
      var insertListStatement = queries.INSERTQUERY;
      var listItem = new CreateListItem(id, req.body.desc);
      con.query(insertListStatement, [id, req.body.desc], function (err, result) {
        con.end();
        res.end(JSON.stringify(listItem));
      });
    });
  });
});

//GET request - To retrieve todos
router.get('/list-item', function (req, res, next) {
  var resultData;
  var con = createConnection();
  con.connect(function (err) {
    if (err) throw err;
    var sql = queries.GETQUERY;
    con.query(sql, function (err, result) {
      if (err) throw err;
      else {
        resultData = result;
        if (resultData == null) {
          res.send(errors.DISPLAYNONE);
        }
        else {
          console.log(JSON.stringify(resultData));
          res.send(resultData);
        }
      }
      con.end();
    });
  });
});

//PUT request - To Update Todos
router.put('/list-item', function (req, res, next) {
  var id = req.body.id;
  var con = createConnection();
  var getCheckedStatus = queries.PUTSTATUS;
  con.connect(function (err) {
    if (err) throw err;
    con.query(getCheckedStatus, [id], function (err, result) {
      if (err) throw err;
      var isChecked = (result[0].is_checked == 0) ? 1 : 0;
      var updateCheckedStatus = queries.PUTUPDATE;
      con.query(updateCheckedStatus, [isChecked, id], function (err, result) {
        if (err) throw err;
        con.end();
      });
    });
  });
});

//DELETE request - To delete Todos
router.delete('/list-item/:id', function (req, res, next) {
  var id = req.params.id;
  var con = createConnection();
  con.connect(function (err) {
    if (err){
      throw new Error(errors.CONFAIL);
    } 
    var delete_query = queries.DELETEQUERY;
    con.query(delete_query, [id], function (err, result) {
      if (err) {
        throw new Error(errors.QUERYFAIL);
      }
      con.end();
    });
  });
});

module.exports = router;
