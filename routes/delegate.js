var queries = require('./queries');
var dao = require('./dao');
var mysql = require('mysql');

function CreateListItem(id, desc) {
    this.id = id;
    this.description = desc;
    this.isChecked = false;
}
function CreateResponse(isSuccess, errorCode, data) {
    this.isSuccess = isSuccess;
    this.errorCode = errorCode;
    this.data = data;
}

module.exports = {
    addListItem: function (req) {
        return new Promise(function (resolve, reject) {
            var getIdStatement = queries.POST_ID;
            dao.executeQuery(getIdStatement).then(function (result) {
                var id = result[0].id == null ? 1 : result[0].id + 1;
                var listItem = new CreateListItem(id, req.body.desc);
                var insertListStatement = mysql.format(queries.INSERT_QUERY, [id, req.body.desc]);
                dao.executeQuery(insertListStatement).then(function (result) {
                    var response = new CreateResponse(true, "", JSON.stringify(listItem));
                    resolve(response);
                }).catch(function (error) {
                    var response = new CreateResponse(false, error, "");
                    reject(response);
                });

            }).catch(function (error) {
                var response = new CreateResponse(false, error, "");
                reject(response);
            });
        });
    },
    updateListItem: function (req) {
        return new Promise(function (resolve, reject) {
            var id = req.body.id;
            var getCheckedStatus = mysql.format(queries.GET_STATUS, [id]);
            dao.executeQuery(getCheckedStatus).then(function (result) {
                var isChecked = result[0].is_checked == 0 ? 1 : 0;
                var updateCheckedStatus = mysql.format(queries.PUT_UPDATE, [isChecked, id]);
                dao.executeQuery(updateCheckedStatus).then(function (result) {
                    var response = new CreateResponse(true, "", id);
                    resolve(response);
                }).catch(function(error) {
                    var response = new CreateResponse(false, error, "");
                    reject(response);
                })
            }).catch(function (error) {
                var response = new CreateResponse(false, error, "");
                reject(response);
            });
        });
    }
}