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
var fs = require('fs');
var path = require('path');

router.use('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

router.post('/login', function (req, res, next) {
  res.json(delegate.authenticate(req));
});

router.get('/export-list', function(req, res, next) {
  delegate.exportListToCSV(req).then(function (response) {
    var relPath = './routes/uploads/file.csv'; 
    var absPath = path.join(__dirname, '/uploads/', 'file.csv');
    fs.writeFile(relPath, response, function(err) {
      if(err) throw err;
      console.log('file saved');
      res.download(relPath, function (err) {
        if(err) {
          console.log('File not downloaded');
        }
        console.log('Success');
        fs.unlink(relPath, function(err) {});
      });
    });
  }).catch (function (err) {
    res.end('Unable to download file');
  });
});

//POST request - To add todos
router.post('/list-item', function (req, res, next) {
  delegate.checkToken(req.body.token).then(function (decodedObject) {;
    console.log('Inside check token');
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
  delegate.checkToken(req.body.token).then(function (decodedObject) {
    delegate.updateListItem(req).then(function (response) {
      res.json(response);
    }).catch(function (error) {
      res.json(error);
    });
  }).catch(function (error) {
    res.json(error);
  });
});

//DELETE - to remove list item
router.delete('/list-item/:id', function (req, res, next) {
  delegate.checkToken(req.body.token).then(function (decodedObject) {
    delegate.deleteListItem(req).then(function (successResponse) {
      res.json(successResponse);
    }).catch(function (failureResponse) {
      res.json(failureResponse);
    })
  }).catch(function (error) {
    res.json(error);
  });
});

module.exports = router;
