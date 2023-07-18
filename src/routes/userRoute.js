import { Router } from "express";
import { Op } from "sequelize";
import userModel from "../models/userModel.js";
import liveModel from "../models/liveModel.js";
import videoModel from "../models/videoModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";
import axios from "axios";
import { validationResult } from "express-validator";
import sequelize from "sequelize";

const router = Router();

router.get("/admin", async (req, res) => {
    const users = await userModel.count({
        where: {
            type: 'user'
        }
    });
    const admins = await userModel.count({
        where: {
            type: 'admin'
        }
    });
    const videos = await videoModel.count();
    const data = await userModel.findAll({
        where: {
            type: 'user'
        }
    });
    const liveData = await liveModel.findAll();
    if (req.session.user_id) {


        res.render("admin", {
            "users_no": users,
            "admins_no": admins,
            "videos_no": videos,
            "name": req.session.user_name,
            "isLogin": req.session.user_id ? true : false,
            data, liveData
        });
    } else {
        res.redirect("/login")
    }

});

router.get("/livePlayer", async (req, res) => {
    if (req.session.user_id) {
    const { t, d, v } = req.query;
    const liveData = await liveModel.findAll();
    const otherData = await liveModel.findAll({
        where: {
            title: {
                [Op.ne]: t
            }
        }
    });
    res.render("live_player", {
        "isLogin": req.session.user_id ? true : false,
        liveData,
        otherData,
        t, d, v
    });
    } else {
        res.redirect("/login");
    }
});
router.get("/videoPlayer", async (req, res) => {
    if (req.session.user_id) {
    const { t, d, v } = req.query;
    const videoData = await videoModel.findAll();
    const otherData = await videoModel.findAll({
        where: {
            title: {
                [Op.ne]: t
            }
        }
    });
    res.render("video_player", {
        "isLogin": req.session.user_id ? true : false,
        videoData,
        otherData,
        t, d, v
    });
    } else {
        res.redirect("/login");
    }
});
router.get("/live", async (req, res) => {
    const data = await liveModel.findAll();
    res.render("live", {
        "isLogin": req.session.user_id ? true : false,
        data
    });
});
router.get("/highlights", async (req, res) => {
    const data = await videoModel.findAll();
    res.render("highlights", {
        "isLogin": req.session.user_id ? true : false,
        data
    });
});
router.get("/sports", async (req, res) => {
    res.render("sports", {
        "isLogin": req.session.user_id ? true : false,
    });
});
router.get("/athletes", async (req, res) => {
    res.render("athletes", {
        "isLogin": req.session.user_id ? true : false,
    });
});
router.get("/news", async (req, res) => {
    res.render("news", {
        "isLogin": req.session.user_id ? true : false,
    });
});
router.get('/login', (req, res) => {
    if (req.session.user_id) {
        res.redirect("/");
    } else {
        res.render("login", {
            "isLogin": req.session.user_id ? true : false,
        })
    }
});
router.get("/signup", async (req, res) => {
    if (req.session.user_id) {
        res.redirect("/");
    } else {
        res.render("signup", {
            "isLogin": req.session.user_id ? true : false,
        });
    }
});
router.get("/verify", async (req, res) => {
    res.render("verify", {
        "email": req.session.user_email,
        "sentCode": req.session.sentcode,
        "isLogin": req.session.user_id ? true : false,
    });
});
router.get("/forgotPassword", async (req, res) => {
    res.render("forgotPassword", {
        "isLogin": req.session.user_id ? true : false,
    });
});
router.get("/userVerify", async (req, res) => {
    res.render("userVerify", {
        "email": req.session.user_email,
        "sentCode": req.session.sentcode,
        "isLogin": req.session.user_id ? true : false,
    });
});
router.get("/newPassword", async (req, res) => {
    if(req.session.userVerified){
        res.render("newPassword", {
            "email": req.session.user_email,
            "isLogin": req.session.user_id ? true : false,
        });
    }else{
        res.redirect("/login");
    }
});
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});


router.post("/sendmail", async (req, res) => {
    function generateVerificationCode() {
        const length = 6;
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let verificationCode = "";
        for (let i = 0; i < length; i++) {
            verificationCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return verificationCode;
    }
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "c27d6d725dc5a4",
            pass: "4f1e43dce59a27"
        }
    });
    const code = generateVerificationCode();

    const mailOptions = {
        from: 'nodeapp@nodejs',
        to: req.body.email,
        subject: 'Email Verification',
        html: `<p>Dear user,</p><p>Your Verification Code is:   ${code} </p>`
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            req.session.sentcode = code;
            console.log('Email sent: ' + info.response + req.session.sentcode);
            res.json({ success: true, message: "Email sent Successfully" });
        }
    });
});

