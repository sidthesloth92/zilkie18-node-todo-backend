var ul = document.querySelector("ul");
var todosUl = window.document.querySelector('ul');
var fragment = window.document.createDocumentFragment();

window.onload = function () {
    init();
    console.log(document.cookie);
    getTodos();
}
//Retreive todoItems on load
function getTodos() {
    var token = getToken(document.cookie, 'jwtToken');
    xmlrequest('GET', 'list-item?token='+token, "", addTodosToPage);
    document.getElementById('get-item-button').classList.add("dont-display");
}

function xmlrequest(type, url, content, callback) {
    // define the type of request either get,put,delete or post
    var request = new window.XMLHttpRequest({ mozSystem: true });
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            console.log(request.responseText);
            if (callback != undefined) {
                callback(request.responseText);
            }
        }
    };
    request.open(type, "http://localhost:3000/" + url, true);
    request.setRequestHeader("Access-Control-Allow-Methods", "*");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(content);
}

function init() {
    $('#add-item-button').click(addList);
    $('#to-do-list-items').click(function updateAndDelete1(event) {
        updateAndDelete(event);
    });
}

function addList() {
    var text = $('#add-list-item').val().replace(/^\s+$/g, '');
    var token = getToken(document.cookie, 'jwtToken');

    if (text.length == 0) {
        alert('Enter the task in the text field');
    } else {
        xmlrequest("POST", "list-item", "token=" + token + "&desc="+text, addTodosToPage);
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
        delButton.dataset.id = "delete-item-button-" + id;
        return delButton;
    },
    createStrikeButton: function (id) {
        var strikeButton = window.document.createElement('span');
        strikeButton.textContent = 'Check';
        strikeButton.classList.add('checked-button');
        strikeButton.classList.add('list-button');
        strikeButton.dataset.id = "update-item-button-" + id;
        return strikeButton;
    },
    createUIItem: function (todoItem) {
        var id = todoItem.id;
        var newList = document.createElement('li');
        newList.classList.add('list');
        var listText = document.createElement('div');
        listText.classList.add('list-text');
        listText.textContent = todoItem.description;
        listText.dataset.id = 'list-text-' + id;
        newList.dataset.id = 'list-item-' + id;
        newList.appendChild(listText);
        var checkStrikeButton = view.createStrikeButton(id);
        if (todoItem.is_checked == 1) {
            listText.classList.add("line-through");
            checkStrikeButton.innerHTML = "Uncheck";
        }
        newList.appendChild(checkStrikeButton);
        newList.appendChild(view.createDelButton(id));
        return newList;
    }
};
//Adding todos to page after retrieving
function addTodosToPage(todos) {
    var response = JSON.parse(todos);
    if (response.isSuccess == true) {
        var toDo = response.data;
        var element = document.getElementById("to-do-list-items");
        var fragment = document.createDocumentFragment();
        if (toDo.id > 0) {
            fragment.appendChild(view.createUIItem(toDo));
        }
        else if (toDo.length > 0) {
            for (var i = 0; i < toDo.length; i++) {
                var todoItem = toDo[i];
                fragment.appendChild(view.createUIItem(todoItem));
            }
        }
        element.insertBefore(fragment, element.childNodes[0]);
    }
}

function getToken(cookie, key) {
    var ca = cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c[0] == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(key) == 0) {
            return c.substring(key.length + 1).trim();
        }
    }
    return "";
}

function updateAndDelete(event) {

    var element = event.target;
    var getId = element.dataset.id.split('-');
    if (getId[0] == 'delete') {
        if (window.confirm('Do you want to delete the selected list item?') == true) {
            xmlrequest("delete", "list-item/" + getId[3], null, deleteItem);
        }
    } else if (getId[0] == 'update') {
        xmlrequest("put", "list-item", "id=" + getId[3], updateUIItem);
    }
}
function deleteItem(responseData) {
    var isSuccess = JSON.parse(responseData).isSuccess;
    var id = JSON.parse(responseData).data;
    if (isSuccess) {
        window.document.querySelector('li[data-id="list-item-' + id + '"]').remove();

    }
}



function updateUIItem(updateResponseData) {
    var id = (JSON.parse(updateResponseData)).data;
    if (JSON.parse(updateResponseData).isSuccess == true) {
        if (document.querySelector('div[data-id="list-text-' + id + '"]').classList.contains('line-through')) {
            document.querySelector('div[data-id="list-text-' + id + '"]').classList.remove('line-through');
            document.querySelector('.checked-button[data-id="update-item-button-' + id + '"]').innerHTML = 'Check';
        } else {
            document.querySelector('div[data-id="list-text-' + id + '"]').classList.add('line-through');
            document.querySelector('.checked-button[data-id="update-item-button-' + id + '"]').innerHTML = 'Uncheck';
        }
    }
}
