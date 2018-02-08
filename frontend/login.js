window.onload = function () {
    // window.location="http://www.google.co.in";
}

function xmlrequest(type, url, content, callback) {
    var request = new window.XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
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

$('document').ready(function () {
    $('#submit').click(function () {
        var uname = $('#username').val();
        var pass = $('#password').val();
        xmlrequest('POST', 'login', 'uname=' + uname + '&password=' + pass, checkToken);
    });
});

function checkToken(response) {
    var json = JSON.parse(response);
    if (json.isSuccess == true) {
        document.cookie = "jwtToken=" + json.data;
        window.location = "http://127.0.0.1:8080/";
    }
    else {
        console.log(json);
    }
}