router.post("/verify", async (req, res) => {
    const { code, email } = req.body;
    const sentCode = req.session.sentcode;
    const temail = email.trim();
    // console.log(email);
    // console.log(temail);
    // console.log(code);
    // console.log(sentCode);

    if (!code) {
        res.json({ success: false, message: "Enter Verification Code" });
    } else if (code == sentCode) {
        const data = await userModel.update({
            verified: true
        },{
            where: {
                email: temail
            }
        });
        console.log(data[0]);
        if (data) {
            req.session.destroy;
            req.session.userVerified = true;
            res.json({ success: true, message: "Email Verified" })
        }
    } else {
        res.json({ success: false, message: "Invalid Verification Code" })
    }
});


router.post("/checkEmailId", async (req, res) => {
    const { email } = req.body;
    if (!email){
        res.json({ success: false, message: "Enter Email Address" });
    }else{
        const data = await userModel.findOne({ where: { email } });
        if (!data) {
            res.json({ success: false, message: "User Doesn't Exist With This Email Address" });
        } else {
            req.session.user_email = email;
            res.json({ success: true, message: "User Exist" });
        }
    }
});

router.post("/newPassword", async (req, res) => {
    const { password, confirm_password } = req.body;
    const email = req.session.user_email;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!password || !confirm_password) {
        return res.json({ success: false, message: "All fields are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must me atleast 8 characters long.' });
    } else if (!uppercaseRegex.test(password)) {
        return res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter.' });
    } else if (!lowercaseRegex.test(password)) {
        return res.status(400).json({ success: false, message: 'Password must contain at least one lowercase letter.' });
    } else if (!digitRegex.test(password)) {
        return res.status(400).json({ success: false, message: 'Password must contain at least one numeric digit.' });
    } else if (!specialCharRegex.test(password)) {
        return res.status(400).json({ success: false, message: 'Password must contain at least one special character.' });
    } else {

        if (password === confirm_password) {

            async function hashPassword(password) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                return hashedPassword;
            }

            const hashedPassword = await hashPassword(password);

            const data = await userModel.update({
                password: hashedPassword
            }, {
                where: {
                    email
                }
            });
            if (data) {
                return res.json({ success: true, message: "Password reset successful!" });
            } else {
                return res.json({ success: false, message: "Error while reseting password" });
            }
        } else {
            return res.json({ success: false, message: "Password didn't match" });
        }

    }
});

router.post("/signup", async (req, res) => {
    const { name, username, email, password, confirm_password, captcha, secretKey } = req.body;
    const existingUsername = await userModel.findOne({ where: { username } });
    const existingEmail = await userModel.findOne({ where: { email } });
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!name || !username || !email || !password || !confirm_password) {
        return res.json({ success: false, message: "All fields are required" });
    }
    try {
        // Verify reCAPTCHA response
        const captchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;
        const verificationResponse = await axios.post(captchaVerificationUrl);
        const { success: captchaSuccess } = verificationResponse.data;

        if (!captchaSuccess) {
            return res.json({ success: false, message: 'Captcha verification failed' });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email address" });
        } else if (existingUsername) {
            console.log(existingUsername);
            return res.status(400).json({ success: false, message: 'Username already exists' });
        } else if (existingEmail) {
            console.log(existingEmail);
            return res.status(400).json({ success: false, message: 'Email already used' });
        } else if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must me atleast 8 characters long.' });
        } else if (!uppercaseRegex.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter.' });
        } else if (!lowercaseRegex.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one lowercase letter.' });
        } else if (!digitRegex.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one numeric digit.' });
        } else if (!specialCharRegex.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one special character.' });
        } else {

            if (password === confirm_password) {

                async function hashPassword(password) {
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(password, saltRounds);
                    return hashedPassword;
                }

                const hashedPassword = await hashPassword(password);

                const data = await userModel.create({
                    fullname: name,
                    username: username,
                    email: email,
                    password: hashedPassword,
                    verified: false,
                    blocked: false,
                    type: "user"
                });
                if (data) {
                    req.session.user_email = data.email;
                    // res.redirect("/sendmail");
                    return res.json({ success: true, message: "Signed up successfully" });
                } else {
                    return res.json({ success: false, message: "Error while adding user" });
                }
            } else {
                return res.json({ success: false, message: "Password didn't match" });
            }

        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return res.json({ success: false, message: 'Error verifying reCAPTCHA response' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password, captcha, secretKey } = req.body;

    if (!username || !password) {
        return res.json({ success: false, message: "All fields are required" });
    }

    try {
        // Verify reCAPTCHA response
        const captchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;
        const verificationResponse = await axios.post(captchaVerificationUrl);
        const { success: captchaSuccess } = verificationResponse.data;

        if (!captchaSuccess) {
            return res.json({ success: false, message: 'Captcha verification failed' });
        }

        const user = await userModel.findOne({ where: { username } });

        if (!user) {
            return res.json({ success: false, message: 'Invalid Username' });
        } else if (await bcrypt.compare(password, user.password)) {
            req.session.user_id = user.id;
            req.session.user_name = user.fullname;
            req.session.user_type = user.type;
            return res.json({ success: true, message: 'Login successful' });
        } else {
            return res.json({ success: false, message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return res.json({ success: false, message: 'Error verifying reCAPTCHA response' });
    }
});


export default router;