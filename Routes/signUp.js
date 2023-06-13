const express = require("express")
const router = express.Router();
const userInfo = require("../models/user-model");
const bcrypt = require("bcrypt");
const salt = 10;
const { body, validationResult } = require('express-validator');
const { userSignupValidation } = require("../config/utility")

router.get("/signup", (req, res) => {
    res.send("Get fromsignup")
})


router.post("/signup", userSignupValidation,
    async (req, res) => {
        const { username, email, password, role, age, installed_days, price } = req.body;
        // console.log(price)
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            const isUserExist = await userInfo.find({ email });
            if (isUserExist[0]?.email) {
                return res.status(400).send({ message: "User already exist" })
            }
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) {
                    return res.status(400).send({ message: err.message })
                }
                const userData = await userInfo.create({
                    username,
                    email,
                    age,
                    role,
                    installed_days,
                    ...price,
                    password: hash,
                })
                return res.status(200).send({
                    message: "sucess",
                    data: userData
                })
            })
        } catch (err) {
            return res.status(400).send({
                message: err.message
            })
        }

    });

router.put("/user/:emailId",
    async (req, res) => {
        const { emailId } = req.params;
        const { username, email, password, } = req.body;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            const user = await userInfo.findById(emailId);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            bcrypt.compareSync(req.body.oldpassword, user.password, function (err, result) {
                if (err) {
                    console.log(err)
                    return res.status(400).send({ message: err.message })
                }
                if (result) {
                    bcrypt.hash(req.body.newpassword, salt, async function (err, hash) {
                        if (err) {
                            return res.status(400).send({
                                message: err.message
                            })
                        }
                        const updatedUser = await userInfo.updateOne({ email }, { $set: { ...req.body, password: hash } });
                        const updatedData = await userInfo.findById({ emailId });
                        return res.status(200).json({
                            message: "updated successfully",
                            data: updatedData
                        })
                    })
                } else {
                    return res.status(400).send({ message: "Invalid password" })
                }

            })
        } catch (e) {
            return res.status(400).send({ message: e.message });
        }
    }
)

router.get("/userlist", async (req, res) => {
    try {
        const userlist = await userInfo.find();
        return res.status(200).json({
            message: "success",
            userlist
        })
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        const userlist = await userInfo.findByIdAndDelete({ _id: req.params.id })
        return res.status(200).json({
            message: "user Deleted",
            userlist
        })
    } catch (err) {
        return res.status(400).send({
            message: err.message
        });
    }
})

module.exports = router;
