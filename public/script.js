window.onload=function() {
    // console.log("hello");
    init();

}

function xmlrequest(type,url,content=null) {
    // define the type of request either get,put,delete or post
    
        var request = new window.XMLHttpRequest();
        request.onreadystatechange = function() {
            if(request.readyState == 4&&request.status == 200) {
                console.log(request.responseText);      
            }
        };
        request.open(type,url,true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(content);
}



function init() {
    $('#add-item-button').click(addList);
    $('#get-item-button').click(getList);
    $('#to-do-list-items').click(updateAndDelete);
        
}

function addList() {

var text1 = $('#add-list-item').val();
xmlrequest("post","listItem","desc="+text1);
//naveen's code
}

function getList() {
    console.log("getList");
    //sowmya's code
}
function updateAndDelete() {
    console.log("updateDelete");
    //raxir and gayathri code 
}