var express = require('express');
var router = express.Router();
var listItem;
//Mysql Connection
var mysql = require('mysql');

//Constructor to add todo Items 
function CreateListItem(id, desc) {
  this.id = id;
  this.description = desc;
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


function executeQuery(statement,callback,request,response) {
  var con = createConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(statement, function (err, result) {
      if (err) throw err;
      if(callback!=undefined) {
      callback(result,request,response);
      con.end();
      }
      });
  });
}

function postResponse(result,req,res) {
  console.log(result);
  res.end(JSON.stringify(listItem));
}

function insertElement(result,req,res) {
  var id = result[0].id == null ? 1 : result[0].id + 1;
  var insertListStatement = "Insert into todo_data (id,description) values ('" + id + "','" + req.body.desc + "')";
  executeQuery(insertListStatement,postResponse,req,res);
 listItem = new CreateListItem(id, req.body.desc);
}

//POST request - To add todos
router.post('/list-item', function (req, res, next) {
  var getIdStatement = "select MAX(id) as id from todo_data";
  executeQuery(getIdStatement,insertElement,req,res);
});


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

// //PUT request - To Update Todos
// router.put('/list-item', function (req, res, next) {
//   var id = req.body.id;
//   var con = createConnection();
//   var sql = "SELECT is_checked from todo_data where id = " + id;
//   con.connect(function (err) {
//     if (err) throw err;
//   });
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     con.end();
//     con = createConnection();
//     if (result[0].is_checked == 0) {
//       sql = "UPDATE todo_data SET is_checked = 1 WHERE id = " + id;
//     } else {
//       sql = "UPDATE todo_data SET is_checked = 0 WHERE id = " + id;
//     }
//     con.connect(function (err) {
//       if (err) { 
//         throw err;
//       }


//       con.query(sql, function (err, result) {
//         if (err) {
//            throw err;
//         }
//            con.end();
//       });
//     });
//   });
//   if (toDoList.listItems[index].isChecked == false) {
//     toDoList.listItems[index].isChecked = true;
//   } else {
//     toDoList.listItems[index].isChecked = false;
//   }
//   console.log(toDoList);
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
