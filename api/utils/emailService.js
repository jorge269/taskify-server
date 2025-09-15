const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // your-email@gmail.com
            pass: process.env.EMAIL_APP_PASSWORD // Gmail app password
        }
    });
};

const sendPasswordResetEmail = async (email, resetToken) => {
    const transporter = createTransporter();
    
    const resetURL = `${process.env.FRONTEND_URL}/#/changePassword?token=${resetToken}`;
    
    const mailOptions = {
        from: `"Taskify Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Your Taskify Password',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
                    .content { padding: 30px 20px; }
                    .button { 
                        background-color: #007bff; 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        display: inline-block;
                        margin: 20px 0;
                    }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
                    .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Taskify Password Reset</h1>
                    </div>
                    
                    <div class="content">
                        <h2>Hola!</h2>
                        <p>We received a request to reset your Taskify account password.</p>
                        
                        <p>Click the button below to create a new password:</p>
                        <a href="${resetURL}" class="button">Reset My Password</a>
                        
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #007bff;">${resetURL}</p>
                        
                        <div class="warning">
                            <strong>⚠️ Important:</strong>
                            <ul>
                                <li>This link expires in <strong>1 hour</strong></li>
                                <li>If you didn't request this reset, please ignore this email</li>
                                <li>Your password won't change until you create a new one</li>
                            </ul>
                        </div>
                        
                        <p>Need help? Reply to this email and we'll get back to you.</p>
                    </div>
                    
                    <div class="footer">
                        <p>Best regards,<br><strong>The Taskify Team</strong></p>
                        <p><small>This is an automated email. Please don't reply to this address.</small></p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

const sendWelcomeEmail = async (email, name) => {
    const transporter = createTransporter();
    
    const mailOptions = {
        from: `"Taskify Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Taskify! 🎉',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to Taskify, ${name}! 🎉</h2>
                <p>Thanks for joining us! You're all set to start organizing your tasks.</p>
                <p><a href="${process.env.FRONTEND_URL}/login" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Get Started</a></p>
                <p>If you have any questions, feel free to reach out!</p>
                <p>Happy organizing!<br>The Taskify Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Welcome email failed:', error);
        return { success: false };
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendWelcomeEmail
};