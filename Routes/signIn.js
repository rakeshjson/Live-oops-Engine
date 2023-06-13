const express = require("express")
const router = express.Router();
const userInfo = require("../models/user-model");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken")

router.post("/api/v4/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await userInfo.find({ email });
        if (!userData[0]) {
            return res.status(400).json({
                message: "user Not Exists"
            })
        }
        bcrypt.compare(password, userData[0].password, async function (err, result) {
            if (err) {
                console.log(err)
                return res.status(400).send({ message: err })
            }
            if (result) {
                const Token = await JWT.sign({
                    data: userData[0].id
                }, process.env.SECRET_KEY, { expiresIn: '24_hours' });

                return res.status(200).json({
                    message: `${userData[0].username}  Login successfully`,
                    Token
                })
            } else {
                return res.status(400).send({ message: "incorrect password" })
            }
        })
    } catch (err) {
        return res.status(400).send({ message: err.message })
    }
})
module.exports = router;