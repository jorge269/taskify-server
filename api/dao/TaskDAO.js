const Task = require("../models/Task");
const GlobalDAO = require("./GlobalDAO");
/**
 * Data Access Object (DAO) for the Task model.
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for User documents.
 */
class TaskDAO extends GlobalDAO{
    constructor(){
        super(Task);
    }
}

module.exports = new TaskDAO();