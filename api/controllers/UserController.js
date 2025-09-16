const GlobalController = require("./GlobalController");
const UserDAO = require("../dao/UserDAO");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/emailService');
const crypto = require('crypto');


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
                    message: "Completa los campos necesarios"
                });
            }

            const users = await this.dao.getAll({ email });
            const user = users.find(u => u.email === email);

            if (!user) {
                return res.status(401).json({ message: "Credenciales invalidas" });
            }

            // Compare plain password with stored hash - DON'T hash the input password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: "Credenciales invalidas" });
            }

            const token = jwt.sign(
                {
                    id: user.id || user._id,
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
                message: "Inicio de sesión exitoso",
                token: token
            });

        } catch (error) {
            console.error("Error de inicio de sesión:", error);
            res.status(500).json({
                message: "Error del servidor interno"
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
                    message: "El email ingresado ya esta registrado"
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
                message: "El usuario se ha registrado exitosamente",
                newUser: {
                    id: newUser._id || newUser.id
                }
            })
        }
        catch (error) {
            if (error.code === 11000 || error.message.includes('E11000')) {
                return res.status(409).json({
                    message: "El email ingresado ya esta registrado"
                });
            }
            res.status(500).json({
                message: "Error del servidor interno"
            });
        }
    };

    requestPasswordReset = async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    message: "Email is required"
                });
            }

            const users = await this.dao.getAll();
            const user = users.find(u => u.email === email);

            // Always return success for security (don't reveal if email exists)
            if (!user) {
                return res.status(404).json({
                    message: "El correo no está registrado"
                });
            }

            // Generate secure reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

            // Save token to user (you'll need to add these fields to your user schema)
            await this.dao.update(user.id, {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetTokenExpiry
            });

            // Send email
            const emailResult = await sendPasswordResetEmail(email, resetToken);

            if (!emailResult.success) {
                console.error('Failed to send reset email:', emailResult.error);
                return res.status(500).json({
                    message: "Error sending email. Please try again later."
                });
            }

            res.status(200).json({
                message: "The link for the recover password has been sent"
            });

        } catch (error) {
            console.error("Password reset request error:", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    };
    // ...existing code...
    changePassword = async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            const users = await this.dao.getAll();

            console.log("Received token:", token);
            console.log("User:", users.filter(u => u.resetPasswordToken == token))
            const user = users.find(u =>
                u.resetPasswordToken === token && new Date(u.resetPasswordExpires) > new Date()
            );

            // Find user by reset token
            if (!user) {
                return res.status(400).json({
                    message: "Invalid or expired reset token"
                });
            }

            if (
                newPassword.length < 8 ||
                !/[A-Z]/.test(newPassword) ||
                !/[0-9]/.test(newPassword) ||
                !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
            ) {
                return res.status(400).json({
                    message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial."
                });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 12);

            // Update user password and clear reset token
            await this.dao.update(user._id, {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            });

            res.status(200).json({
                message: "Password has been reset successfully"
            });

        } catch (error) {
            console.error("Password reset error:", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    };

    editMyInfo = async (req, res) => {
        try {
                        const token = req.cookies.authToken; 

            const { name, lastName, age, email} = req.body
            // const token = req.cookies.authToken;
            const user = decodeJWT(token)

        if (!token){
return res.status(401).json({ 
                message: 'Access token required' 
            });        }

            if(!name || !lastName) {
                return res.status(404).json({ 
                message: 'Fill all the fields' 
            });
            }

            const updatedUser = await this.dao.update( user.id, {
                name: name, lastName: lastName, age: age, email: email
            })

res.status(200).json({
            message: "User has been successfully updated",
            user: updatedUser
        });
       }
catch (error){
    console.error("An error has occured updating the User", error)
}
    }
    myInformation = async (req, res) => {
        try{
            const token = req.cookies.authToken; 
            const user = decodeJWT(token);
// If it doesnt find a token then it will return an error bc its not logged in
        if (!token) {
            return res.status(401).json({ 
                message: 'Access token required' 
            });
        }

            const userRead = await this.dao.read(user.id);
            res.status(200).json(userRead);


        }catch (error){
            console.error("Error retrieving user data:", error);
        res.status(500).json({
            message: "Internal server error"
        });

        }
    }
}


function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    // Return user object from token payload
    return {
      id: decoded.id || decoded.userId || decoded._id,
      email: decoded.email,
      // Add other fields your token contains
    };
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Export a singleton instance of UserController.
 * 
 * This allows the same controller to be reused across routes
 * without creating multiple instances.
 */
module.exports = new UserController();