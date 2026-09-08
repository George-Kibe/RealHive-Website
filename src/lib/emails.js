import nodemailer from 'nodemailer';
import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
    RESET_OTP_EMAIL_TEMPLATE
} from "./emailTemplates";

// Email Verification 
export const sendVerificationEmail = async (email, verificationToken) => {
    // Create a Nodemailer transport object (configure with your email provider)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

	try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome to RealHive, Verify Your Email`,
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);
		throw new Error(`Error sending verification email: ${error}`);
	}
};

// welcome email
export const sendWelcomeEmail = async (email, name) => {
    // Create a Nodemailer transport object (configure with your email provider)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

	try {
        const mailOptions = {
            from: 'Realhive Real Estate Website',
            to: email,
            subject: `Welcome to Realhive, ${name}`,
            html: WELCOME_EMAIL_TEMPLATE.replaceAll("{username}", name.toUpperCase()),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);
		throw new Error(`Error sending welcome email: ${error}`);
	}
};

// send email with reset token 
export const sendResetPasswordEmail = async (email, resetToken) => {
     // Create a Nodemailer transport object (configure with your email provider)
     const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

	try {
        const mailOptions = {
            from: 'buenasconsultants@gmail.com',
            to: email,
            subject: `Password Reset Request`,
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending reset email`, error);
		throw new Error(`Error sending reset email: ${error}`);
	}
}
// send email with OTP to reset password
export const sendResetPasswordMobileEmail = async (email, otp) => {
    // Create a Nodemailer transport object (configure with your email provider)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

	try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Password Reset Request`,
            html: RESET_OTP_EMAIL_TEMPLATE.replace("{otp}", otp),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending reset email`, error);
		throw new Error(`Error sending reset email: ${error}`);
	}
}

// email reset success
export const sendPasswordResetSuccessEmail = async (email, username) => {
    // Create a Nodemailer transport object (configure with your email provider)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
	try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Password Reset Success`,
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replaceAll("{username}", username.toUpperCase()),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending reset success email`, error);
		throw new Error(`Error sending reset success email: ${error}`);
	}
}

// send property added success email
export const sendPropertyAddedSuccessEmail = async (email, property) => {
    // Create a Nodemailer transport object (configure with your email provider)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
	try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Property Added Success`,
            html: "" // PROPERTY_ADDED_SUCCESS_TEMPLATE.replaceAll("{property}", property),
          }
        // Send the email
        const response = await transporter.sendMail(mailOptions);
		// console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending property added success email`, error);
		throw new Error(`Error sending property added success email: ${error}`);
	}
}