var express = require('express');
var router = express.Router();

var toDoList= {'listItems':[],'noOfItemsChecked':0};

function getId() {
  if(toDoList.listItems.length==0) {
    return 1;
  }
  else {

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
  //Naveen's code 
  
    var id = getId();
    var listItem = new createListItem(id,req.body.desc);
    toDoList.listItems.push(listItem);
    res.end(""+id);
});


router.get('/listItem',function(req,res,next) {
  if(toDoList == null)
  {
    res.send("Nothing to Display");
  }
  else {
   res.json(toDoList);
  }
});

router.put('/checkListItem/:id',function(req,res,next) {
  var id = req.params.id;
  var index = structure.listItems.findIndex(function(item, i) {
    return item.id == id;
  });
  structure.noOfItemsChecked++;
  structure.noOfItemsChecked[index].ischecked = true;
});

router.put('/uncheckListItem/:id',function(req,res,next) {
  var id = req.params.id;
  var index = structure.listItems.findIndex(function(item, i) {
    return item.id == id;
  });
  structure.noOfItemsChecked--;
  structure.noOfItemsChecked[index].ischecked = false;
});

router.delete('/listItem',function(req,res,next) {
  //Gayathri's code
  var id = req.params.id;
  var list_array=structure.listItems;
  var index = list_array.findIndex(function(element) {
    return element.id==id;
  });
  if( list_array[index].ischecked===true)
  {
    structure.noOfItemsChecked--;
  }
   list_array.splice(index,1);

});
module.exports = router;