var ul = document.querySelector("ul");
var todosUl = window.document.querySelector('ul');
var fragment = window.document.createDocumentFragment();

window.onload=function() {
    init();
}

function xmlrequest(type,url,content=null,func=null) {
    // define the type of request either get,put,delete or post
        var request = new window.XMLHttpRequest();
        request.onreadystatechange = function() {
            if(request.readyState == 4&&request.status == 200) {
                if(func!=null) {
                func(request.responseText);
                }      
            }
        };
        request.open(type,url,true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(content);
}



function init() {
    $('#add-item-button').click(addList);
    $('#get-item-button').click(getTodos);
    $('#to-do-list-items').click(function updateAndDelete1(event){
        updateAndDelete(event);
    });
        
}

function addList() {
    var text = $('#add-list-item').val().replace(/^\s+$/g, '');
    if(text.length == 0) {
        alert('Enter the task in the text field');
    } else {
        xmlrequest("post","listItem","desc="+text,addTodosToPage);
    }
}


//Create an element in the UI list
var view = {
    createDelButton: function (id) {
        var delButton = window.document.createElement('span');
        delButton.textContent = 'Delete';
        delButton.classList.add('delete-button');
        delButton.classList.add('list-button');
        delButton.className = 'delete-button list-button';
        delButton.dataset.id="delete-item-button-"+id;
        return delButton;
    },
    createStrikeButton: function (id) {
        var strikeButton = window.document.createElement('span');
        strikeButton.textContent = 'check';
        strikeButton.classList.add('checked-button');
        strikeButton.classList.add('list-button');
        strikeButton.dataset.id="update-item-button-"+id;
        return strikeButton;
    },
    createUIItem: function (todoItem) {
    var id = todoItem.id;
    var newList = document.createElement('li');
    newList.classList.add('list');
    var listText = document.createElement('div');
    listText.classList.add('list-text'); 
    listText.textContent=todoItem.desc;
    listText.dataset.id='list-text-'+id;
    newList.dataset.id='list-item-'+id;
    newList.appendChild(listText);
    newList.appendChild(view.createStrikeButton(id));
    newList.appendChild(view.createDelButton(id));
    return newList;       
    }
};
//Adding todos to page after retrieving
function addTodosToPage(todos) {
    var toDo = JSON.parse(todos);
    var element = document.getElementById("to-do-list-items");
    var fragment = document.createDocumentFragment();
    if(toDo.listItems.length<=0) {
        alert('The list is empty');
    }
    else {
        for (var i = 0; i < toDo.listItems.length; i++) {
        var todoItem = toDo.listItems[i];
        fragment.appendChild(view.createUIItem(todoItem));
        }
    element.insertBefore(fragment,element.childNodes[0]); 
}
}
//Retreive todoItems 
    function getTodos () {
    xmlrequest('GET','listItem',null,addTodosToPage);
    document.getElementById('get-item-button').classList.add("dont-display");
    }



function updateAndDelete(event) {
    var element = event.target;
    var getId = element.dataset.id.split('-');
    if(getId[0] == 'delete') {
        if(window.confirm('Do you want to delete the selected list item?') == true) {
            window.document.querySelector('li[data-id="list-item-'+getId[3]+'"]').remove();
            xmlrequest("delete", "listItem?id="+getId[3], null, null);
        }
    } else if(getId[0] == 'update') {
        if(document.querySelector('div[data-id="list-text-' + getId[3]+'"]').classList.contains('line-through')){
            document.querySelector('div[data-id="list-text-' + getId[3]+'"]').classList.remove('line-through');
            element.innerHTML = 'Check';
            xmlrequest("put", "checkListItem?id="+getId[3], null, null);
        } else {
            document.querySelector('div[data-id="list-text-' + getId[3]+'"]').classList.add('line-through');
            element.innerHTML = 'Uncheck';
            xmlrequest("put", "uncheckListItem?id="+getId[3], null, null);
        }
    }
}

