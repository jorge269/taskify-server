const express = require("express");
const router = express.Router();

const TaskController = require("../controllers/TaskController");

/**
 * @route GET /tasks
 * @description Retrieve all tasks.
 * @access Public
 */
router.get("/", (req, res) => TaskController.getAll(req, res));

/**
 * @route GET /tasks/:id
 * @description Retrieve a task by ID.
 * @param {string} id - The unique identifier of the task.
 * @access Public
 */
router.get("/:id", (req, res) => TaskController.read(req, res));

/**
 * @route POST /tasks
 * @description Create a new task.
 * @body {string} title - The title of the task.
 * @body {string} [description] - The description of the task (optional).
 * @body {Date} date - The due date of the task.
 * @body {string} [status] - The status of the task ('done', 'doing', 'to do'). Defaults to 'to do'.
 * @access Public
 */
router.post("/", (req, res) => TaskController.create(req, res));

router.put("/editTask/:id", (req, res) => TaskController.editTask(req, res));
/**
 * @route PUT /tasks/:id
 * @description Update an existing task by ID.
 * @param {string} id - The unique identifier of the task.
 * @body {string} [title] - Updated title (optional).
 * @body {string} [description] - Updated description (optional).
 * @body {Date} [date] - Updated due date (optional).
 * @body {string} [status] - Updated status (optional).
 * @access Public
 */
router.put("/:id", (req, res) => TaskController.update(req, res));

/**
 * @route DELETE /tasks/:id
 * @description Delete a task by ID.
 * @param {string} id - The unique identifier of the task.
 * @access Public
 */
router.delete("/:id", (req, res) => TaskController.delete(req, res));

/**
 * @route  /tasks/:id
 * @description add a task .
 * @access Public
 */
router.post("/addTask", (req, res) => TaskController.create(req, res));

/**
 * @route get /tasks/userTask/:id
 * @description Get a task by ID user.
 * @param {string} id - The unique identifier of the task.
 * @access Public
 */
router.get("/userTask/:userId", (req, res) => TaskController.readByUser(req, res));

/**
 * Export the router instance to be mounted in the main routes file.
 */
module.exports = router;