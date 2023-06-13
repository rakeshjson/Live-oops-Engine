const mongoose = require("mongoose");

const connection = async () => {
    mongoose.set('strictQuery', true);
    await mongoose.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log("DB connected")
    }).catch(() => {
        console.log('BD connection Failed...!')
    })
}

module.exports = connection;