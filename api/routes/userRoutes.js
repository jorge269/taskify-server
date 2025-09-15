const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");

/**
 * @route GET /users
 * @description Retrieve all users.
 * @access Public
 */
router.get("/", (req, res) => UserController.getAll(req, res));

/**
 * @route GET /users/:id
 * @description Retrieve a user by ID.
 * @param {string} id - The unique identifier of the user.
 * @access Public
 */
router.get("/:id", (req, res) => UserController.read(req, res));

/**
 * @route POST /users
 * @description Create a new user.
 * @body {string} username - The username of the user.
 * @body {string} password - The password of the user.
 * @access Public
 */
router.post("/", (req, res) => UserController.create(req, res));

/**
 * @route PUT /users/:id
 * @description Update an existing user by ID.
 * @param {string} id - The unique identifier of the user.
 * @body {string} [username] - Updated username (optional).
 * @body {string} [password] - Updated password (optional).
 * @access Public
 */
router.put("/:id", (req, res) => UserController.update(req, res));

/**
 * @route PUT /users/:id
 * @description Update an existing user by ID.
 * @param {string} id - The unique identifier of the user.
 * @body {string} [password] - Updated password (optional).
 * @access Public
 */
router.put("changePasword/:id", (req, res) => UserController.update(req, res));

/**
 * @route DELETE /users/:id
 * @description Delete a user by ID.
 * @param {string} id - The unique identifier of the user.
 * @access Public
 */
router.delete("/:id", (req, res) => UserController.delete(req, res));

/**
 * Export the router instance to be mounted in the main routes file.
 */

/**
 * @route Post /users/login
 * @description login by email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @access Public
 */
router.post("/login", (req, res) => UserController.login(req, res));

/**
 * @route Post /users/login
 * @description sing up 
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {int} age 
 * @param {string} name 
 * @param {string} lastName 
 * @access Public
 */
router.post("/register", (req, res)=> UserController.register(req, res));

module.exports = router;
