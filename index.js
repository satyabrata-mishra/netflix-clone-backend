const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/netflixapp", require('./routes/userRoutes'));

app.get("/", (req, res) => {
    res.status(200).send("Hello from netflix clone backend.");
})

mongoose.connect(process.env.mongo_url, err => {
    if (err)
        console.log(err);
    else
        console.log("Database Connected.");
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started at port ${process.env.PORT || 5000}.`)
});