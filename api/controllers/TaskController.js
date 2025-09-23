const GlobalController = require("./GlobalController");
const TaskDAO = require("../dao/TaskDAO");

class TaskController extends GlobalController{
    constructor(){
        super(TaskDAO);
    }

    editTask = async (req, res) => {
        try {
            const { title, description, date, status } = req.body

            if (!title || !date){
                return res.status(400).json({
                    message: "Completa los campos necesarios"
                });
            }

            if (new Date(date) < new Date()){
                return res.status(400).json({
                    message: "La fecha debe de ser futura"
                })
            }

            const updatedTask = await this.dao.update(req.params.id, {
                title: title, description: description,  date: date, status: status
            })
            
            res.status(200).json(updatedTask);


        } catch (error){
            console.error("Edit task error:", error);
        }
    }
    
}

module.exports = new TaskController();