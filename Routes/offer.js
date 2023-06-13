const express = require("express");
const router = express.Router();
const offerModel = require("../models/offer-model")
const userInfo = require("../models/user-model")
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `uploads`)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}${file.originalname}`)
    }
});
const upload = multer({ storage: storage });

router.post("/offers", upload.single("offer_image"), async (req, res) => {
    try {
        const isAdmin = await userInfo.findById(res.user);
        if (isAdmin.role == "admin") {
            const { offer_id, offer_title, offer_description, offer_sort_order,
                days_of_week, dates_of_month, months_of_year, item, quantity } = req.body;

            const offerDetails = await offerModel.create({
                offer_id,
                offer_title,
                offer_description,
                offer_image: req.file.filename,
                offer_sort_order,
                content: {
                    item,
                    quantity,
                },
                schedule: {
                    days_of_week,
                    dates_of_month,
                    months_of_year
                }
            })
            // console.log(offerDetails)
            return res.status(200).json({
                message: "success",
                _id: isAdmin._id,
                offerDetails
            });
        } else {
            return res.send(401).json({
                message: "only admin can Access"
            })
        }
    } catch (err) {
        return res.send(400).json({ message: err.message })
    }
});

router.get("/offerlist", async (req, res) => {
    try {
        const offerlist = await offerModel.find();
        return res.status(200).json({
            message: "Success",
            Alloffer: offerlist
        })
    } catch (err) {
        return res.send(501).send({
            message: err.message
        })
    }
})


router.put("/offers/:offerId", async (req, res) => {
    try {
        const isAdmin = await userInfo.findById(res.user);
        if (isAdmin.role == "admin") {
            const { offerId } = req.params;
            const { offer_id, offer_title, offer_description, offer_sort_order,
                days_of_week, dates_of_month, months_of_year, item, quantity } = req.body;

            const updateFields = {
                offer_id,
                offer_title,
                offer_description,
                offer_sort_order,
                content: {
                    item,
                    quantity,
                },
                schedule: {
                    days_of_week,
                    dates_of_month,
                    months_of_year
                }
            }
            const updatedOffer = await offerModel.updateOne({ offerId }, updateFields);
            return res.status(200).json({
                message: "success",
                offerDetails: updatedOffer
            });
        } else {
            return res.status(401).send({ message: "only admin can access" })
        }
    } catch (err) {
        return res.status(501).send({ message: err.message })
    }
});


router.delete("/offers/:offerId", async (req, res) => {
    try {
        const delete_id = req.params.offerId;
        await offerModel.deleteOne({ _id: delete_id });
        res.status(200).send({ message: "Item deleted" })
    } catch (err) {
        res.status(501).send({ message: err.message })
    }
})

module.exports = router;
