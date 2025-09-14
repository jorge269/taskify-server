const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");

/**
 * Controller class for managing User resources.
 * 
 * Extends the generic {@link GlobalController} to inherit
 * CRUD operations, using the {@link UserDAO} as the data access layer.
 */
class UserController extends GlobalController {
    /**
     * Create a new UserController instance.
     * 
     * The constructor passes the UserDAO to the parent class so that
     * all inherited methods (create, read, update, delete, getAll)
     * operate on the User model.
     */
    constructor() {
        super(UserDAO);
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required"
                });
            }

            // Use UserDAO to find user by email and password
            // Assuming UserDAO has a method to find by criteria
            const users = await this.dao.getAll({ email, password });
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            // Return success response
            res.status(200).json({
                message: "Login successful",
                user: {
                    id: user._id || user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    };

    register = async (req, res) => {
        try {
            const { name, lastName, age, email, password } = req.body;
            const users = await this.dao.getAll({ email });

            if (users.find(u => u.email === email)) {
                return res.status(409).json({
                    message: "The email provided is already registered"
                })
            }

            const newUser = await this.dao.create({
                name,
                lastName,
                age,
                email,
                password
            });

            res.status(201).json({
                message: "The user has been sucessfully registered",
                newUser: {
                    id: newUser.id
                }
            })
        }
        catch (error) {
            console.error("Register error:", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    };

}

/**
 * Export a singleton instance of UserController.
 * 
 * This allows the same controller to be reused across routes
 * without creating multiple instances.
 */
module.exports = new UserController();