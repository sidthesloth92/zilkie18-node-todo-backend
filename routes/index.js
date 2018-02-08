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

router.post('/api/login', function (req, res) {
  const user = { id: 3 };
  const token = jwt.sign({ user }, 'hello');
  res.json({
    message: 'Authenticated! Use this token in the "Authorization" header',
    token: token
  });
});

router.get('/api/protected', ensureToken, function (req, res) {
  jwt.verify(req.token, 'hello', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        data: data
      });
    }
  });
});

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
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
  delegate.getListItem(req).then(function (response) {
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
  delegate.deleteListItem(req).then(function (successResponse) {
    res.json(successResponse);
  }).catch(function (failureResponse) {
    res.json(failureResponse);
  });


});


module.exports = router;
