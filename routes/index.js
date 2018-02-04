var express = require('express');
var router = express.Router();

var structure = {
  listItems : [],
  noOfItemsChecked : 0
};
function getId() {
  if(structure.listItems.length==0) {
    return 1;
  }
  else {
    return structure.listItems[structure.listItems.length-1].id+1;
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
    var listItem = createListItem(id,"something");
    structure.listItems.push(listItem);
    res.end("successfully added your item to the database");
    
   

});

router.get('/listItem',function(req,res,next) {
  //Sowmya's code
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
});
module.exports = router;