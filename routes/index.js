var express = require('express');
var router = express.Router();

var toDoList= {'listItems':[],'noOfItemsChecked':0};

function getId() {
  if(toDoList.listItems.length==0) {
    return 1;
  } else {
    return (toDoList.listItems[(toDoList.listItems.length)-1].id)+1;
  }
}


function createListItem(id,desc) {
  this.id=id;
  this.desc=desc;
  this.ischecked=false;
}

/* GET home pag


router.post('/listItem',function(req,res,next) {
  //Naveen's code
});e. */
router.get('/goodbye', function(req, res, next) {
  res.end("bye");
  // res.render('index', { title: 'Express' });
});


router.post('/listItem',function(req,res,next) {
    var id = getId();
    var duplicateToDoList= {'listItems':[],'noOfItemsChecked':0};
    var listItem = new createListItem(id,req.body.desc);
    toDoList.listItems.push(listItem);
    duplicateToDoList.listItems.push(listItem);
    res.end(JSON.stringify(duplicateToDoList));
});


router.get('/listItem',function(req,res,next) {
  if(toDoList == null)
  {
    res.send("Nothing to Display");
  }
  else {
   res.send(toDoList);
  }
});

router.put('/checkListItem',function(req,res,next) {
  var id = req.query.id;
  var index = toDoList.listItems.findIndex(function(item, i) {
    return item.id == id;
  });
  toDoList.noOfItemsChecked--;
  toDoList.listItems[index].ischecked = false;
});

router.put('/uncheckListItem',function(req,res,next) {
  var id = req.query.id;
  var index = toDoList.listItems.findIndex(function(item) {
    return item.id == id;
  });
  toDoList.noOfItemsChecked++;
  toDoList.listItems[index].ischecked = true;
});

router.delete('/listItem',function(req,res,next) {
  var id = req.query.id;
  var list_array=toDoList.listItems;
  var index = list_array.findIndex(function(element) {
    return element.id==id;
  });
  if( list_array[index].ischecked===true)
  {
    toDoList.noOfItemsChecked--;
  }
  toDoList.listItems.splice(index,1);
});
module.exports = router;
