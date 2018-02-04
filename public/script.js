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
    // $('#get-item-button').click(getList);
    $('#to-do-list-items').click(function updateAndDelete1(event){
        updateAndDelete(event);
    });
        
}

function addList() {
    var text = $('#add-list-item').val().replace(/^\s+$/g, '');
    if(text.length == 0) {
        alert('Enter the task in the text field');
    } else {
        xmlrequest("post","listItem","desc="+text,createItem);
    }
}


//Create an element in the UI 
var view = {
    createDelButton: function (id) {
        var delButton = window.document.createElement('button');
        delButton.textContent = 'Delete';
        delButton.className = 'delete-button list-button';
        delButton.setAttribute('data-delete-id', id);
        return delButton;
    },
    createStrikeButton: function () {
        var strikeButton = window.document.createElement('button');
        strikeButton.textContent = 'Completed';
        strikeButton.className = 'checked-button list-button';
        return strikeButton;
    },
    createUIItem: function (todoItem) {
        var li = window.document.createElement('li');
        var todoDiv = window.document.createElement('div');
        var id = todoItem.id;
        todoDiv.setAttribute('data-id', '' + id + '');
        todoDiv.classList.add("todo-item-div");
        todoDiv.classList.add("list");
        fragment.appendChild(todoDiv);
        todoDiv.appendChild(li);
        todoDiv.appendChild(view.createDelButton(id));
        todoDiv.appendChild(view.createStrikeButton());
        li.innerHTML = todoItem.desc;
    }
};
//Adding todos to page after retrieving
function addTodosToPage(position, todos) {
    for (var i = 0; i < position; i++) {
        var todoItem = todos.listItems[i];
        console.log(todoItem);
        view.createUIItem(todoItem);
        todosUl.insertBefore(fragment, todosUl.childNodes[0]);
    }
}
//Retreive todoItems 
window.document.getElementById('get-item-button').addEventListener('click', function () {
    var request = new XMLHttpRequest();
    request.open('GET', "listItem", true);
    request.onreadystatechange = handleRequestStateChange;
    request.send();
    document.getElementById('get-item-button').classList.add("dont-display");
});
//Request Handler
var handleRequestStateChange = function handleRequestStateChange() {
    if (this.readyState == this.DONE && this.status == 200) {
        if (this.responseText) {
            var todoText = JSON.parse(this.responseText);
            if (todoText.listItems.length === 0) {
                ul.innerHTML = "No Todos added";
            }
            else {
                var n = todoText.listItems.length;
                addTodosToPage(n, todoText);
            }
        }
    }
}

function updateAndDelete(event) {
    var element = event.target;
    var getId = element.dataset.id.split('-');
    if(getId[0] == 'delete') {
        if(window.confirm('Do you want to delete the selected list item?') == true) {
            window.document.querySelector('li[data-id="'+getId[4]+'"]').remove();
            xmlrequest("delete", "listItem?id="+getId[4], null, null);
        }
    } else if(getId[0] == 'update') {
        if(document.querySelector('div[data-id="list-text-' + getId[4]+'"]').classList.contains('line-through')){
            document.querySelector('div[data-id="list-text-' + getId[4]+'"]').classList.remove('line-through');
            element.innerHTML = 'Check';
            xmlrequest("put", "checkListItem?id="+getId[4], null, null);
        } else {
            document.querySelector('div[data-id="list-text-' + getId[4]+'"]').classList.add('line-through');
            element.innerHTML = 'Uncheck';
            xmlrequest("put", "uncheckListItem?id="+getId[4], null, null);
        }
    }
}

function createItem(id) {
    var text = $('#add-list-item').val().replace(/^\s+$/g, '');
    var element = document.getElementById("to-do-list-items");
    var fragment = document.createDocumentFragment();
    var newList = document.createElement('li');
    newList.classList.add('list');
    var listText = document.createElement('div');
    listText.classList.add('list-text'); 
    var deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-button');
    deleteButton.classList.add('list-button');
    var checkedButton=document.createElement('span');
    checkedButton.classList.add('checked-button');
    checkedButton.classList.add('list-button');
    listText.textContent=text;
    var currentCheckId = 'update-item-button-id-'+id;
    var currentDeleteId = 'delete-item-button-id-'+id;
    newList.dataset.id=id;
    listText.dataset.id='list-text-'+id;
    checkedButton.dataset.id=currentCheckId;
    deleteButton.dataset.id=currentDeleteId;
    deleteButton.textContent='Delete';
    checkedButton.textContent='Check';
    newList.appendChild(listText);
    newList.appendChild(checkedButton);
    newList.appendChild(deleteButton);
    fragment.appendChild(newList);
    element.insertBefore(fragment,element.childNodes[0]);
}
