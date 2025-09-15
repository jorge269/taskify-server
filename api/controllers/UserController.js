const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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

            const users = await this.dao.getAll({ email });
            const user = users.find(u => u.email === email);

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Compare plain password with stored hash - DON'T hash the input password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            res.cookie('authToken', token, {
                httpOnly: true,        // Prevents XSS attacks
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: 'strict',    // CSRF protection
                maxAge: 2 * 60 * 60 * 1000  // 2 hours in milliseconds
            });

            // Return success response
            res.status(200).json({
                message: "Login successful",
                token: token
                // user: {
                //     id: user._id || user.id,
                //     email: user.email,
                //     firstName: user.name,
                //     lastName: user.lastName
                // }
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

            const users = await this.dao.getAll();
            const existingUser = users.find(u => u.email === email);

            if (existingUser) {
                return res.status(409).json({
                    message: "The email provided is already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await this.dao.create({
                name,
                lastName,
                age,
                email,
                password: hashedPassword
            });

            res.status(201).json({
                message: "The user has been sucessfully registered",
                newUser: {
                    id: newUser._id || newUser.id
                }
            })
        }
        catch (error) {
            // console.error("Register error:", error);
            if (error.code === 11000 || error.message.includes('E11000')) {
                return res.status(409).json({
                    message: "The email provided is already registered"
                });
            }
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