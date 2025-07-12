import bcrypt, { truncates } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailtemplate.js';

//function for registering user and store its data in database
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' })
    }

    try {

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //sending welcom email on successful registeration
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to SkillConnect',
            text: `Welcome to SkillConnect, ${email} one stop solution for all you doubts and discussions, Connect with Likely Peers and experienced Mentors`

        }

        await transporter.sendMail(mailOptions)

        return res.json({ success: true });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//end of "register" function


//function for user login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password both are required" })
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email' })
        }
        // console.log("user", user);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Incorrect Password' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true });
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }

}
//end of "login" function

//function for logout user and delete its entries from cookies
export const logout = async (req, res) => {

    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
        });

        return res.json({ success: true, message: "Logged out" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}
//end of "logout" function


//function for Sending verify email otp to user
export const sendVerifyOtp = async (req, res) => {

    try {

        const userId = req.userId;

        // console.log(userId);


        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account Already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 1 * 60 * 60 * 1000

        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            // text : `Verify your Account, Here is your One time password (OTP), ${otp}`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: 'Verification OTP sent on Email' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};
//end of "sendVerifyOtp" function

//function for verifying email using otp sent on mail
export const verifyEmail = async (req, res) => {

    // console.log("req body", req.body);

    const userId = req.userId;
    const { otp } = req.body;

    if (!userId || !otp) {
        res.json({ success: false, message: "Missing details" })
    }

    try {

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verifyotp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Please enter correct OTP!" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired!" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: "Email verified Successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
//end of "verifyEmail" function

//function to check if user is Authenticated
export const isAuthenticated = async (req, res) => {

    try {
        return res.json({ success: true });

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}
//end of "isAuthenticated" function

//function to send password reset OTP'
export const sendResetOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" })
    }

    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset Password',
            // text : `To Reset you password, Here is your One time password (OTP), ${otp}`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: 'OTP sent to your email' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// function to reset password using OTP generated by "sendResetOtp" function
export const resetPassword = async (req, res) => {

    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP and new password are required" });
    }

    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Not Fount" });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        user.resetOtp = "";

        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Password has been reset Successfully" });

    } catch (error) {

        return res.json({ success: false, message: error.message })

    }

}
