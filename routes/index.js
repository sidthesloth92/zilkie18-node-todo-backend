var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
var queries = require('./queries');
var dbconfig = require('./dbconfig');
var mysql = require('mysql');
var listItem;
var delegate = require('./delegate');
var jwt = require('jsonwebtoken');


//using cors package
// var cors = require('cors');
// var corsOptions = {
//   origin: '*',
//   methods : ['GET','PUT','DELETE','POST']
// }


router.use('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});


router.post('/login', function (req, res, next) {

  res.json(delegate.authenticate(req));

});
//POST request - To add todos
router.post('/list-item', function (req, res, next) {
  delegate.checkToken(req.body.token).then(function (decodedObject) {
    delegate.addListItem(req).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      res.json(error);
    });
  }).catch(function (error) {
    res.json(error);
  });


});

// GET request - Retrieve data
router.get('/list-item', function (req, res, next) {
  console.log(req.query.token);
  delegate.checkToken(req.query.token).then(function (decodedObject) {
  delegate.getListItem(req).then(function (response) {
    res.json(response);
  }).catch(function (error) {
    res.json(error);
  })
}).catch(function (error) {
  res.json(error);
});
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
  delegate.deleteListItem(req).then(function (successResponse) {
    res.json(successResponse);
  }).catch(function (failureResponse) {
    res.json(failureResponse);
  });


});


module.exports = router;
