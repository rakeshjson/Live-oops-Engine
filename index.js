const express = require("express");
const app = express();
const PORT = 8080

const offer = require("./Routes/offer")
const signUp = require("./routes/sigUp")
const signIn = require("./routes/signIn");

const JWT = require("jsonwebtoken");
const Cors = require("cors");

const connection = require("./config/connection");
connection();

app.use(Cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", offer)
app.use("/", signUp);
app.use("/", signIn);

app.use((req, res, next) => {
    try {
        if (req.url == "/login" || req.url == "/signup") {
            next();
        } else {
            let token = req.headers.authorization;
            JWT.verify(token, function (err, decoded) {
                if (err) {
                    return res.status(400).send({ message: err.message })
                }
                res.user = decoded.data;
                next()
            });
        }
    } catch (err) {
        return res.status(501).send({ message: err.message })
    }
})

app.listen(PORT, () => { console.log(`server listening at ${PORT}`) })
