module.exports = {
    POSTID : "select MAX(id) as id from todo_data",
    INSERTQUERY : "Insert into todo_data (id,description) values (?, ?)",
    GETQUERY : "select * from todo_data",
    PUTSTATUS : "SELECT is_checked from todo_data where id = ?",
    PUTUPDATE : "UPDATE todo_data SET is_checked = ? WHERE id = ?",
    DELETEQUERY : "delete from todo_data where id=?"
}