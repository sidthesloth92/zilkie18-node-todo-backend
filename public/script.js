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
    $('#to-do-list-items').click(function updateAndDelete1(event){
        updateAndDelete(event);
    });
        
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

function updateAndDelete(event) {
    console.log("updateDelete");
    var element = event.srcElement;
    var getId = element.dataset.id.split('-');
    if(getId[0] == 'delete') {
        if(window.confirm('Do you want to delete the selected list item?') == true) {
            document.querySelector('.listitem-'+getId[3]).remove();
            //Code for gayathri
        }
    } else if(getId[0] == 'update') {
        if(document.querySelector('.task-desc-' + getId[3]).classList.contains('strike-text')){
            document.querySelector('.task-desc-' + getId[3]).classList.remove('strike-text');
            element.innerHTML = 'Check';
            xmlrequest("put", "checkListItem/"+getId[3], null)
        } else {
            document.querySelector('.task-desc-' + getId[3]).classList.add('strike-text');
            element.innerHTML = 'Uncheck';
            xmlrequest("put", "uncheckListItem/"+getId[3], null)
        }
    }
}