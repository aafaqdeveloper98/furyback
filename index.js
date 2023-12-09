const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoute = require("./routes/userRoute")
const productRoute = require("./routes/productRoute")
const errorHandler = require("./middleWare/errorMiddleware")
const path = require("path")

const app = express()

// Middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors({
    origin: ["http://localhost:5173", "https://fury.aafaqhassan.com"],
    credentials: true,
}))

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes Middleware
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)


// Routes
app.get("/", (req, res) => {
    res.send("Welcome to home page...")
})

const PORT = process.env.PORT || 5000

// Error Middleware
app.use(errorHandler)


// Connect to DB and start server

mongoose
    .connect('mongodb+srv://aafaqisc:admin@dipeshcluster.lupetvq.mongodb.net/ndure?retryWrites=true&w=majority')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => console.log(err))