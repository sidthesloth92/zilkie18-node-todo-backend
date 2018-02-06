module.exports = {
    POST_ID : "select MAX(id) as id from todo_data",
    INSERT_QUERY : "Insert into todo_data (id,description) values (?, ?)",
    GET_QUERY : "select * from todo_data",
    PUT_STATUS : "SELECT is_checked from todo_data where id = ?",
    PUT_UPDATE : "UPDATE todo_data SET is_checked = ? WHERE id = ?",
    DELETE_QUERY : "delete from todo_data where id=?"
}